import { Action, createReducer, on } from '@ngrx/store';
import * as CandidatesActions from './candidates.actions';
import * as AuthActions from '../../auth/store/auth.actions';
import { Candidate, HttpError } from '@hellotemp/models';

export interface State {
    candidate: Candidate | Partial<Candidate> | null;
    isCreatingCandidate: boolean;
    createCandidateError: HttpError | any;
    isUpdatingCandidate: boolean;
    updateCandidateError: HttpError | any;
    isValid: boolean,
    isGettingCandidate: boolean;
    getCandidateError: any;
    isCreatingDegree: boolean;
    createDegreeError: HttpError | any;
    isUpdateingDegree: boolean;
    updateDegreeError: HttpError | any;
    isDeletingDegree: boolean;
    deleteDegreeError: HttpError | any;
    isCreatingQualification: boolean;
    createQualificationError: HttpError | any;
    isUpdateingQualification: boolean;
    updateQualificationError: HttpError | any;
    isDeletingQualification: boolean;
    deleteQualificationError: HttpError | any;
    isCreatingReference: boolean;
    createReferenceError: HttpError | any;
    isUpdateingReference: boolean;
    updateReferenceError: HttpError | any;
    isDeletingReference: boolean;
    deleteReferenceError: HttpError | any;
    isCreatingRate: boolean;
    createRateError: HttpError | any;
    isUpdateingRate: boolean;
    updateRateError: HttpError | any;
    isDeletingRate: boolean;
    deleteRateError: HttpError | any;
    isCreatingSkill: boolean;
    createSkillError: HttpError | any;
    isUpdateingSkill: boolean;
    updateSkillError: HttpError | any;
    isDeletingSkill: boolean;
    deleteSkillError: HttpError | any;
    isCreatingSoftwareSkill: boolean;
    createSoftwareSkillError: HttpError | any;
    isUpdateingSoftwareSkill: boolean;
    updateSoftwareSkillError: HttpError | any;
    isDeletingSoftwareSkill: boolean;
    deleteSoftwareSkillError: HttpError | any;
    isCreatingIndustryExperience: boolean;
    createIndustryExperienceError: HttpError | any;
    isUpdateingIndustryExperience: boolean;
    updateIndustryExperienceError: HttpError | any;
    isDeletingIndustryExperience: boolean;
    deleteIndustryExperienceError: HttpError | any;
    isCreatingCertification: boolean;
    createCertificationError: HttpError | any;
    isUpdateingCertification: boolean;
    updateCertificationError: HttpError | any;
    isDeletingCertification: boolean;
    deleteCertificationError: HttpError | any;
}

export const initialState: State = {
    candidate: null,
    isValid: true,
    isCreatingCandidate: false,
    createCandidateError: {},
    isUpdatingCandidate: false,
    updateCandidateError: {},
    isGettingCandidate: false,
    getCandidateError: {},
    isCreatingRate: false,
    createRateError: {},
    isUpdateingRate: false,
    updateRateError: {},
    isDeletingRate: false,
    deleteRateError: {},
    isCreatingDegree: false,
    createDegreeError: {},
    isUpdateingDegree: false,
    updateDegreeError: {},
    isDeletingDegree: false,
    deleteDegreeError: {},
    isCreatingQualification: false,
    createQualificationError: {},
    isUpdateingQualification: false,
    updateQualificationError: {},
    isDeletingQualification: false,
    deleteQualificationError: {},
    isCreatingReference: false,
    createReferenceError: {},
    isUpdateingReference: false,
    updateReferenceError: {},
    isDeletingReference: false,
    deleteReferenceError: {},
    isCreatingSkill: false,
    createSkillError: {},
    isUpdateingSkill: false,
    updateSkillError: {},
    isDeletingSkill: false,
    deleteSkillError: {},    
    isCreatingSoftwareSkill: false,
    createSoftwareSkillError: {},
    isUpdateingSoftwareSkill: false,
    updateSoftwareSkillError: {},
    isDeletingSoftwareSkill: false,
    deleteSoftwareSkillError: {},    
    isCreatingIndustryExperience: false,
    createIndustryExperienceError: {},
    isUpdateingIndustryExperience: false,
    updateIndustryExperienceError: {},
    isDeletingIndustryExperience: false,
    deleteIndustryExperienceError: {},    
    isCreatingCertification: false,
    createCertificationError: {},
    isUpdateingCertification: false,
    updateCertificationError: {},
    isDeletingCertification: false,
    deleteCertificationError: {},
}

const candidateReducer = createReducer(
    initialState,
    // set candidate
    on(CandidatesActions.setCandidate, (state, action) => ({ ...state, candidate: action.candidate, isValid: action.isValid })),
    // set isValid
    on(CandidatesActions.setIsValid, (state, action) => ({ ...state, isValid: action.isValid })),
    // create candidate
    on(CandidatesActions.createCandidate, state => ({ ...state, isCreatingCandidate: true, createCandidateError: {} })),
    on(CandidatesActions.createCandidateSuccess, (state, action) => ({ ...state, isCreatingCandidate: false, candidate: action.candidate })),
    on(CandidatesActions.createCandidateFailure, (state, action) => ({ ...state, isCreatingCandidate: false, createCandidateError: action.error })),
    // update candidate
    on(CandidatesActions.updateCandidate, state => ({ ...state, isUpdatingCandidate: true, updateCandidateError: {} })),
    on(CandidatesActions.updateCandidateSuccess, (state, action) => ({ ...state, isUpdatingCandidate: false, candidate: action.candidate })),
    on(CandidatesActions.updateCandidateFailure, (state, action) => ({ ...state, isUpdatingCandidate: false, updateCandidateError: action.error })),
    // get candidate
    on(CandidatesActions.getUserCandidate, state => ({ ...state, isGettingCandidate: true, getCandidateError: {} })),
    on(CandidatesActions.getUserCandidateSuccess, (state, action) => ({ ...state, isGettingCandidate: false, candidate: action.candidate })),
    on(CandidatesActions.getUserCandidateFailure, (state, action) => ({ ...state, isGettingCandidate: false, getCandidateError: action.error })),
    // create rate
    on(CandidatesActions.createRate, state => ({ ...state, isCreatingRate: true, createRateError: {} })),
    on(CandidatesActions.createRateSuccess, (state, action) => ({ ...state, isCreatingRate: false })),
    on(CandidatesActions.createRateFailure, (state, action) => ({ ...state, isCreatingRate: false, createRateError: action.error })),
    // update rate
    on(CandidatesActions.updateRate, state => ({ ...state, isUpdateingRate: true, updateRateError: {} })),
    on(CandidatesActions.updateRateSuccess, (state, action) => ({ ...state, isUpdateingRate: false })),
    on(CandidatesActions.updateRateFailure, (state, action) => ({ ...state, isUpdateingRate: false, updateRateError: action.error })),
    // delete rate
    on(CandidatesActions.deleteRate, state => ({ ...state, isCreatingRate: true, deleteRateError: {} })),
    on(CandidatesActions.deleteRateSuccess, (state, action) => ({ ...state, isDeletingRate: false })),
    on(CandidatesActions.deleteRateFailure, (state, action) => ({ ...state, isDeletingRate: false, deleteRateError: action.error })),
    // create degree
    on(CandidatesActions.createDegree, state => ({ ...state, isCreatingDegree: true, createDegreeError: {} })),
    on(CandidatesActions.createDegreeSuccess, (state, action) => {
        const candidate = { ...state.candidate as Candidate };
        const degrees = candidate.degrees.map(d => {
            if (d.id.length === 0) {
                return action.degree;
            }
            return d;
        })
        return { ...state, isCreatingDegree: false, candidate: { ...candidate, degrees} };
    }),
    on(CandidatesActions.createDegreeFailure, (state, action) => ({ ...state, isCreatingDegree: false, createDegreeError: action.error })),
    // update degree
    on(CandidatesActions.updateDegree, state => ({ ...state, isUpdateingDegree: true, updateDegreeError: {} })),
    on(CandidatesActions.updateDegreeSuccess, (state, action) => {
        const candidate = { ...state.candidate as Candidate };
        const degrees = candidate.degrees.map(d => {
            if (action.degree.id === d.id) {
                return action.degree;
            }
            return d;
        })
        return { ...state, isUpdateingDegree: false, candidate: { ...candidate, degrees } };
    }),
    on(CandidatesActions.updateDegreeFailure, (state, action) => ({ ...state, isUpdateingDegree: false, updateDegreeError: action.error })),
    // delete degree
    on(CandidatesActions.deleteDegree, state => ({ ...state, isCreatingDegree: true, deleteDegreeError: {} })),
    on(CandidatesActions.deleteDegreeSuccess, (state, action) => ({ ...state, isDeletingDegree: false })),
    on(CandidatesActions.deleteDegreeFailure, (state, action) => ({ ...state, isDeletingDegree: false, deleteDegreeError: action.error })),
    // create qualification
    on(CandidatesActions.createQualification, state => ({ ...state, isCreatingQualification: true, createQualificationError: {} })),
    on(CandidatesActions.createQualificationSuccess, (state, action) => {
        const candidate = { ...state.candidate as Candidate };
        const qualifications = candidate.qualifications.map(q => {
            if (q.id.length === 0) {
                return action.Qualification;
            }
            return q;
        })
        return { ...state, isCreatingQualification: false, candidate: { ...candidate, qualifications } }
    }),
    on(CandidatesActions.createQualificationFailure, (state, action) => ({ ...state, isCreatingQualification: false, createQualificationError: action.error })),
    // update qualification
    on(CandidatesActions.updateQualification, state => ({ ...state, isUpdateingQualification: true, updateQualificationError: {} })),
    on(CandidatesActions.updateQualificationSuccess, (state, action) => {
        const candidate = { ...state.candidate as Candidate };
        const qualifications = candidate.qualifications.map(q => {
            if (action.qualification.id === q.id) {
                return action.qualification;
            }
            return q;
        });
        return { ...state, isUpdateingQualification: false, candidate: { ...candidate, qualifications } };
    }),
    on(CandidatesActions.updateQualificationFailure, (state, action) => ({ ...state, isUpdateingQualification: false, updateQualificationError: action.error })),
    // delete qualification
    on(CandidatesActions.deleteQualification, state => ({ ...state, isCreatingQualification: true, deleteQualificationError: {} })),
    on(CandidatesActions.deleteQualificationSuccess, (state, action) => ({ ...state, isDeletingQualification: false })),
    on(CandidatesActions.deleteQualificationFailure, (state, action) => ({ ...state, isDeletingQualification: false, deleteQualificationError: action.error })),
    // create reference
    on(CandidatesActions.createReference, state => ({ ...state, isCreatingReference: true, createReferenceError: {} })),
    on(CandidatesActions.createReferenceSuccess, (state, action) => {
        const candidate = { ...state.candidate as Candidate };
        const references = candidate.references.map(r => {
            if (r.id.length === 0) {
                return action.Reference;
            }
            return r;
        })
        return { ...state, isCreatingReference: false, candidate: { ...candidate, references } };
    }),
    on(CandidatesActions.createReferenceFailure, (state, action) => ({ ...state, isCreatingReference: false, createReferenceError: action.error })),
    // update reference
    on(CandidatesActions.updateReference, state => ({ ...state, isUpdateingReference: true, updateReferenceError: {} })),
    on(CandidatesActions.updateReferenceSuccess, (state, action) => ({ ...state, isUpdateingReference: false })),
    on(CandidatesActions.updateReferenceFailure, (state, action) => ({ ...state, isUpdateingReference: false, updateReferenceError: action.error })),
    // delete reference
    on(CandidatesActions.deleteReference, state => ({ ...state, isCreatingReference: true, deleteReferenceError: {} })),
    on(CandidatesActions.deleteReferenceSuccess, (state, action) => ({ ...state, isDeletingReference: false })),
    on(CandidatesActions.deleteReferenceFailure, (state, action) => ({ ...state, isDeletingReference: false, deleteReferenceError: action.error })),
    // create skill
    on(CandidatesActions.createSkill, state => ({ ...state, isCreatingSkill: true, createSkillError: {} })),
    on(CandidatesActions.createSkillSuccess, (state, action) => ({ ...state, isCreatingSkill: false })),
    on(CandidatesActions.createSkillFailure, (state, action) => ({ ...state, isCreatingSkill: false, createSkillError: action.error })),
    // update skill
    on(CandidatesActions.updateSkill, state => ({ ...state, isUpdateingSkill: true, updateSkillError: {} })),
    on(CandidatesActions.updateSkillSuccess, (state, action) => ({ ...state, isUpdateingSkill: false })),
    on(CandidatesActions.updateSkillFailure, (state, action) => ({ ...state, isUpdateingSkill: false, updateSkillError: action.error })),
    // delete skill
    on(CandidatesActions.deleteSkill, state => ({ ...state, isCreatingSkill: true, deleteSkillError: {} })),
    on(CandidatesActions.deleteSkillSuccess, (state, action) => ({ ...state, isDeletingSkill: false })),
    on(CandidatesActions.deleteSkillFailure, (state, action) => ({ ...state, isDeletingSkill: false, deleteSkillError: action.error })),    
    // create SoftwareSkill
    on(CandidatesActions.createSoftwareSkill, state => ({ ...state, isCreatingSoftwareSkill: true, createSoftwareSkillError: {} })),
    on(CandidatesActions.createSoftwareSkillSuccess, (state, action) => ({ ...state, isCreatingSoftwareSkill: false })),
    on(CandidatesActions.createSoftwareSkillFailure, (state, action) => ({ ...state, isCreatingSoftwareSkill: false, createSoftwareSkillError: action.error })),
    // update SoftwareSkill
    on(CandidatesActions.updateSoftwareSkill, state => ({ ...state, isUpdateingSoftwareSkill: true, updateSoftwareSkillError: {} })),
    on(CandidatesActions.updateSoftwareSkillSuccess, (state, action) => ({ ...state, isUpdateingSoftwareSkill: false })),
    on(CandidatesActions.updateSoftwareSkillFailure, (state, action) => ({ ...state, isUpdateingSoftwareSkill: false, updateSoftwareSkillError: action.error })),
    // delete SoftwareSkill
    on(CandidatesActions.deleteSoftwareSkill, state => ({ ...state, isCreatingSoftwareSkill: true, deleteSoftwareSkillError: {} })),
    on(CandidatesActions.deleteSoftwareSkillSuccess, (state, action) => ({ ...state, isDeletingSoftwareSkill: false })),
    on(CandidatesActions.deleteSoftwareSkillFailure, (state, action) => ({ ...state, isDeletingSoftwareSkill: false, deleteSoftwareSkillError: action.error })),    
    // create IndustryExperience
    on(CandidatesActions.createIndustryExperience, state => ({ ...state, isCreatingIndustryExperience: true, createIndustryExperienceError: {} })),
    on(CandidatesActions.createIndustryExperienceSuccess, (state, action) => ({ ...state, isCreatingIndustryExperience: false })),
    on(CandidatesActions.createIndustryExperienceFailure, (state, action) => ({ ...state, isCreatingIndustryExperience: false, createIndustryExperienceError: action.error })),
    // update IndustryExperience
    on(CandidatesActions.updateIndustryExperience, state => ({ ...state, isUpdateingIndustryExperience: true, updateIndustryExperienceError: {} })),
    on(CandidatesActions.updateIndustryExperienceSuccess, (state, action) => ({ ...state, isUpdateingIndustryExperience: false })),
    on(CandidatesActions.updateIndustryExperienceFailure, (state, action) => ({ ...state, isUpdateingIndustryExperience: false, updateIndustryExperienceError: action.error })),
    // delete IndustryExperience
    on(CandidatesActions.deleteIndustryExperience, state => ({ ...state, isCreatingIndustryExperience: true, deleteIndustryExperienceError: {} })),
    on(CandidatesActions.deleteIndustryExperienceSuccess, (state, action) => ({ ...state, isDeletingIndustryExperience: false })),
    on(CandidatesActions.deleteIndustryExperienceFailure, (state, action) => ({ ...state, isDeletingIndustryExperience: false, deleteIndustryExperienceError: action.error })),    
    // create Certification
    on(CandidatesActions.createCertification, state => ({ ...state, isCreatingCertification: true, createCertificationError: {} })),
    on(CandidatesActions.createCertificationSuccess, (state, action) => ({ ...state, isCreatingCertification: false })),
    on(CandidatesActions.createCertificationFailure, (state, action) => ({ ...state, isCreatingCertification: false, createCertificationError: action.error })),
    // update Certification
    on(CandidatesActions.updateCertification, state => ({ ...state, isUpdateingCertification: true, updateCertificationError: {} })),
    on(CandidatesActions.updateCertificationSuccess, (state, action) => ({ ...state, isUpdateingCertification: false })),
    on(CandidatesActions.updateCertificationFailure, (state, action) => ({ ...state, isUpdateingCertification: false, updateCertificationError: action.error })),
    // delete Certification
    on(CandidatesActions.deleteCertification, state => ({ ...state, isCreatingCertification: true, deleteCertificationError: {} })),
    on(CandidatesActions.deleteCertificationSuccess, (state, action) => ({ ...state, isDeletingCertification: false })),
    on(CandidatesActions.deleteCertificationFailure, (state, action) => ({ ...state, isDeletingCertification: false, deleteCertificationError: action.error })),
    // get logged in user failure
    on(AuthActions.getLoggedInUserFailure, (state) => ({ ...state, isValid: false })),
)

export function reducer(state: State | undefined, action: Action) {
    return candidateReducer(state, action);
}