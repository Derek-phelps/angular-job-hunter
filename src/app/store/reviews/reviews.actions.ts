import { createAction, props } from '@ngrx/store';
import { Candidate, HttpError } from '@hellotemp/models';
import { ExternalReviewer } from '@hellotemp/rest';

// export const createReview = createAction(
//     '[Candidates] Create Review',
//     props<{ candidate: Candidate, review: Review }>(),
// )

// export const createReviewSuccess = createAction(
//     '[Candidates] Create Review Success',
//     props<{ review: Review }>(),
// )

// export const createReviewFailure = createAction(
//     '[Candidates] Create Review Failure',
//     props<{ error: HttpError }>(),
// )

// export const updateReview = createAction(
//     '[Candidates] Update Review',
//     props<{ candidate: Candidate, review: Review }>(),
// )

// export const updateReviewSuccess = createAction(
//     '[Candidates] Update Review Success',
//     props<{ review: Review }>(),
// )

// export const updateReviewFailure = createAction(
//     '[Candidates] Update Review Failure',
//     props<{ error: HttpError }>(),
// )

// export const deleteReview = createAction(
//     '[Candidates] Delete Review',
//     props<{ candidate: Candidate, review: Review }>(),
// )

// export const deleteReviewSuccess = createAction(
//     '[Candidates] Delete Review Success',
// )

// export const deleteReviewFailure = createAction(
//     '[Candidates] Delete Review Failure',
//     props<{ error: HttpError }>(),
// )

export const createExternalReviewer = createAction(
    '[Reviews] Create External Reviewer',
    props<{ candidate: Candidate, externalReviewer: ExternalReviewer }>(),
)

export const createExternalReviewerSuccess = createAction(
    '[Reviews] Create External Reviewer Success',
    props<{ externalReviewer: ExternalReviewer }>(),
)

export const createExternalReviewerFailure = createAction(
    '[Reviews] Create External Reviewer Failure',
    props<{ error: HttpError }>(),
)

export const updateExternalReviewer = createAction(
    '[Reviews] Update External Reviewer',
    props<{ candidate: Candidate, externalReviewer: ExternalReviewer }>(),
)

export const updateExternalReviewerSuccess = createAction(
    '[Reviews] Update External Reviewer Success',
    props<{ externalReviewer: ExternalReviewer }>(),
)

export const updateExternalReviewerFailure = createAction(
    '[Reviews] Update External Reviewer Failure',
    props<{ error: HttpError }>(),
)

export const deleteExternalReviewer = createAction(
    '[Reviews] Delete External Reviewer',
    props<{ candidate: Candidate, externalReviewer: ExternalReviewer }>(),
)

export const deleteExternalReviewerSuccess = createAction(
    '[Reviews] Delete External Reviewer Success',
)

export const deleteExternalReviewerFailure = createAction(
    '[Reviews] Delete External Reviewer Failure',
    props<{ error: HttpError }>(),
)

export const getReviews = createAction(
    '[Reviews] Get Reviews',
    props<{ candidateId: string }>(),
)

export const getReviewsSuccess = createAction(
    '[Reviews] Get Reviews Success',
    props<{ reviews: any }>(),
)

export const getReviewsFailure = createAction(
    '[Reviews] Get Reviews Failure',
    props<{ error: HttpError }>(),
)

export const remindExternalReviewer = createAction(
    '[Reviews] Remind External Reviewer',
    props<{ candidateId: string, id: string}>(),
)

export const remindExternalReviewerSuccess = createAction(
    '[Reviews] Remind External Reviewer Success',
)

export const remindExternalReviewerFailure = createAction(
    '[Reviews] Remind External Reviewer',
    props<{ error: HttpError }>(),
)