import { createAction, props } from '@ngrx/store';
import { Engagement } from '@hellotemp/models';

export const getEngagements = createAction(
    '[Engagements] Get Engagements',
    props<{ candidateId: string }>(),
)

export const getEngagementsSuccess = createAction(
    '[Engagements] Get Engagements Success',
    props<{ engagements: Engagement[], activeEngagements: Engagement[] }>(),
)

export const getEngagementsFailure = createAction(
    '[Engagements] Get Engagements Failure',
    props<{ error: any }>(),
)
