import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import * as ExternalReviewActions from './external-review.actions';
import { CandidateService } from '@hellotemp/rest';
import { Candidate } from '@hellotemp/models';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { AlertService } from '../../services/alert-service.service';
import { MatDialogRef } from '@angular/material';

@Injectable()

export class ExternalReviewEffects {
    getCandidate$ = createEffect(() =>
        this.action$.pipe(
            ofType(ExternalReviewActions.getCandidate),
            exhaustMap((action) => this.candidateService.getCandidatesIdSummary(action.id)
                .pipe(
                    map((res: any) => {
                        return ExternalReviewActions.getCandidateSuccess({ candidate: new Candidate(res)})
                    }),
                    catchError((error: any) => of(ExternalReviewActions.getCandidateFailure({ error }))),
                ),
            ),
        ),
    )

    checkReviewStatus$ = createEffect(() =>
        this.action$.pipe(
            ofType(ExternalReviewActions.checkReview),
            exhaustMap((action) => this.candidateService.getCandidatesCandidateIdReviewRequestsIdStatus({ candidateId: action.candidateId, id: action.reviewId })
                .pipe(
                    map((res: any) => {
                        return ExternalReviewActions.checkReviewSuccess({ status: parseInt(res.request_status, 10), externalReviewerId: res.externalReviewerId })
                    }),
                    catchError((error: any) => of(ExternalReviewActions.checkReviewFailure({ error }))),
                ),
            ),
        ),
    )

    createReview$ = createEffect(() => 
        this.action$.pipe(
            ofType(ExternalReviewActions.createReview),
            exhaustMap((action) => {
                const loading: MatDialogRef<any> = this.alertService.loading('Submitting review');
                return this.candidateService.postCandidatesCandidateIdReviews({ candidateId: action.id, CandidateReview: action.review })
                .pipe(
                    map((res: any) => {
                        loading.close();
                        this.alertService.message('Success!', 'Review Submitted.');
                        this.store.dispatch(ExternalReviewActions.checkReview({ candidateId: action.id, reviewId: action.reviewId }))
                        return ExternalReviewActions.createReviewSuccess()
                    }),
                    catchError((error: any) => {
                        loading.close();
                        this.alertService.message('Error', 'Unable to Submit Review');
                        return of(ExternalReviewActions.createReviewFailure({ error }))
                    }),
                );
            }),
        ),
    )


    constructor(
        private action$: Actions,
        private candidateService: CandidateService,
        private store: Store<State>,
        private alertService: AlertService,
    ) {}
}