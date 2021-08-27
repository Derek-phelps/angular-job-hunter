import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as InterviewsActions from '../store/interviews/interviews.actions';
import * as EngagementsActions from '../store/engagements/engagements.actions';
import * as DefinitionsActions from '../store/definitions/definitions.actions';
import * as AuthActions from '../auth/store/auth.actions';
import { selectToken } from '../auth/store/auth.selectors';

import { State } from '../reducers';
import { Candidate } from '@hellotemp/models';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  interviews$: Observable<State['interviews']> = this.store.select(state => state.interviews);
  engagements$: Observable<State['engagements']> = this.store.select(state => state.engagements);
  auth$: Observable<State['auth']> = this.store.select(state => state.auth);
  candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);
  user: any;
  candidate: Candidate | null = null;
  public tokenLoaded = false;
  private isLoggingIn = false;
  private shouldGetInterviews = true;
  constructor(
    public router: Router,
    private store: Store<State>,
  ) { 
    combineLatest(this.auth$, this.candidates$)
    .subscribe(([auth, candidates]) => {
      if (auth.token && auth.userId) {
        if (!this.isLoggingIn && !auth.user.id) {
          this.isLoggingIn = true;
          this.store.dispatch(AuthActions.getLoggedInUser({ id: auth.userId }))
          this.store.dispatch(DefinitionsActions.getSkillDefinitions());
          this.store.dispatch(DefinitionsActions.getSoftwareDefinitions());
          this.store.dispatch(DefinitionsActions.getJobTitleDefinitions());
          this.store.dispatch(DefinitionsActions.getCertificationDefinitions());
          this.store.dispatch(DefinitionsActions.getIndustryDefinitions());
          this.store.dispatch(DefinitionsActions.getCompanies());
        }

        if (auth.user && auth.user.id) {
          this.isLoggingIn = false
          this.user = auth.user;
          this.candidate = candidates.candidate as Candidate;
          // can get the first two here as well as in the dashboard because we are using exhaust map.  Both are needed for other views
          if (this.candidate && this.candidate.id && this.shouldGetInterviews) {
            this.shouldGetInterviews = false;
            this.store.dispatch(InterviewsActions.getInterviews({ candidateId: this.candidate.id }));
            this.store.dispatch(EngagementsActions.getEngagements({ candidateId: this.candidate.id }));
          }
        }
      }
      this.store.pipe(select(selectToken)).subscribe(token => {
        if (token) {
          this.tokenLoaded = true
        } else {
          this.tokenLoaded = false
        }
      });
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

}
