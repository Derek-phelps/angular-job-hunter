import { Action, createReducer, on} from '@ngrx/store';
import * as Actions from './engagements.actions';
import { Engagement } from '@hellotemp/models';

export interface State {
    isGettingEngagements: boolean;
    getEngagementsError: any;
    engagements: Engagement[];
    activeEngagements: Engagement[];
}

export const initialState: State = {
    isGettingEngagements: false,
    getEngagementsError: {},
    engagements: [],
    activeEngagements: [],
}

const engagementsReducer = createReducer(
    initialState,
    on(Actions.getEngagements, state => ({ ...state, isGettingEngagements: true, getEngagementsError: {} })),
    on(Actions.getEngagementsSuccess, (state, action) => ({ ...state, isGettingEngagements: false, engagements: action.engagements, activeEngagements: action.activeEngagements })),
    on(Actions.getEngagementsFailure, (state, action) => ({ ...state, isGettingEngagements: false, getEngagementsError: action.error })),
)

export function reducer(state: State | undefined, action: Action) {
    return engagementsReducer(state, action);
}
