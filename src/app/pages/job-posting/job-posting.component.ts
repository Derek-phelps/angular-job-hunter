import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { State } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { DictionaryEntry, Opportunity, Company } from '@hellotemp/models';
import { Router } from '@angular/router';
import * as InterviewsActions from '../../store/interviews/interviews.actions';
import { Interview } from '@hellotemp/rest';
import { formatUrl } from '@hellotemp/util';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { filter, map, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { DestroyService } from '../../services/destroy.service';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.scss'],
  providers: [DestroyService],
})
export class JobPostingComponent implements OnInit, OnDestroy {
  private definitions$: Observable<State['definitions']> = this.store.select(state => state.definitions);
  private opportunities$: Observable<State['opportunities']> = this.store.select(state => state.opportunities);
  private auth$: Observable<State['auth']> = this.store.select(state => state.auth);
  private interviews$: Observable<State['interviews']> = this.store.select(state => state.interviews);

  public companies: DictionaryEntry = {};
  public jobTitles: DictionaryEntry = {};
  public skills: DictionaryEntry = {};
  public industries: DictionaryEntry = {};
  public software: DictionaryEntry = {};
  public certifications: DictionaryEntry = {};
  public opportunity!: Opportunity;
  public user: any;
  public interview!: Interview;
  public isLoading = false;
  public company!: Company;
  public formatUrl = formatUrl;
  public readMore = false;
  constructor(
    private store: Store<State>,
    private router: Router,
    private snackBar: MatSnackBar,
    private destroy: DestroyService,
  ) {
    combineLatest(this.definitions$, this.opportunities$, this.auth$, this.interviews$)
    .subscribe(([definitions, opportunities, auth, interviews]) => {
      this.opportunity = opportunities.currentOpportunity;
      this.interview = interviews.currentInterview;
      this.companies = definitions.dictionary.companies;
      if (definitions.companies.length > 0 && this.opportunity && this.opportunity.id) {
        this.company = definitions.dictionary.companies[this.opportunity.companyId] as Company;
      }
      this.jobTitles = definitions.dictionary.jobTitles;
      this.skills = definitions.dictionary.skills;
      this.industries = definitions.dictionary.industry;
      this.software = definitions.dictionary.software;
      this.certifications = definitions.dictionary.certifications;
      this.user = auth.user
      this.isLoading = opportunities.isGettingJobOpportunity || definitions.isGettingSkills || definitions.isGettingJobTitles || definitions.isGettingIndustries || definitions.isGettingSoftware || definitions.isGettingCertifications || definitions.isGettingCompanies || interviews.isGettingInterviews || false;

      if (!this.isLoading && !this.opportunity.id || !this.interview.id) {
        // if there isn't a current opportunity, we can't do anything on this page, so navigating away.
        this.router.navigate(['/']);
      }
    })
  }

  ngOnInit() {
    this.interviews$.pipe(
      map(s => s.interviewEvent),
      filter(event => event === 'rejectInterviewSuccess'),
      takeUntil(this.destroy.destroyed$),
    ).subscribe(() => {
      this.snackBar.open('Reject Interview Success');
      this.store.dispatch(InterviewsActions.updateInterviewEvent({event: ''}));
      this.router.navigate(['/']);
    });
    this.interviews$.pipe(
      map(s => s.interviewEvent),
      filter(event => event === 'rejectInterviewFailure'),
      takeUntil(this.destroy.destroyed$),
    ).subscribe(() => {
      this.store.dispatch(InterviewsActions.updateInterviewEvent({event: ''}));
      this.snackBar.open('Reject Interview Failure');
    });
  }

  ngOnDestroy() {}

  acceptInterview() {
    const params = {
      interviewId: this.interview.id,
      candidateId: this.user.candidate.id,
      opportunity: this.opportunity,
    }
    this.store.dispatch(InterviewsActions.acceptInterview(params));
  }

  rejectInterview() {
    const params = {
      interviewId: this.interview.id,
      candidateId: this.user.candidate.id as string,
      opportunity: this.opportunity,
    }
    this.store.dispatch(InterviewsActions.rejectInterview(params));
  }

}
