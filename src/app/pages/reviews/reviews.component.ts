import { Component, OnInit, OnDestroy } from '@angular/core';
import { Candidate } from '@hellotemp/models';
import { Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as ReviewsActions from '../../store/reviews/reviews.actions'
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  private candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);
  private reviews$: Observable<State['reviews']> = this.store.select(state => state.reviews);
  candidate!: Candidate | null;
  reviews: any;
  isGettingReviews = false;
  constructor(
    private store: Store<State>,
  ) {
    combineLatest(
      this.candidates$,
      this.reviews$,
    ).subscribe(([candidates, reviews]) => {
      this.candidate = candidates.candidate as Candidate;
      this.reviews = reviews.reviews;
      if (this.candidate && !this.isGettingReviews) {
        this.store.dispatch(ReviewsActions.getReviews({ candidateId: this.candidate.id }));
        this.isGettingReviews = true;
      }
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {}

}
