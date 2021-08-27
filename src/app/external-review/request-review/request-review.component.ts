import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Candidate } from '@hellotemp/models';
import * as ExternalReviewActions from '../store/external-review.actions';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-request-review',
  templateUrl: './request-review.component.html',
  styleUrls: ['./request-review.component.scss']
})
export class RequestReviewComponent implements OnInit, OnDestroy {
  external$: Observable<State['externalReviews']> = this.store.select(state => state.externalReviews);

  public candidate!: Candidate;
  private reviewId!: string;
  private candidateId!: string;
  private externalReviewerId!: string
  public stars = 0;
  public form: FormGroup;
  public submitting = false;
  public status = 0;
  constructor(
    private store: Store<State>,
    private router: ActivatedRoute,
  ) {
    const { candidateId, reviewId } = this.router.snapshot.params
    this.store.dispatch(ExternalReviewActions.getCandidate({ id: candidateId }))
    this.store.dispatch(ExternalReviewActions.checkReview({ candidateId, reviewId }))
    this.candidateId = candidateId;
    this.reviewId = reviewId;

    this.external$.subscribe(external => {
      this.candidate = external.candidate;
      this.externalReviewerId = external.externalReviewerId;
      this.submitting = external.isCreatingReview;
      this.status = external.reviewStatus;
    })
    this.form = this.initForm();
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  initForm() {
    return new FormGroup({
      title: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
    })
  }

  starsChange(event: number) {
    this.stars = event;
  }

  submit() {
    if (this.form.valid && this.stars > 0) {
      const { value } = this.form;
      const review = {
        externalReviewerProfileId: this.externalReviewerId,
        rating: this.stars,
        summary: value.title,
        text: value.body,
      }
      this.form = this.initForm();
      this.stars = 0;
      this.store.dispatch(ExternalReviewActions.createReview({ id: this.candidateId, review, reviewId: this.reviewId }));
    }
  }
}
