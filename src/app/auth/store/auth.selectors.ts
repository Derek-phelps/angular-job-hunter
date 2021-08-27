import { createSelector } from '@ngrx/store';
import { State } from '../../reducers';
import { State as AuthState } from './auth.reducer';

const selectAuthState = (state: State) => (state.auth);

export const selectToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.token,
)

export const selectUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user,
)