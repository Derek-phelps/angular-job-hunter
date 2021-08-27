import { Action, createReducer, on } from '@ngrx/store';
import * as ReviewsActions from './reviews.actions';
import { HttpError } from '@hellotemp/models';

export interface State {
    isCreatingExternalReviewer: boolean;
    createExternalReviewerError: HttpError | any;
    isUpdatingExternalReviewer: boolean;
    updateExternalReviewerError: HttpError | any;
    isDeletingExternalReviewer: boolean;
    deleteExternalReviewerError: HttpError | any;
    isGettingReviews: boolean;
    isRemindingReviewer: boolean;
    getReviewsError: HttpError | any;
    remindReviewerError: HttpError | any;
    reviews: any;
}

export const initialState: State = {
    isCreatingExternalReviewer: false,
    createExternalReviewerError: {},
    isUpdatingExternalReviewer: false,
    updateExternalReviewerError: {},
    isDeletingExternalReviewer: false,
    deleteExternalReviewerError: {},
    isGettingReviews: false,
    isRemindingReviewer: false,
    getReviewsError: null,
    remindReviewerError: null,
    reviews: [],
}

const reviewsReducer = createReducer(
    initialState,
    // create external reviewer
    on(ReviewsActions.createExternalReviewer, state => ({ ...state, isCreatingExternalReviewer: true, createExternalReviewerError: {} })),
    on(ReviewsActions.createExternalReviewerSuccess, (state, action) => ({ ...state, isCreatingExternalReviewer: false })),
    on(ReviewsActions.createExternalReviewerFailure, (state, action) => ({ ...state, isCreatingExternalReviewer: false, createExternalReviewerError: action.error })),
    // update external reviewer
    on(ReviewsActions.updateExternalReviewer, state => ({ ...state, isUpdatingExternalReviewer: true, updateExternalReviewerError: {} })),
    on(ReviewsActions.updateExternalReviewerSuccess, (state, action) => ({ ...state, isUpdatingExternalReviewer: false })),
    on(ReviewsActions.updateExternalReviewerFailure, (state, action) => ({ ...state, isUpdatingExternalReviewer: false, updateExternalReviewerError: action.error })),
    // delete external reviewer
    on(ReviewsActions.deleteExternalReviewer, state => ({ ...state, isDeletingExternalReviewer: true, deleteExternalReviewerError: {} })),
    on(ReviewsActions.deleteExternalReviewerSuccess, (state, action) => ({ ...state, isDeletingExternalReviewer: false })),
    on(ReviewsActions.deleteExternalReviewerFailure, (state, action) => ({ ...state, isDeletingExternalReviewer: false, deleteExternalReviewerError: action.error })),
    // get reviews
    on(ReviewsActions.getReviews, state => ({ ...state, isGettingReviews: true, getReviewsError: {} })),
    on(ReviewsActions.getReviewsSuccess, (state, action) => ({ ...state, isGettingReviews: false, reviews: action.reviews })),
    on(ReviewsActions.getReviewsFailure, (state, action) => ({ ...state, isGettingReviews: false, getReviewsError: action.error })),
    // remind external reviewer
    on(ReviewsActions.remindExternalReviewer, state => ({ ...state, isRemindingReviewer: true, remindReviewerError: null })),
    on(ReviewsActions.remindExternalReviewerSuccess, (state, action) => ({ ...state, isRemindingReviewer: false })),
    on(ReviewsActions.remindExternalReviewerFailure, (state, action) => ({ ...state, isRemindingReviewer: false, remindReviewerError: action.error })),
)


export function reducer(state: State | undefined, action: Action) {
    return reviewsReducer(state, action);
}