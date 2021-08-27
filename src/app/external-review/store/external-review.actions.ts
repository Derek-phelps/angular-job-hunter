import { createAction, props } from '@ngrx/store';
import { HttpError } from '@hellotemp/models';

export const getCandidate = createAction(
    '[External Review] Get Candidate',
    props<{ id: string }>(),
)

export const getCandidateSuccess = createAction(
    '[External Review] Get Candidate Success',
    props<{ candidate: any }>(),
)

export const getCandidateFailure = createAction(
    '[External Review] Get Candidate Failure',
    props<{ error: HttpError }>(),
)

export const checkReview = createAction(
    '[External Review] Check Review',
    props<{ candidateId: string, reviewId: string }>(),
)

export const checkReviewSuccess = createAction(
    '[External Review] Check Review Success',
    props<{ status: any, externalReviewerId: string }>(),
)

export const checkReviewFailure = createAction(
    '[External Review] Check Review Failure',
    props<{ error: HttpError }>(),
)

export const createReview = createAction(
    '[External Review] Create Review',
    props<{ id: string, review: any, reviewId: string }>(),
)

export const createReviewSuccess = createAction(
    '[External Review] Create Review',
)

export const createReviewFailure = createAction(
    '[External Review] Create Review',
    props<{ error: HttpError }>(),
)

export const declineReview = createAction(
    '[External Review] Decline Review',
    props<{ review: any }>(),
)

export const declineReviewSuccess = createAction(
    '[External Review] Decline Review Success',
)

export const declineReviewFailure = createAction(
    '[External Review] Decline Review Failure',
    props<{ error: HttpError }>(),
)