import { createAction, props } from '@ngrx/store';
import { Interview, Offer, Engagement } from '@hellotemp/rest';
import { InterviewStatusObject, Message, HttpError, Opportunity, OfferPartial } from '@hellotemp/models';

export const clearMessages = createAction(
    '[Interviews] Clear Messages',
);

export const getInterviews = createAction(
    '[Interviews] Get Interviews',
    props<{ candidateId: string }>(),
)

export const getInterviewsSuccess = createAction(
    '[Interviews] Get Interviews Success',
    props<{ interviews: Interview[], status: InterviewStatusObject }>(),
)

export const getInterviewsFailure = createAction(
    '[Interviews] Get Interviews',
    props<{ error: any }>(),
)

export const acceptInterview = createAction(
    '[Interviews] Accept Interview',
    props<{ interviewId: string, candidateId: string, opportunity: Opportunity }>(),
)

export const acceptInterviewSuccess = createAction(
    '[Interviews] Accept Interview Success',
)

export const acceptInterviewFailure = createAction(
    '[Interviews] Accept Interview Failure',
    props<{ error: any }>(),
)

export const acceptOffer = createAction(
    '[Interviews] Accept Offer',
    props<{ interview: Interview, engagement: any }>(),
)

export const acceptOfferSuccess = createAction(
    '[Interviews] Accept Offer Success',
    props<{ interview: Interview}>(),
)

export const acceptOfferFailure = createAction(
    '[Interviews] Accept Offer Failure',
    props<{ error: HttpError }>(),
)

export const counterOffer = createAction(
    '[Interviews] Counter Offer',
    props<{ offer: OfferPartial, interview: Interview }>(),
)

export const counterOfferSuccess = createAction(
    '[Interviews] Counter Offer Success',
    props<{ offer: Offer, interview: Interview}>(),
)

export const counterOfferFailure = createAction(
    '[Interviews] Counter Offer Filure',
    props<{ error: HttpError }>(),
)

export const declineOffer = createAction(
    '[Interviews] Decline Interview',
    props<{ interview: Interview }>(),
)

export const declineOfferSuccess = createAction(
    '[Interviews] Decline Offer Success',
    props<{ interview: Interview}>(),
)

export const declineOfferFailure = createAction(
    '[Interviews] Decline Offer Failure',
    props<{ error: HttpError }>(),
)

export const getMessages = createAction(
    '[Messages] Get Messages',
    props<{ id: string }>(),
);

export const getMessagesSuccess = createAction(
    '[Messages] Get Messages Success',
    props<{ messages: Message[] }>(),
);

export const getMessagesFailure = createAction(
    '[Messages] Get Messages Failure',
    props<{ error: HttpError }>(),
)

export const rejectInterview = createAction(
    '[Interviews] RejectInterview',
    props<{ interviewId: string, candidateId: string, opportunity: Opportunity }>(),
)

export const rejectInterviewSuccess = createAction(
    '[Interviews] RejectInterview Success',
)

export const rejectInterviewFailure = createAction(
    '[Interviews] RejectInterview Failure',
    props<{ error: any}>(),
)

export const sendMessage = createAction(
    '[Interviews] Send Message',
    props<{ message: any, interviewId: string }>(),
);

export const sendMessageSuccess = createAction(
    '[Interviews] Send Message Success',
    props<{ message: Message }>(),
);

export const sendMessageFailure = createAction(
    '[Interviews] Send Message Failure',
    props<{ error: HttpError }>(),
)

export const setCurrentInterview = createAction(
    '[Interviews] Set Current interview',
    props<{ interview: Interview }>(),
)

export const updateInterview = createAction(
    '[Interviews] Update Interview',
    props<{ interview: Interview }>(),
)

export const updateInterviewSuccess = createAction(
    '[Interviews] Update Interview Success',
    props<{ interview: Interview }>(),
)

export const updateInterviewFailure = createAction(
    '[Interviews] Update Interview Failure',
    props<{ error: HttpError }>(),
)

export const updateInterviewEvent = createAction(
  '[Interviews] Update Interview Event',
  props<{ event?: string; }>(),
)
