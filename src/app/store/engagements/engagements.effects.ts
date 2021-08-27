import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom } from 'rxjs/operators';

import * as EngagementsActions from './engagements.actions';
import { EngagementService, Engagement as EngagmentDTO } from '@hellotemp/rest';
import { Engagement, Candidate } from '@hellotemp/models';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

@Injectable()

export class EngagementsEffects {
    engagements$ = createEffect(() =>
        this.action$.pipe(
            ofType(EngagementsActions.getEngagements),
            withLatestFrom(this.store),
            exhaustMap(([action, store]) => {
                const { candidateId } = action;
                const engagementParams = {
                    filter: [`candidateId||eq||${candidateId}`],
                    join: ['opportunity'],
                  }
                return this.engagementService.getEngagements(engagementParams)
                .pipe(
                    map((res: any) => {
                        const engagements: Engagement[] = res.map((e: EngagmentDTO) => new Engagement(e));
                        const activeEngagements = engagements.filter((e: Engagement) => {
                            const today = new Date();
                            if (Number(e.reasonClosed) > 0) { return false }
                            return !(today < new Date(e.startDate) || today > new Date(e.endDate));

                        });
                        return EngagementsActions.getEngagementsSuccess({ engagements, activeEngagements });
                    }),
                    catchError((error: any) => of(EngagementsActions.getEngagementsFailure({ error }))),
                )
            }),
        ),
    )

    constructor(
        private action$: Actions,
        private engagementService: EngagementService,
        private store: Store<State>,
    ) {}
}
