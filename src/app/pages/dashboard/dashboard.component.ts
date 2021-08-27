import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import { interviewStatus } from '../../store/interviews/interviews.reducer';
import { InterviewStatusObject, DictionaryEntry, Engagement, Opportunity } from '@hellotemp/models';
import { Router } from '@angular/router';
import * as OpportunitiesActions from '../../store/opportunities/opportunities.actions';
import * as InterviewsActions from '../../store/interviews/interviews.actions';
import { Interview } from '@hellotemp/rest';
import { selectUser } from '../../auth/store/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getEngagements } from '../../store/engagements/engagements.actions';

@Component({
  selector: 'hellotemp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private definitions$: Observable<State['definitions']> = this.store.select(state => state.definitions);
  private interviews$: Observable<State['interviews']> = this.store.select(state => state.interviews);
  private engagements$: Observable<State['engagements']> = this.store.select(state => state.engagements);
  private candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);

  public interviewStatus: InterviewStatusObject = interviewStatus;
  public jobTitles: DictionaryEntry = {};
  public activeEngagements: Engagement[] = [];
  public companies: DictionaryEntry = {};
  public isLoading = true;
  public noJobs = true;
  private shouldGetInterviews = true;
  constructor(
    private store: Store<State>,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.store.pipe(
      select(selectUser),
      takeUntil(this.destroy$),
    ).subscribe((user) => {
      if (user && user.id) {

      }
    })
    combineLatest(this.definitions$, this.interviews$, this.engagements$, this.candidates$)
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe(([definitions, interviews, engagements, candidates]) => {
      this.jobTitles = definitions.dictionary.jobTitles;
      this.interviewStatus = interviews.interviewStatus;
      this.activeEngagements = engagements.activeEngagements;
      this.companies = definitions.dictionary.companies;
      if (!candidates.candidate || candidates.isGettingCandidate || interviews.isGettingInterviews || engagements.isGettingEngagements) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
      if (this.interviewStatus.interviewAccepted.length > 0 || this.interviewStatus.interviewCompleted.length > 0 || this.interviewStatus.interviewRequested.length > 0 || this.interviewStatus.jobOffered.length > 0 || this.interviewStatus.offerAccepted.length > 0 || this.activeEngagements.length > 0) {
        this.noJobs = false;
      }
      if (candidates.candidate && candidates.candidate.id && this.shouldGetInterviews) {
        this.shouldGetInterviews = false;
        this.store.dispatch(InterviewsActions.getInterviews({ candidateId: candidates.candidate.id }));
        this.store.dispatch(getEngagements({ candidateId: candidates.candidate.id }));
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  navigateToOpportunity(interview: Interview) {
    this.store.dispatch(InterviewsActions.setCurrentInterview({ interview }))
    this.store.dispatch(OpportunitiesActions.getJobOpportunity({ id: interview.opportunityId }));
    this.router.navigate(['/', 'job-posting', interview.opportunityId])
  }

}
