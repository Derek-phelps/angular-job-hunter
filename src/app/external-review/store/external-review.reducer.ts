import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from './external-review.actions';
import { HttpError } from '@hellotemp/models';

export interface State {
    isCheckingReviewStatus: boolean;
    checkReviewStatusError: HttpError | any;
    reviewStatus: any;
    isGettingCandidate: any;
    getCandidateError: HttpError | any;
    candidate: any;
    isDecliningReview: boolean;
    declineReviewError: HttpError | any;
    isCreatingReview: boolean;
    createReviewError: HttpError | any;
    externalReviewerId: string;
}

export const initialState: State = {
    isCheckingReviewStatus: false,
    checkReviewStatusError: null,
    reviewStatus: null,
    isGettingCandidate: false,
    getCandidateError: null,
    candidate: null,
    isDecliningReview: false,
    declineReviewError: null,
    isCreatingReview: false,
    createReviewError: null,
    externalReviewerId: '',
}

const externalReviewReducer = createReducer(
    initialState,
    // check review status
    on(Actions.checkReview, state => ({ ...state, isCheckingReviewStatus: true, checkReviewStatusError: null })),
    on(Actions.checkReviewSuccess, (state, action) => ({ ...state, isCheckingReviewStatus: false, reviewStatus: action.status, externalReviewerId: action.externalReviewerId })),
    on(Actions.checkReviewFailure, (state, action) => ({ ...state, isCheckingReviewStatus: false, checkReviewStatusError: action.error })),
    // get candidate
    on(Actions.getCandidate, state => ({ ...state, isGettingCandidate: true, getCandidateError: null })),
    on(Actions.getCandidateSuccess, (state, action) => ({ ...state, isGettingCandidate: false, candidate: action.candidate})),
    on(Actions.getCandidateFailure, (state, action) => ({ ...state, isGettingCandidate: false, getCandidateError: action.error })),
    // decline review
    on(Actions.declineReview, state => ({ ...state, isDecliningReview: true, declineReviewError: null })),
    on(Actions.declineReviewSuccess, (state, action) => ({ ...state, isDecliningReview: false })),
    on(Actions.declineReviewFailure, (state, action) => ({ ...state, isDecliningReview: false, declineReviewError: action.error })),
    // create review
    on(Actions.createReview, state => ({ ...state, isCreatingReview: true, createReviewError: null })),
    on(Actions.createReviewSuccess, (state, action) => ({ ...state, isCreatingReview: false, reviewStatus: null })),
    on(Actions.createReviewFailure, (state, action) => ({ ...state, isCreatingReview: false, createReviewError: action.error })),
)

export function reducer(state: State | undefined, action: Action) {
    return externalReviewReducer(state, action);
}