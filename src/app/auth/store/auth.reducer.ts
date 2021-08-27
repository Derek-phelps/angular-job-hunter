import { Action, createReducer, on, ActionReducer } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { HttpError } from '@hellotemp/models';
// import { User } from '@hellotemp/models';

export interface State {
    // login
    isLoggingIn: boolean;
    loginError: any; // might be an object
    loggedIn: boolean;

    // logout
    isLoggingOut: boolean;
    logoutError: HttpError | any;

    // signup
    isSigningUp: boolean;
    signupError: any;
    userId: string | null;
    email: string | null;

    isCreatingUser: boolean;
    createUserError: HttpError | any,

    isUpdatingUser: boolean;
    updateUserError: HttpError | any,

    isGettingToken: boolean;
    getTokenError: any;
    token: string | null;

    isGettingLoggedInUser: boolean;
    getLoggedInUserError: any;
    user: any;

    isCheckingAuth: boolean;
    checkAuthError: any;

    isResettingPassword: boolean;
    resetPasswordError: HttpError | any;
}

export const initialState: State  = {
    checkAuthError: {},
    createUserError: {},
    email: null,
    getLoggedInUserError: {},
    getTokenError: {},
    isCheckingAuth: false,
    isCreatingUser: false,
    isGettingLoggedInUser: false,
    isGettingToken: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isResettingPassword: false,
    isSigningUp: false,
    isUpdatingUser: false,
    loginError: null,
    loggedIn: false,
    logoutError: {},
    resetPasswordError: null,
    signupError: {},
    token: null,
    updateUserError: {},
    user: {},
    userId: null,
}

const authReducer = createReducer(
    initialState,
    // login
    on(AuthActions.loginStart, state => ({ ...state, isLoggingIn: true, loginError: null, userId: null })),
    on(AuthActions.loginSuccess, (state, action) => ({ ...state, isLoggingIn: false, userId: action.user.id, email: action.user.email, loggedIn: true })),
    on(AuthActions.loginFailure, (state, error) => ({ ...state, isLoggingIn: false, loginError: error })),
    // logout
    on(AuthActions.logout, state => ({ ...state, isLoggingOut: true, logoutError: {}, userId: null })),
    on(AuthActions.logoutSuccess, (state, action) => initialState),
    on(AuthActions.logoutFailure, (state, error) => ({ ...state, isLoggingOut: false, logoutError: error })),
    // check auth
    on(AuthActions.checkAuth, state => ({ ...state, isCheckingAuth: true, checkAuthError: {} })),
    on(AuthActions.checkAuthSuccess, (state, action) => ({ ...state, isCheckingAuth: false, loggedIn: true, userId: action.userId })),
    on(AuthActions.checkAuthFailure, (state, action) => ({ ...state, isCheckingAuth: false, checkAuthError: action.error })),
    // signup
    on(AuthActions.signupStart, state => ({ ...state, isSigningUp: true, signupError: {} })),
    on(AuthActions.signupSuccess, (state, action) => ({ ...state, isSigningUp: false })),
    on(AuthActions.signupFailure, (state, action) => ({ ...state, isSigningUp: false, signupError: action.error })),
    // createUser
    on(AuthActions.createUser, state => ({ ...state, isCreatingUser: true, createUserError: {} })),
    on(AuthActions.createUserSuccess, (state, action) => ({ ...state, isCreatingUser: false, userId: action.user.id, user: action.user })),
    on(AuthActions.createUserFailure, (state, action) => ({ ...state, isCreatingUser: false, createUserError: action.error })),
    // updateUser
    on(AuthActions.updateUser, state => ({ ...state, isUpdatingUser: true, updateUserError: {} })),
    on(AuthActions.updateUserSuccess, (state, action) => ({ ...state, isUpdatingUser: false, userId: action.user.id, user: action.user })),
    on(AuthActions.updateUserFailure, (state, action) => ({ ...state, isUpdatingUser: false, updateUserError: action.error })),
    // handle tokens
    on(AuthActions.setToken, (state, action) => ({ ...state, token: action.token })),
    on(AuthActions.clearToken, state => ({ ...state, token: null, loggedIn: false })),
    // get token
    on(AuthActions.getIdToken, state => ({ ...state, isGettingToken: true, getTokenError: {} })),
    on(AuthActions.getIdTokenSuccess, (state, action) => (console.log(action),({ ...state, isGettingToken: false, token: action.token}))),
    on(AuthActions.getIdTokenFailure, (state, action) => ({ ...state, isGettingToken: false, getTokenError: action.error })),
    // get logged in user
    on(AuthActions.getLoggedInUser, state => ({ ...state, isGettingLoggedInUser: true, getLoggedInUserError: {} })),
    on(AuthActions.getLoggedInUserSuccess, (state, action) => ({ ...state, isGettingLoggedInUser: false, user: action.user })),
    on(AuthActions.getLoggedInUserFailure, (state, action) => ({ ...state, isGettingLoggedInUser: false, getLoggedInUserError: action.error })),
    // reset password
    on(AuthActions.forgotPassword, state => ({ ...state, isResettingPassword: true, resetPasswordError: null })),
    on(AuthActions.forgotPasswordSuccess, (state, action) => ({ ...state, isResettingPassword: false })),
    on(AuthActions.forgotPasswordFailure, (state, action) => ({ ...state, resetPasswordError: action.error })),
);

export function reducer(state: State | undefined, action: Action) {
    return authReducer(state, action);
}

export function logout(appReducer: ActionReducer<any>): ActionReducer<any> {
    return function (state:  State | undefined, action: Action) {
      return appReducer(action.type === '[Auth] Logout' ? undefined : state, action);
    }
  }

