import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, timer, combineLatest } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom, switchMap, mapTo, takeUntil } from 'rxjs/operators';

import * as InterviewsActions from './interviews.actions';
import { InterviewService, Interview, EngagementService } from '@hellotemp/rest';
import { getEnumAsEntries } from '@hellotemp/util';
import { Status } from '@hellotemp/enum';
import { Candidate } from '@hellotemp/models';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { handleInterviewStatus } from '@hellotemp/util';
import { SubscriptionService } from '../../services/subscription.service';
import { AlertService } from '../../services/alert-service.service';

@Injectable()

export class InterviewsEffects {
    interviews$ = createEffect(() =>
        this.action$.pipe(
            ofType(InterviewsActions.getInterviews),
            withLatestFrom(this.store),
            exhaustMap(([action, store]) => {
                const { candidateId } = action;
                const interviewParams = {
                    filter: [`candidateId||eq||${candidateId}`],
                    join: ['opportunity'],
                  }
                return this.interviewService.getInterviews(interviewParams)
                .pipe(
                    map((res: any) => {
                        return InterviewsActions.getInterviewsSuccess({ interviews: res,  status: handleInterviewStatus(res) })
                    }),
                    catchError((error: any) => of(InterviewsActions.getInterviewsFailure({ error }))),
                )
            }),
        ),
    )

    acceptInterview$ = createEffect(() => 
        this.action$.pipe(
            ofType(InterviewsActions.acceptInterview),
            exhaustMap((action) => {
                const { interviewId, candidateId, opportunity } = action;
                const params = {
                    id: interviewId,
                    Interview: {
                        status: 1,
                        startDate: opportunity.startDate,
                        endDate: opportunity.endDate,
                        notes: '',
                        opportunityId: opportunity.id,
                        user: candidateId,
                    },
                } as any;
                return this.interviewService.patchInterviewsId(params)
                .pipe(
                    map((res: any) => {
                        this.store.dispatch(InterviewsActions.getInterviews({ candidateId }));
                        return InterviewsActions.acceptInterviewSuccess()
                    }),
                    catchError((error: any) => of(InterviewsActions.acceptInterviewFailure({ error }))),
                );
            }),
        ),
    )

    acceptOffer$ = createEffect(() => 
        this.action$.pipe(
            ofType(InterviewsActions.acceptOffer),
            exhaustMap(action => {
                const { interview: { opportunity, candidate, ...interviewObj} } = action;
                const params = {
                    id: interviewObj.id,
                    Interview: {
                        ...interviewObj,
                        status: 5,
                    },
                } as any;
                const alert = this.alertService.loading('Accepting Offer')
                return combineLatest([
                    this.interviewService.patchInterviewsId(params),
                    this.engagementService.postEngagements(action.engagement as any),
                ])
                .pipe(
                    map((res: any) => {
                        alert.close();
                        this.alertService.message('Success', 'Offer Accepted');
                        return InterviewsActions.acceptOfferSuccess({ interview: { ...res[0], opportunity } })
                    }),
                    catchError((error: any) => {
                        alert.close();
                        this.alertService.message('Error', 'Unable to accept offer');
                        return of(InterviewsActions.acceptOfferFailure({ error }))
                    }),
                );
            }),
        ),
    )

    counterOffer$ = createEffect(() =>
        this.action$.pipe(
            ofType(InterviewsActions.counterOffer),
            exhaustMap(action => {
                const alert = this.alertService.loading('Sending Counter Offer');
                return this.interviewService.postInterviewsInterviewIdOffers(action.offer as any)
                .pipe(
                    map((res: any) => {
                        alert.close();
                        return InterviewsActions.counterOfferSuccess({ offer: res, interview: action.interview });
                    }),
                    catchError((error: any) => of(InterviewsActions.counterOfferFailure({ error }))),
                );
            }),
        ),
    )

    counterOfferSuccess = createEffect(() => 
        this.action$.pipe(
            ofType(InterviewsActions.counterOfferSuccess),
            exhaustMap(action => {
                const { interview: { opportunity, candidate, offers, ...interviewObj} } = action;
                const params = {
                    id: interviewObj.id,
                    Interview: {
                        ...interviewObj,
                        status: 4,
                    },
                } as any;
                return this.interviewService.patchInterviewsId(params)
                .pipe(
                    map((res: any) => {
                        return InterviewsActions.updateInterviewSuccess({ interview: { ...res, opportunity } });
                    }),
                    catchError((error: any) => of(InterviewsActions.updateInterviewFailure({ error }))),
                );
            }),
        ),
    )

    declineOffer$ = createEffect(() =>
        this.action$.pipe(
            ofType(InterviewsActions.declineOffer),
            exhaustMap(action => {
                const { interview: { opportunity, candidate, ...interviewObj} } = action;
                const params = {
                    id: interviewObj.id,
                    Interview: {
                        ...interviewObj,
                        status: 7,
                    },
                } as any;
                return this.interviewService.patchInterviewsId(params)
                .pipe(
                    map((res: any) => {
                        return InterviewsActions.declineOfferSuccess({ interview: { ...res, opportunity } })
                    }),
                    catchError((error: any) => of(InterviewsActions.declineOfferFailure({ error }))),
                );
            }),
        ),
    )

    getMessages$ = createEffect(() => 
        this.action$.pipe(
            ofType(InterviewsActions.getMessages),
            switchMap((action) => timer(0, 5000).pipe(
                mapTo(action),
                takeUntil(this.subService.unsubMessages$),
            )),
            exhaustMap((action) => this.interviewService.getInterviewsInterviewIdMessages({ interviewId: action.id })
                .pipe(
                    map((res: any) => InterviewsActions.getMessagesSuccess({ messages: res })),
                    catchError((error: any) => of(InterviewsActions.getMessagesFailure({ error }))),
                ),
            ),
        ),
    )

    rejectInterview$ = createEffect(() => 
        this.action$.pipe(
            ofType(InterviewsActions.rejectInterview),
            exhaustMap((action) => {
                const { interviewId, candidateId, opportunity } = action;
                const params = {
                    id: interviewId,
                    Interview: {
                        status: 6,
                        startDate: opportunity.startDate,
                        endDate: opportunity.endDate,
                        notes: '',
                        opportunityId: opportunity.id,
                        user: candidateId,
                    },
                } as any;
                return this.interviewService.patchInterviewsId(params)
                .pipe(
                    map((res: any) => InterviewsActions.rejectInterviewSuccess()),
                    catchError((error: any) => of(InterviewsActions.rejectInterviewFailure({ error }))),
                );
            }),
        ),
    )

    sendMessage$ = createEffect(() =>
        this.action$.pipe(
            ofType(InterviewsActions.sendMessage),
            withLatestFrom(this.store),
            exhaustMap(([action, store]) => {
                const { auth: { userId } } = store
                return this.interviewService.postInterviewsInterviewIdMessages({ interviewId: action.interviewId, Message: { ...action.message, userId } },
                )
                .pipe(
                    map((res: any) => {
                        return InterviewsActions.sendMessageSuccess(({ message: res }));
                    }),
                    catchError((error: any) => of(InterviewsActions.sendMessageFailure({ error }))),
                );
            }),
        ),
    )

    constructor(
        private action$: Actions,
        private interviewService: InterviewService,
        private store: Store<State>,
        private subService: SubscriptionService,
        private engagementService: EngagementService,
        private alertService: AlertService,
    ) {}
}