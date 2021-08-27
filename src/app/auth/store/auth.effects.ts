import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { of, from, Observable, timer, throwError } from 'rxjs';
import {
  map,
  exhaustMap,
  catchError,
  switchMap,
  mergeMap,
  tap,
  mapTo,
  takeUntil,
} from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { Store } from '@ngrx/store';
import { UserService, CandidateService } from '@hellotemp/rest';
import { Router } from '@angular/router';
import { State } from '../../reducers';
import * as CandidatesActions from '../../store/candidates/candidates.actions';
import { AlertService } from '../../services/alert-service.service';
import { SubscriptionService } from '../../services/subscription.service';
import { Auth0Service } from '../auth0.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  // forgotPassword$ = createEffect(() =>
  //     this.actions$.pipe(
  //         ofType(AuthActions.forgotPassword),
  //         exhaustMap(action => {
  //             const alert: MatDialogRef<any> = this.alertService.loading('Sending...')
  //             return from(this.authService.resetPassword(action.email))
  //             .pipe(
  //                 map((res) => {
  //                     alert.close();
  //                     this.alertService.message('Success!', 'Please check your email for a reset password link.')
  //                     return AuthActions.forgotPasswordSuccess()
  //                 }),
  //                 catchError((error: any) => {
  //                     alert.close();
  //                     this.alertService.message('Error', 'Unable to reset Password.  Check your email and try again.')
  //                     return of(AuthActions.forgotPasswordFailure({ error }))
  //                 }),
  //             );
  //         }),
  //     ),
  // )

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginStart),
        exhaustMap(action => {
          return of(this.auth0Service.login(action.redirectTo, action.mode));
        }),
      ),
    { dispatch: false },
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(action => {
        console.log('in login success', action.user);
        return AuthActions.getIdToken();
      }),
    ),
  );

  getIdToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getIdToken),
      switchMap(action =>
        timer(0, 1800000).pipe(
          mapTo(action),
          takeUntil(this.subscriptionService.unsubToken$),
        ),
      ),
      exhaustMap(action =>
        from(this.auth0Service.getIdTokenClaims()).pipe(
          mergeMap(res => {
            console.log('in get token success', res);
            if (res) {
              return from([
                AuthActions.getIdTokenSuccess({ token: res.__raw }),
                AuthActions.getLoggedInUser({ id: res.sub }),
              ]);
            } else {
              return of(
                AuthActions.getIdTokenFailure({ error: 'User not logged in' }),
              );
            }
          }),
          catchError((error: any) =>
            of(AuthActions.getIdTokenFailure({ error })),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(action => {
          this.auth0Service.logout();
        }),
      ),
    { dispatch: false },
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/session'])),
      ),
    { dispatch: false },
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      exhaustMap(action => {
        return from(this.auth0Service.getIdTokenClaims()).pipe(
          map(token => {
            if (token) {
              this.store.dispatch(AuthActions.setToken({ token: token.__raw }));
              return AuthActions.checkAuthSuccess({ userId: token.sub });
            } else {
              return AuthActions.checkAuthFailure({
                error: 'No User Logged In',
              });
            }
          }),
          catchError(error =>
            of(AuthActions.checkAuthFailure({ error, screen: action.screen })),
          ),
        );
      }),
    ),
  );

  checkAuthFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.checkAuthFailure),
        tap(action =>
          action.screen ? null : this.router.navigate(['/session']),
        ),
      ),
    { dispatch: false },
  );

  getLoggedInUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getLoggedInUser),
      exhaustMap(action => {
        const join = ['candidate'];
        return this.userService.getUsersId({ id: action.id, join }).pipe(
          mergeMap(res => {
            return [
              CandidatesActions.getUserCandidate({
                userId: res.id,
                candidateId: res.candidate.id,
              }),
              AuthActions.getLoggedInUserSuccess({ user: res }),
            ];
          }),
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 404) {
              return from(this.auth0Service.getIdTokenClaims()).pipe(
                mergeMap(token => {
                  if (token) {
                    return of(
                      AuthActions.signupSuccess({
                        user: {
                          firstName: token.given_name || 'user',
                          lastName: token.family_name || 'default',
                          email: token.email,
                          id: token.sub,
                        },
                      }),
                    );
                  }
                  return of(AuthActions.getLoggedInUserFailure({ error }));
                }),
                catchError(err =>
                  of(AuthActions.getLoggedInUserFailure({ error })),
                ),
              );
            }
            return of(AuthActions.getLoggedInUserFailure({ error }));
          }),
        );
      }),
    ),
  );

  getLoggedInUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getLoggedInUserFailure),
        tap(() => this.router.navigate(['/create-profile'])),
      ),
    { dispatch: false },
  );

  // signup$ = createEffect(() =>
  //     this.actions$.pipe(
  //         ofType(AuthActions.signupStart),
  //         exhaustMap(action => {
  //             let id = '';
  //             const loading = this.alertService.loading('Creating User');
  //             return from(this.afAuth.auth.createUserWithEmailAndPassword(action.params.email, action.params.password))
  //             .pipe(
  //                 switchMap((res: any) => {
  //                     id = res.user.uid;
  //                     return this.authService.getIdToken()
  //                 }),
  //                 map((res: any) => {
  //                     loading.close();
  //                     this.store.dispatch(AuthActions.setToken({ token: res}));
  //                     this.store.dispatch(CandidatesActions.setCandidate({
  //                         candidate: {
  //                             firstName: action.params.firstName,
  //                             lastName: action.params.lastName,
  //                             active: true,
  //                         }, isValid: false }));
  //                     return AuthActions.signupSuccess({ user: { ...action.params, id } });
  //                 }),
  //                 catchError((error: any) => {
  //                     loading.close();
  //                     if (error && error.message) {
  //                         this.alertService.message('Unable to Create User', error.message);
  //                     } else {
  //                         this.alertService.message('Error', 'Unable to Create User');
  //                     }
  //                     console.log('in error', error);
  //                     return of(AuthActions.signupFailure({ error }))
  //                 }),
  //             );
  //         }),
  //     ),
  // )

  signupSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupSuccess),
      map(action => AuthActions.createUser({ params: action.user })),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createUser),
      exhaustMap(action => {
        const { params } = action;
        // needs to be passed in as "any" because the service is expecting createdOn, deletedAt, etc, but the API is not
        const user = {
          firstName: params.firstName,
          id: params.id,
          email: params.email,
          lastName: params.lastName,
        } as any;
        return this.userService.postUsers(user).pipe(
          map((res: any) => {
            return AuthActions.createUserSuccess({ user: res });
          }),
          catchError((error: any) =>
            of(AuthActions.createUserFailure({ error })),
          ),
        );
      }),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      exhaustMap(action => {
        const { params } = action;
        const { candidate, ...rest } = params;
        return this.userService
          .patchUsersId({ id: rest.id, User: rest })
          .pipe(
            map((res: any) => {
              return AuthActions.updateUserSuccess({ user: res });
            }),
            catchError((error: any) =>
              of(AuthActions.updateUserFailure({ error })),
            ),
          );
      }),
    ),
  );

  createUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.createUserSuccess),
        tap(() => this.router.navigate(['/create-profile'])),
      ),
    { dispatch: false },
  );
  constructor(
    private actions$: Actions,
    private alertService: AlertService,
    private store: Store<State>,
    private userService: UserService,
    private candidateService: CandidateService,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private auth0Service: Auth0Service,
  ) {}
}
