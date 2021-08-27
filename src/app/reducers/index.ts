import {
    ActionReducerMap,
    MetaReducer,
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromInterviews from '../store/interviews/interviews.reducer';
import * as fromEngagements from '../store/engagements/engagements.reducer';
import * as fromDefinitions from '../store/definitions/definitions.reducer';
import * as fromOpportunities from '../store/opportunities/opportunities.reducer';
import * as fromCandidates from '../store/candidates/candidates.reducer';
import * as fromReviews from '../store/reviews/reviews.reducer';
import * as fromExternal from '../external-review/store/external-review.reducer';
export interface State {
    auth: fromAuth.State;
    interviews: fromInterviews.State;
    engagements: fromEngagements.State;
    definitions: fromDefinitions.State;
    opportunities: fromOpportunities.State;
    candidates: fromCandidates.State;
    reviews: fromReviews.State;
    externalReviews: fromExternal.State;
}

export const reducers: ActionReducerMap<State> = {
    auth: fromAuth.reducer,
    interviews: fromInterviews.reducer,
    engagements: fromEngagements.reducer,
    definitions: fromDefinitions.reducer,
    opportunities: fromOpportunities.reducer,
    candidates: fromCandidates.reducer,
    reviews: fromReviews.reducer,
    externalReviews: fromExternal.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [fromAuth.logout] : [fromAuth.logout];