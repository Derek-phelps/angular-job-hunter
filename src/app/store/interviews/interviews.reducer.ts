import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from './interviews.actions';
import { Interview } from '@hellotemp/rest';
import { InterviewStatusObject, HttpError, Message } from '@hellotemp/models';
import { handleInterviewStatus } from '@hellotemp/util';

export interface State {
    acceptInterviewError: any;
    acceptOfferError: HttpError | any;
    counterOfferError: HttpError | any;
    currentInterview: Interview | any;
    declineOfferError: HttpError | any;
    getInterviewsError: any;
    getMessagesError: HttpError | any;
    interviews: Interview[];
    interviewStatus: InterviewStatusObject,
    isAcceptingInterview: boolean;
    isAcceptingOffer: boolean;
    isCounteringOffer: boolean;
    isDecliningOffer: boolean;
    isGettingInterviews: boolean;
    isGettingMessages: boolean;
    isRejectingInterview: boolean;
    isSendingMessage: boolean;
    isUpdatingInterview: boolean;
    messages: Message[] | null;
    rejectInterviewError: HttpError | any;
    sendMessageError: HttpError | any;
    updateInterviewError: HttpError | any;
    interviewEvent?: string;
}

export const interviewStatus: InterviewStatusObject = {
    interviewRequested: [],
    interviewAccepted: [],
    interviewRejected: [],
    interviewCompleted: [],
    jobOffered: [],
    offerAccepted: [],
    offerDeclined: [],
    active: [],
}

export const initialState: State = {
    acceptInterviewError: {},
    acceptOfferError: null,
    counterOfferError: null,
    currentInterview: {},
    declineOfferError: null,
    getInterviewsError: {},
    getMessagesError: null,
    interviews: [],
    interviewStatus,
    isAcceptingInterview: false,
    isAcceptingOffer: false,
    isCounteringOffer: false,
    isDecliningOffer: false,
    isGettingInterviews: false,
    isGettingMessages: false,
    isRejectingInterview: false,
    isSendingMessage: false,
    isUpdatingInterview: false,
    messages: null,
    rejectInterviewError: null,
    sendMessageError: null,
    updateInterviewError: null,
    interviewEvent: '',
}

const interviewsReducer = createReducer(
    initialState,
    // clear messages
    on(Actions.clearMessages, state => ({ ...state, messages: null })),
    // get interviews
    on(Actions.getInterviews, state => ({ ...state, isGettingInterviews: true, getInterviewsError: null })),
    on(Actions.getInterviewsSuccess, (state, action) => {
        let currentInterview = state.currentInterview
        if (currentInterview.id) {
            currentInterview = action.interviews.find(i => i.id === currentInterview.id);
        }
        return { ...state, isGettingInterviews: false, interviews: action.interviews, interviewStatus: action.status, currentInterview }
    }),
    on(Actions.getInterviewsFailure, (state, action) => ({ ...state, isGettingInterviews: false, getInterviewsError: action.error })),
    // set current interview
    on(Actions.setCurrentInterview, (state, action) => ({ ...state, currentInterview: action.interview })),
    // accept interview
    on(Actions.acceptInterview, state => ({ ...state, isAcceptingInterview: true, acceptInterviewError: null })),
    on(Actions.acceptInterviewSuccess, (state, action) => ({ ...state, isAcceptingInterview: false })),
    on(Actions.acceptInterviewFailure, (state, action) => ({ ...state, isAcceptingInterview: false, acceptInterviewError: action.error })),
    // accept offer
    on(Actions.acceptOffer, state => ({ ...state, isAcceptingOffer: true, acceptOfferError: null })),
    on(Actions.acceptOfferSuccess, (state, action) => {
        const interviews = state.interviews.map(i => {
            if (i.id === action.interview.id) {
                return action.interview;
            }
            return i;
        })
        const interviewStatusObj = handleInterviewStatus(interviews);
        return { ...state, isAcceptingOffer: false, interviews, interviewStatus: interviewStatusObj }
    }),
    on(Actions.acceptOfferFailure, (state, action) => ({ ...state, isAcceptingOffer: false, acceptOfferError: action.error })),
    // counter offer
    on(Actions.counterOffer, state => ({ ...state, isCounteringOffer: true, counterOfferError: null })),
    on(Actions.counterOfferSuccess, (state, action) => {
        const interviews = state.interviews.map(i => {
            if (i.id === action.interview.id) {
                return action.interview;
            }
            return i;
        })
        const interviewStatusObj = handleInterviewStatus(interviews);
        return { ...state, isCounteringOffer: false, interviews, interviewStatus: interviewStatusObj }
    }),
    on(Actions.counterOfferFailure, (state, action) => ({ ...state, isCounteringOffer: false, counterOfferError: action.error })),
    // decline offer
    on(Actions.declineOffer, state => ({ ...state, isDecliningOffer: true, declineOfferError: null })),
    on(Actions.declineOfferSuccess, (state, action) => {
        const interviews = state.interviews.map(i => {
            if (i.id === action.interview.id) {
                return action.interview;
            }
            return i;
        })
        const interviewStatusObj = handleInterviewStatus(interviews);
        return { ...state, isDecliningOffer: false, interviews, interviewStatus: interviewStatusObj  }
    }),
    on(Actions.declineOfferFailure, (state, action) => ({ ...state, isDecliningOffer: false, declineOfferError: action.error })),
    // reject interview
    on(Actions.rejectInterview, state => ({ ...state, isRejectingInterview: true, rejectInterviewError: null })),
    on(Actions.rejectInterviewSuccess, (state, action) => ({ ...state, isRejectingInterview: false, interviewEvent: 'rejectInterviewSuccess' })),
    on(Actions.rejectInterviewFailure, (state, action) => ({ ...state, isRejectingInterview: false, rejectInterviewError: action.error, interviewEvent: 'rejectInterviewFailure' })),
    // get messages
    on(Actions.getMessages, state => ({ ...state, isGettingMessages: true, getMessagesError: null })),
    on(Actions.getMessagesSuccess, (state, action) => ({ ...state, isGettingMessages: false, messages: action.messages })),
    on(Actions.getMessagesFailure, (state, action) => ({ ...state, isGettingMessages: false, getMessagesError: action.error })),
    // send messages
    on(Actions.sendMessage, state => ({ ...state, isSendingMessage: true, sendMessagesError: null })),
    on(Actions.sendMessageSuccess, (state, action) => {
        const messages = state.messages ? state.messages : [];
        return {
            ...state,
            isSendingMessage: false,
            messages: [ ...messages, action.message ],
        }
    }),
    on(Actions.sendMessageFailure, (state, action) => ({ ...state, isSendtingMessages: false, getMessagesError: action.error })),
    // update interview
    on(Actions.updateInterview, state => ({ ...state, isUpdatingInterview: true, updateInterviewError: null })),
    on(Actions.updateInterviewSuccess, (state, action) => {
        const interviews = state.interviews.map(i => {
            if (i.id === action.interview.id) {
                return action.interview;
            }
            return i;
        })
        const interviewStatusObj = handleInterviewStatus(interviews);
        return { ...state, isUpdatingInterview: false, interviews, interviewStatus: interviewStatusObj };
    }),
    on(Actions.updateInterviewFailure, (state, action) => ({ ...state, isUpdatingInterview: false, updateInterviewError: action.error })),
    on(Actions.updateInterviewEvent, (state, action) => {
      return {
        ...state,
        interviewEvent: action.event || '',
      }
    }),
)

export function reducer(state: State | undefined, action: Action) {
    return interviewsReducer(state, action);
}
