import { createAction, props } from '@ngrx/store';
import { Opportunity } from '@hellotemp/models';

export const setCurrentOpportunity = createAction(
    '[Opportunities] Set Current Opportunity',
    props<{ opportunity: any }>(),
)

export const getJobOpportunity = createAction(
    '[Opportunities] Get Job Opportunity',
    props<{ id: string, params?: any }>(),
)

export const getJobOpportunitySuccess = createAction(
    '[Opportunities] Get Job Opportunity Success',
    props<{ opportunity: Opportunity }>(),
)

export const getJobOpportunityFailure = createAction(
    '[Opportunities] Get Job Opportunity Failure',
    props<{ error: any }>(),
)