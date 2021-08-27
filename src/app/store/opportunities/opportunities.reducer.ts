import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from './opportunities.actions';
import { Opportunity } from '@hellotemp/models';

export interface State {
    isGettingJobOpportunity: boolean;
    getJobOpportunityError: any;
    currentOpportunity: Opportunity | any;
}

export const initialState: State = {
    isGettingJobOpportunity: false,
    getJobOpportunityError: {},
    currentOpportunity: {},
}

const opportunitiesReducer = createReducer(
    initialState,
    // set current opportunity
    on(Actions.setCurrentOpportunity, (state, action) => ({ ...state, currentOpportunity: action.opportunity })),
        // get job opportunity
        on(Actions.getJobOpportunity, state => ({ ...state, isGettingJobOpportunity: true, getJobOpportunityError: {} })),
        on(Actions.getJobOpportunitySuccess, (state, action) => ({ ...state, isGettingJobOpportunity: false, currentOpportunity: action.opportunity })),
        on(Actions.getJobOpportunityFailure, (state, action) => ({ ...state, isGettingJobOpportunity: false, getJobOpportunityError: action.error })),
)

export function reducer(state: State | undefined, action: Action) {
    return opportunitiesReducer(state, action);
}