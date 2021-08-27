import { createSelector } from '@ngrx/store';
import { State } from '../../reducers';
import { State as InterviewsState } from './interviews.reducer';
import { State as DefinitionsState } from '../definitions/definitions.reducer';
import { State as AuthState } from '../../auth/store/auth.reducer';
import { State as OpportunitiesState } from '../opportunities/opportunities.reducer';
import { Interview } from '@hellotemp/rest';

const selectInterviewsState = (state: State) => state.interviews;
const selectDefinitions = (state: State) => state.definitions;
const selectAuthState = (state: State) => state.auth;
const selectOpportunitiesState = (state: State) => state.opportunities


export const selectInterviews = createSelector(
    selectInterviewsState,
    (state: InterviewsState) => state.interviews,
)

export const selectConversations = createSelector(
    selectInterviewsState,
    selectDefinitions,
    (state: InterviewsState, definitions: DefinitionsState) => {
        const conversations = state.interviews.filter(i => i.status !== 0);
        const offers = state.interviews.filter(i => i.offers && i.offers.length > 0);
        return {
            conversations,
            offers,
            jobTitles: definitions.dictionary.jobTitles,
            companies: definitions.dictionary.companies,
        }
    },
)

export const selectMessages = createSelector(
    selectInterviewsState,
    (state: InterviewsState) => state.messages,
)

export const selectMessageParticipants = createSelector(
    selectInterviewsState,
    selectDefinitions,
    selectAuthState,
    (interviews: InterviewsState, definitions: DefinitionsState, auth: AuthState, id: string) => {
        let interview = interviews.interviews.find(i => i.id === id) as Interview;
        if (interview) {
            interview = { 
                ...interview, 
                opportunity: {
                    ...interview.opportunity,
                    company: definitions.dictionary.companies[interview.opportunity.companyId] || null,
                },
            }
        }
        let messages = interviews.messages;
        if (messages) {
            messages = messages.map(m => {
                if (m.userId === auth.user.id) {
                    return { ...m, user: auth.user};
                }
                if (definitions.dictionary && interview) {
                    const { users } = definitions.dictionary.companies[interview.opportunity.companyId] as any;
                    const found = users.find((u: any) => u.account.id === m.userId);
                    if (found) {
                        return { ...m, user: found.account };
                    }
                }
                return m;
            })
        }
        return {
            interview,
            user: auth.user,
            messages,
        }
    },
)

export const selectOffers = createSelector(
    selectInterviewsState,
    selectAuthState,
    selectDefinitions,
    selectOpportunitiesState,
    (interviews: InterviewsState, auth: AuthState, definitions: DefinitionsState, opportunity: OpportunitiesState, id: string) => {
        const interview = interviews.interviews.find(i => i.id === id) as Interview;
        const company = interview && definitions.dictionary.companies[interview.opportunity.companyId];
        const loading = !interview || interviews.isGettingInterviews || auth.isGettingLoggedInUser || definitions.isGettingJobTitles || definitions.isGettingCompanies || false;
        return {
            interview,
            user: auth.user,
            jobTitles: definitions.dictionary.jobTitles,
            company,
            loading,
        }
    },
)
