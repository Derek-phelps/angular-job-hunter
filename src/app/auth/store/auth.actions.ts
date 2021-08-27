import { createAction, props } from '@ngrx/store';
import { HttpError } from '@hellotemp/models';
// import { User } from '@hellotemp/models';

export const forgotPassword = createAction(
    '[Auth] Forgot Password',
    props<{ email: string }>(),
)

export const forgotPasswordSuccess = createAction(
    '[Auth] Forgot Password Success',
)

export const forgotPasswordFailure = createAction(
    '[Auth] Forgot Password Failure',
    props<{ error: HttpError }>(),
)

export const getIdToken = createAction(
    '[Auth] Get Id Token',
    // props<{ id: string }>(),
)

export const getIdTokenSuccess = createAction(
    '[Auth] Get Id Token Success',
    props<{ token: string }>(),
)

export const getIdTokenFailure = createAction(
    '[Auth] Get Id Token Failure',
    props<{ error: any }>(),
)

export const loginStart = createAction(
    '[Login Page] Login Start',
    props<{ redirectTo?: string; mode?: 'signup'}>(),
)

export const loginSuccess = createAction(
    '[Login Page] Login Success',
    props<{ user: any }>(),
)

export const loginFailure = createAction(
    '[Login Page] Login Failure',
    props<{ error: HttpError }>(), // replace this with error object once we figure out what the errors are
)

export const logout = createAction(
    '[Auth] Logout',
)

export const logoutSuccess = createAction(
    '[Auth] Logout success',
)

export const logoutFailure = createAction(
    '[Auth] Logout Error',
    props<{ error: HttpError }>(),
)

export const signupStart = createAction(
    '[Signup Page] Signup Start',
    props<{ params: any }>(),
)

export const signupSuccess = createAction(
    '[Signup Page] Signup Success',
    props<{ user: any }>(),
)

export const signupFailure = createAction(
    '[Signup Page] Signup Failure',
    props<{ error: HttpError }>(),
)

export const createUser = createAction(
    '[Auth] Create User',
    props<{ params: any }>(),
)

export const createUserSuccess = createAction(
    '[Auth] Create User Success',
    props<{ user: any }>(),
)

export const createUserFailure = createAction(
    '[Auth] Create User Failure',
    props<{ error: HttpError }>(),
)

export const updateUser = createAction(
    '[Auth] Update User',
    props<{ params: any }>(),
)

export const updateUserSuccess = createAction(
    '[Auth] Update User Success',
    props<{ user: any }>(),
)

export const updateUserFailure = createAction(
    '[Auth] Update User Failure',
    props<{ error: HttpError }>(),
)

export const setToken = createAction(
    '[Auth] Set Token',
    props<{ token: string }>(),
)

export const clearToken = createAction(
    '[Auth] Clear Token',
)

export const checkAuth = createAction(
    '[Auth] Check Auth',
    props<{ screen?: string }>(),
)

export const checkAuthSuccess = createAction(
    '[Auth] Check Auth Success',
    props<{ userId: string }>(),
)

export const checkAuthFailure = createAction(
    '[Auth] Check Auth Failure',
    props<{ error: any, screen?: string }>(),
)

export const getLoggedInUser = createAction(
    '[Auth] Get Logged In User',
    props<{ id: string }>(),
)

export const getLoggedInUserSuccess = createAction(
    '[Auth] Get Logged In User Success',
    props<{ user: any }>(),
)

export const getLoggedInUserFailure = createAction(
    '[Auth] Get Logged In User Failure',
    props<{ error: any }>(),
)
