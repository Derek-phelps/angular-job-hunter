import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State } from '../../../reducers';
import { map } from 'rxjs/operators';
import { selectOffers } from '../../../store/interviews/intervews.selectors';
import { Interview, User, Company, Engagement } from '@hellotemp/rest';
import { DictionaryEntry, OfferPartial } from '@hellotemp/models';
import * as InterviewsActions from '../../../store/interviews/interviews.actions';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { CreateOfferComponent } from 'libs/ui/src/lib/create-offer/create-offer.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { MessagesPageService } from '../messages-page.service';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit, OnDestroy {
  public interviewId: string | null = null;
  public interview!: Interview;
  public offers: any[] = [];
  public user!: User;
  public jobTitles!: DictionaryEntry;
  public company!: Company;
  public loading!: boolean;
  public disabled = false;
  public message = '';
  public disableAccepted = false;
  shouldGetInterviews = true;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    public dialog: MatDialog,
    private messagesPageService: MessagesPageService,
  ) { }

  ngOnInit() {
    this.route.paramMap
    .pipe(
      map((paramMap: ParamMap) => paramMap ? paramMap.get('id') : null),
    ).subscribe(id => {
      this.messagesPageService.setNavState(id ? 'closed' : 'opened');
      this.interviewId = id;

      if (id) {
        this.store.pipe(select(selectOffers, id))
        .subscribe(offers => {
          this.interview = offers.interview;
          if (this.interview && this.interview.candidateId && this.shouldGetInterviews) {
            this.shouldGetInterviews = false;
            this.store.dispatch(InterviewsActions.getInterviews({ candidateId: this.interview.candidateId }));
          }
          this.handleInterviewStatus();
          this.offers = offers.interview && offers.interview.offers ? offers.interview.offers : [];
          this.handleDisableAccepted();
          this.user = offers.user;
          this.jobTitles = offers.jobTitles;
          this.company = offers.company as any;
          this.loading = offers.loading;
        })
      }
    })
  }

  ngOnDestroy() {}

  accept() {
    const offer = this.offers[this.offers.length - 1]
    const engagement: Partial<Engagement> = {
      name: this.jobTitles[this.interview.opportunity.jobTitleId].name,
      rate: offer.amount,
      candidateId: this.interview.candidateId,
      acceptedOfferId: offer.id,
      opportunityId: this.interview.opportunityId,
      startDate: this.interview.startDate,
      endDate: this.interview.endDate,
      reasonClosed: 0,
      description: this.interview.opportunity.description,
      richTextDescription: this.interview.opportunity.richTextDescription,
      criminalHistoryCheck: this.interview.opportunity.criminalHistoryCheck,
      priorEmploymentVerification: this.interview.opportunity.priorEmploymentVerification,
      educationVerificaiton: this.interview.opportunity.educationVerificaiton,
      referenceCheck: this.interview.opportunity.referenceCheck,
      creditBackgroundCheck: this.interview.opportunity.creditBackgroundCheck,
      tenPanelDrugScreening: this.interview.opportunity.tenPanelDrugScreening,
      twelvePanelDrugScreening: this.interview.opportunity.twelvePanelDrugScreening,
      professionalLicenseCheck: this.interview.opportunity.professionalLicenseCheck,
      socialSecurityNumberTrace: this.interview.opportunity.socialSecurityNumberTrace,
      sexualOffenderRegistryCheck: this.interview.opportunity.sexualOffenderRegistryCheck,
    };
    this.store.dispatch(InterviewsActions.acceptOffer({ interview: this.interview, engagement }));
  }

  counter() {
    const dialogRef = this.dialog.open(CreateOfferComponent, {
      width: '540px',
      data: {
        opportunity: this.interview.opportunity,
        locations: this.company.locations,
        isCandidate: true,
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const offer: OfferPartial = {
          // tslint:disable:no-non-null-assertion
          interviewId: this.interviewId!,
          Offer: {
            interviewId: this.interviewId!,
            amount: result.rate,
            offeredByCandidateId: this.user.candidate.id,
          },
          // tslint:enable:no-non-null-assertion
        }
        this.store.dispatch(InterviewsActions.counterOffer({ offer, interview: this.interview }))
      }
    })
  }

  decline() {
    this.store.dispatch(InterviewsActions.declineOffer({ interview: this.interview }));
  }

  handleDisableAccepted() {
    if (this.offers) {
      if (this.offers.length > 0 && this.offers[this.offers.length - 1].offeredByCandidateId) {
        this.disableAccepted = true;
        return
      }
    }
    this.disableAccepted = false;
  }

  handleInterviewStatus() {
    if (this.interview) {
      if (this.interview.status === 5) {
        this.disabled = true;
        this.message = 'Offer has been accepted!'
        return
      }
      if (this.interview.status === 7) {
        this.disabled = true;
        this.message = 'Offer has been declined'
        return
      }
      this.disabled = false;
      this.message = '';
    }
  }

}
