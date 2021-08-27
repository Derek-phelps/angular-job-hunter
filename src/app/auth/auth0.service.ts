import { Injectable } from '@angular/core';
import createAuth0Client, { GetUserOptions, Auth0Client, GetTokenSilentlyOptions, GetIdTokenClaimsOptions } from '@auth0/auth0-spa-js';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  // Create an observable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: environment.auth0.domain,
      client_id: environment.auth0.client_id,
      redirect_uri: environment.auth0.redirect_uri,
      audience: environment.auth0.audience,
    }),
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err)),
  );
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => this.loggedIn = res),
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback())),
  );
  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();
  // Create a local property for login status
  loggedIn = false;

  constructor(
    private router: Router,
    private store: Store<any>,
  ) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?: GetUserOptions): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user)),
    );
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      }),
    );
    checkAuth$.subscribe(user => {
      if (user) {
        this.store.dispatch(AuthActions.loginSuccess({
          user: {
            id: user.sub,
            email: user.email,
          },
        }));
      }
    });
  }

  login(redirectPath: string = '/', mode?: 'signup') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: environment.auth0.redirect_uri,
        appState: { target: redirectPath },
        screen_hint: mode,
      });
    });
  }

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$,
          ]);
        }),
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        if (loggedIn && user) {
          this.store.dispatch(AuthActions.loginSuccess({
            user: {
              id: user.sub,
              email: user.email,
            },
          }));
        }
        this.router.navigate([targetRoute]);
      });
    }
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: environment.auth0.client_id,
        returnTo: environment.auth0.redirect_uri,
      });
    });
  }

  getTokenSilently$(options?: GetTokenSilentlyOptions): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getTokenSilently(options))),
    );
  }

  getIdTokenClaims(options?: GetIdTokenClaimsOptions) {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getIdTokenClaims(options))),
    );
  }

}
