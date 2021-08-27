import { createAction, props } from '@ngrx/store';
import { Candidate, HttpError } from '@hellotemp/models';
import { CandidateRate, CandidateDegree, CandidateQualification, Reference, CandidateSkill, CandidateSoftwareSkill, CandidateIndustryExperience, CandidateCertification } from '@hellotemp/rest';

export const setCandidate = createAction(
    '[Candidates] Set Candidate',
    props<{ candidate: Candidate | Partial<Candidate>, isValid: boolean }>(),
)

export const setIsValid = createAction(
    '[Candidates] Set Is Valid',
    props<{ isValid: boolean }>(),
)

export const createCandidate = createAction(
    '[Candidates] Create Candidate',
    props<{ candidate: Candidate | Partial<Candidate>, close?: boolean }>(),
)


export const createCandidateSuccess = createAction(
    '[Candidates] Create Candidate Success',
    props<{ candidate: Candidate, close?: boolean}>(),
)


export const createCandidateFailure = createAction(
    '[Candidates] Create Candidate Failure',
    props<{ error: HttpError }>(),
)

export const updateCandidate = createAction(
    '[Candidates] Update Candidate',
    props<{ candidate: Candidate | Partial<Candidate>, close?: boolean }>(), 
)

export const updateCandidateSuccess = createAction(
    '[Candidates] Update Candidate Success',
    props<{ candidate: Candidate, close?: boolean }>(), 
)

export const updateCandidateFailure = createAction(
    '[Candidates] Update Candidate Failure',
    props<{ error: HttpError }>(), 
)

export const getUserCandidate = createAction(
    '[Candidates] Get user candidate',
    props<{ userId: string, candidateId: string }>(),
)

export const getUserCandidateSuccess = createAction(
    '[Candidates] Get user candidate Success',
    props<{ candidate: Candidate | null }>(),
)

export const getUserCandidateFailure = createAction(
    '[Candidates] Get user candidate Failure',
    props<{ error: any }>(),
)

export const createRate = createAction(
    '[Candidates] Create Rate',
    props<{ candidate: Candidate, rate: CandidateRate }>(),
)

export const createRateSuccess = createAction(
    '[Candidates] Create Rate Success',
    props<{ rate: CandidateRate }>(),
)

export const createRateFailure = createAction(
    '[Candidates] Create Rate Failure',
    props<{ error: HttpError }>(),
)

export const updateRate = createAction(
    '[Candidates] Update Rate',
    props<{ candidate: Candidate, rate: CandidateRate }>(),
)

export const updateRateSuccess = createAction(
    '[Candidates] Update Rate Success',
    props<{ rate: CandidateRate }>(),
)

export const updateRateFailure = createAction(
    '[Candidates] Update Rate Failure',
    props<{ error: HttpError }>(),
)

export const deleteRate = createAction(
    '[Candidates] Delete Rate',
    props<{ candidate: Candidate, rate: CandidateRate }>(),
)

export const deleteRateSuccess = createAction(
    '[Candidates] Delete Rate Success',
)

export const deleteRateFailure = createAction(
    '[Candidates] Delete Rate Failure',
    props<{ error: HttpError }>(),
)

export const createDegree = createAction(
    '[Candidates] Create Degree',
    props<{ candidate: Candidate, degree: CandidateDegree }>(),
)

export const createDegreeSuccess = createAction(
    '[Candidates] Create Degree Success',
    props<{ degree: CandidateDegree }>(),
)

export const createDegreeFailure = createAction(
    '[Candidates] Create Degree Failure',
    props<{ error: HttpError }>(),
)

export const updateDegree = createAction(
    '[Candidates] Update Degree',
    props<{ candidate: Candidate, degree: CandidateDegree }>(),
)

export const updateDegreeSuccess = createAction(
    '[Candidates] Update Degree Success',
    props<{ degree: CandidateDegree }>(),
)

export const updateDegreeFailure = createAction(
    '[Candidates] Update Degree Failure',
    props<{ error: HttpError }>(),
)

export const deleteDegree = createAction(
    '[Candidates] Delete Degree',
    props<{ candidate: Candidate, degree: CandidateDegree }>(),
)

export const deleteDegreeSuccess = createAction(
    '[Candidates] Delete Degree Success',
)

export const deleteDegreeFailure = createAction(
    '[Candidates] Delete Degree Failure',
    props<{ error: HttpError }>(),
)

export const createQualification = createAction(
    '[Candidates] Create Qualification',
    props<{ candidate: Candidate, qualification: CandidateQualification }>(),
)

export const createQualificationSuccess = createAction(
    '[Candidates] Create Qualification Success',
    props<{ Qualification: CandidateQualification }>(),
)

export const createQualificationFailure = createAction(
    '[Candidates] Create Qualification Failure',
    props<{ error: HttpError }>(),
)

export const updateQualification = createAction(
    '[Candidates] Update Qualification',
    props<{ candidate: Candidate, qualification: CandidateQualification }>(),
)

export const updateQualificationSuccess = createAction(
    '[Candidates] Update Qualification Success',
    props<{ qualification: CandidateQualification }>(),
)

export const updateQualificationFailure = createAction(
    '[Candidates] Update Qualification Failure',
    props<{ error: HttpError }>(),
)

export const deleteQualification = createAction(
    '[Candidates] Delete Qualification',
    props<{ candidate: Candidate, qualification: CandidateQualification }>(),
)

export const deleteQualificationSuccess = createAction(
    '[Candidates] Delete Qualification Success',
)

export const deleteQualificationFailure = createAction(
    '[Candidates] Delete Qualification Failure',
    props<{ error: HttpError }>(),
)

export const createSkill = createAction(
    '[Candidates] Create Skill',
    props<{ candidate: Candidate, skill: CandidateSkill }>(),
)

export const createSkillSuccess = createAction(
    '[Candidates] Create Skill Success',
    props<{ skill: CandidateSkill }>(),
)

export const createSkillFailure = createAction(
    '[Candidates] Create Skill Failure',
    props<{ error: HttpError }>(),
)

export const updateSkill = createAction(
    '[Candidates] Update Skill',
    props<{ candidate: Candidate, skill: CandidateSkill }>(),
)

export const updateSkillSuccess = createAction(
    '[Candidates] Update Skill Success',
    props<{ skill: CandidateSkill }>(),
)

export const updateSkillFailure = createAction(
    '[Candidates] Update Skill Failure',
    props<{ error: HttpError }>(),
)

export const deleteSkill = createAction(
    '[Candidates] Delete Skill',
    props<{ candidate: Candidate, skill: CandidateSkill }>(),
)

export const deleteSkillSuccess = createAction(
    '[Candidates] Delete Skill Success',
)

export const deleteSkillFailure = createAction(
    '[Candidates] Delete Skill Failure',
    props<{ error: HttpError }>(),
)

export const createSoftwareSkill = createAction(
    '[Candidates] Create SoftwareSkill',
    props<{ candidate: Candidate, softwareSkill: CandidateSoftwareSkill }>(),
)

export const createSoftwareSkillSuccess = createAction(
    '[Candidates] Create SoftwareSkill Success',
    props<{ softwareSkill: CandidateSoftwareSkill }>(),
)

export const createSoftwareSkillFailure = createAction(
    '[Candidates] Create SoftwareSkill Failure',
    props<{ error: HttpError }>(),
)

export const updateSoftwareSkill = createAction(
    '[Candidates] Update SoftwareSkill',
    props<{ candidate: Candidate, softwareSkill: CandidateSoftwareSkill }>(),
)

export const updateSoftwareSkillSuccess = createAction(
    '[Candidates] Update SoftwareSkill Success',
    props<{ softwareSkill: CandidateSoftwareSkill }>(),
)

export const updateSoftwareSkillFailure = createAction(
    '[Candidates] Update SoftwareSkill Failure',
    props<{ error: HttpError }>(),
)

export const deleteSoftwareSkill = createAction(
    '[Candidates] Delete SoftwareSkill',
    props<{ candidate: Candidate, softwareSkill: CandidateSoftwareSkill }>(),
)

export const deleteSoftwareSkillSuccess = createAction(
    '[Candidates] Delete SoftwareSkill Success',
)

export const deleteSoftwareSkillFailure = createAction(
    '[Candidates] Delete SoftwareSkill Failure',
    props<{ error: HttpError }>(),
)

export const createIndustryExperience = createAction(
    '[Candidates] Create IndustryExperience',
    props<{ candidate: Candidate, industryExperience: CandidateIndustryExperience }>(),
)

export const createIndustryExperienceSuccess = createAction(
    '[Candidates] Create IndustryExperience Success',
    props<{ industryExperience: CandidateIndustryExperience }>(),
)

export const createIndustryExperienceFailure = createAction(
    '[Candidates] Create IndustryExperience Failure',
    props<{ error: HttpError }>(),
)

export const updateIndustryExperience = createAction(
    '[Candidates] Update IndustryExperience',
    props<{ candidate: Candidate, industryExperience: CandidateIndustryExperience }>(),
)

export const updateIndustryExperienceSuccess = createAction(
    '[Candidates] Update IndustryExperience Success',
    props<{ industryExperience: CandidateIndustryExperience }>(),
)

export const updateIndustryExperienceFailure = createAction(
    '[Candidates] Update IndustryExperience Failure',
    props<{ error: HttpError }>(),
)

export const deleteIndustryExperience = createAction(
    '[Candidates] Delete IndustryExperience',
    props<{ candidate: Candidate, industryExperience: CandidateIndustryExperience }>(),
)

export const deleteIndustryExperienceSuccess = createAction(
    '[Candidates] Delete IndustryExperience Success',
)

export const deleteIndustryExperienceFailure = createAction(
    '[Candidates] Delete IndustryExperience Failure',
    props<{ error: HttpError }>(),
)

export const createCertification = createAction(
    '[Candidates] Create Certification',
    props<{ candidate: Candidate, certification: CandidateCertification }>(),
)

export const createCertificationSuccess = createAction(
    '[Candidates] Create Certification Success',
    props<{ certification: CandidateCertification }>(),
)

export const createCertificationFailure = createAction(
    '[Candidates] Create Certification Failure',
    props<{ error: HttpError }>(),
)

export const updateCertification = createAction(
    '[Candidates] Update Certification',
    props<{ candidate: Candidate, certification: CandidateCertification }>(),
)

export const updateCertificationSuccess = createAction(
    '[Candidates] Update Certification Success',
    props<{ certification: CandidateCertification }>(),
)

export const updateCertificationFailure = createAction(
    '[Candidates] Update Certification Failure',
    props<{ error: HttpError }>(),
)

export const deleteCertification = createAction(
    '[Candidates] Delete Certification',
    props<{ candidate: Candidate, certification: CandidateCertification }>(),
)

export const deleteCertificationSuccess = createAction(
    '[Candidates] Delete Certification Success',
)

export const deleteCertificationFailure = createAction(
    '[Candidates] Delete Certification Failure',
    props<{ error: HttpError }>(),
)

export const createReference = createAction(
    '[Candidates] Create Reference',
    props<{ candidate: Candidate, reference: Reference }>(),
)

export const createReferenceSuccess = createAction(
    '[Candidates] Create Reference Success',
    props<{ Reference: Reference }>(),
)

export const createReferenceFailure = createAction(
    '[Candidates] Create Reference Failure',
    props<{ error: HttpError }>(),
)

export const updateReference = createAction(
    '[Candidates] Update Reference',
    props<{ candidate: Candidate, reference: Reference }>(),
)

export const updateReferenceSuccess = createAction(
    '[Candidates] Update Reference Success',
    props<{ Reference: Reference }>(),
)

export const updateReferenceFailure = createAction(
    '[Candidates] Update Reference Failure',
    props<{ error: HttpError }>(),
)

export const deleteReference = createAction(
    '[Candidates] Delete Reference',
    props<{ candidate: Candidate, reference: Reference }>(),
)

export const deleteReferenceSuccess = createAction(
    '[Candidates] Delete Reference Success',
)

export const deleteReferenceFailure = createAction(
    '[Candidates] Delete Reference Failure',
    props<{ error: HttpError }>(),
)



