import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { of, from, Observable } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as ReviewsActions from './reviews.actions';
import * as AuthActions from '../../auth/store/auth.actions';
import * as DefinitionsActionf from '../definitions/definitions.actions';
import { CandidateService, ReviewerService } from '@hellotemp/rest';
import { Candidate } from '@hellotemp/models';
import { Router } from '@angular/router';
import * as CandidatesActions from '../candidates/candidates.actions';
import { ReviewRequestService } from '../../services/review-request.service';
import { AlertService } from '../../services/alert-service.service';
import { MatDialogRef } from '@angular/material';

@Injectable()
export class ReviewsEffects{
    // createReview$ = createEffect(() => 
    //     this.actions$.pipe(
    //         ofType(ReviewsActions.createReview),
    //         exhaustMap((action) => {
    //             return this.candidateService.postRev
    //         })
    //     )
    // )

    createExternalReviewerer$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ReviewsActions.createExternalReviewer),
            withLatestFrom(this.store),
            exhaustMap(([action, store]) => {
                const alert: MatDialogRef<any> = this.alertService.loading('Sending Review Request...')
                const candidate = store.candidates.candidate as Candidate;
                const reviewRequest = {
                    candidateId: candidate.id,
                    externalReviewer: action.externalReviewer,
                } as any;
                return this.candidateService.postCandidatesCandidateIdReviewRequests({ candidateId: candidate.id, ReviewRequest: reviewRequest })
                .pipe(
                    map((res: any) => {
                        alert.close();
                        this.alertService.message('Success!', 'Review Request Sent.');
                        this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                        return ReviewsActions.createExternalReviewerSuccess({ externalReviewer: res })
                    }),
                    catchError((error: any) => {
                        alert.close();
                        this.alertService.message('Error', 'Unable to Send Review Request.');
                        return of(ReviewsActions.createExternalReviewerFailure({ error }))
                    }),
                )
            }),
        ),
    )

    updateExternalReviewerer$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ReviewsActions.updateExternalReviewer),
            exhaustMap((action) => {
                const alert: MatDialogRef<any> = this.alertService.loading('Updating External Reviewer...')
                return this.reviewerService.patchReviewersId({ id: action.externalReviewer.id, ExternalReviewer: action.externalReviewer })
                .pipe(
                    map((res: any) => {
                        alert.close();
                        this.alertService.message('Success!', 'External Reviewer Updated.');
                        this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                        return ReviewsActions.updateExternalReviewerSuccess({ externalReviewer: res })
                    }),
                    catchError((error: any) => {
                        alert.close();
                        this.alertService.message('Error', 'Unable to Update External Reviewer.');
                        return of(ReviewsActions.updateExternalReviewerFailure({ error }))
                    }),
                )
            }),
        ),
    )

    deleteExternalReviewer$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ReviewsActions.deleteExternalReviewer),
            exhaustMap((action) => {
                return this.reviewerService.deleteReviewersId(action.externalReviewer.id)
                .pipe(
                    map((res: any) => {
                        return ReviewsActions.deleteExternalReviewerSuccess()
                    }),
                    catchError((error: any) => of(ReviewsActions.deleteExternalReviewerFailure({ error }))),
                )
            }),
        ),
    )

    getReviews$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ReviewsActions.getReviews),
            exhaustMap((action) => {
                return this.candidateService.getCandidatesCandidateIdReviews({ candidateId: action.candidateId })
                .pipe(
                    map((res: any) => {
                        return ReviewsActions.getReviewsSuccess({ reviews: res });
                    }),
                    catchError((error: any) => of(ReviewsActions.getReviewsFailure({ error }))),
                )
            }),
        ),
    )

    remindExternalReviewer$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ReviewsActions.remindExternalReviewer),
            exhaustMap((action) => {
                const loading = this.alertService.loading('Sending');
                return this.reviewRequestService.remind(action.candidateId, action.id)
                .pipe(
                    map((res: any) => {
                        loading.close();
                        this.alertService.message('Success', 'Email Sent');
                        return ReviewsActions.remindExternalReviewerSuccess();
                    }),
                    catchError((error: any) => {
                        this.alertService.message('Error', 'Unable to send email');
                        return of(ReviewsActions.remindExternalReviewerFailure({ error }))
                    }),
                );
            }),
        ),
    )

    constructor (
        private actions$: Actions,
        private store: Store<State>,
        private candidateService: CandidateService,
        private reviewerService: ReviewerService,
        private reviewRequestService: ReviewRequestService,
        private router: Router,
        private alertService: AlertService,
    ) {}
}