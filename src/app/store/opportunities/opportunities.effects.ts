import { Injectable } from '@angular/core';
import { Effect, Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom } from 'rxjs/operators';
import * as OpportunitiesActions from './opportunities.actions';
import { OpportunityService } from '@hellotemp/rest';

@Injectable()

export class OpportunitiesEffects {
    // gets a single job opportunity
    opportunity$ = createEffect(() => 
        this.action$.pipe(
            ofType(OpportunitiesActions.getJobOpportunity),
            exhaustMap((action) => {
                const { id, params } = action;
                return this.opportunityService.getOpportunitiesId({ id, ...params })
                .pipe(
                    map((res: any) => OpportunitiesActions.getJobOpportunitySuccess({ opportunity: res })),
                    catchError((error: any) => of(OpportunitiesActions.getJobOpportunityFailure({ error }))),
                )
            }),
        ),
    )

    constructor(
        private action$: Actions,
        private opportunityService: OpportunityService,
    ) {}
}