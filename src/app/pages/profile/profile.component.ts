import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { DictionaryEntry, Candidate, Dictionary } from '@hellotemp/models';
import { remindExternalReviewer } from '../../store/reviews/reviews.actions';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private definitions$: Observable<State['definitions']> = this.store.select(state => state.definitions);
  private candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);

  candidate!: Candidate;
  jobTitles: DictionaryEntry = {};
  dictionary!: Dictionary;
  constructor(
    public router: Router,
    private store: Store<State>,
  ) { 
    combineLatest(this.definitions$, this.candidates$)
    .subscribe(([definitions, candidates]) => {
      this.dictionary = definitions.dictionary;
      this.jobTitles = definitions.dictionary.jobTitles;
      this.candidate = candidates.candidate as Candidate;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  remindReviewer(reviewer: any) {
    this.store.dispatch(remindExternalReviewer({ candidateId: this.candidate.id, id: reviewer.id }))
  }

}
