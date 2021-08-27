import { createAction, props } from '@ngrx/store';
import { CertificationDefinition, IndustryDefinition, JobTitle, SkillDefinition, SoftwareDefinition, Company } from '@hellotemp/rest';
import { DictionaryEntry } from '@hellotemp/models';

export const getIndustryDefinitions = createAction(
    '[Definitions] Get Industry Definitions',
)

export const getIndustryDefinitionsSuccess = createAction(
    '[Definitions] Get Industry Definitions Success',
    props<{ industryDefinitions: IndustryDefinition[], dictionaryEntry: DictionaryEntry }>(),
)

export const getIndustryDefinitionsFailure = createAction(
    '[Definitions] Get Industry Definitions Failure',
    props<{ error: any }>(),
)

export const getJobTitleDefinitions = createAction(
    `[Definitions] Get Job Titles`,
)

export const getJobTitleDefinitionsSuccess = createAction(
    `[Definitions] Get Job Titles Success`,
    props<{ jobTitleDefinitions: JobTitle[], dictionaryEntry: DictionaryEntry }>(),
)

export const getJobTitleDefinitionsFailure = createAction(
    `[Definitions] Get Job Titles Failure`,
    props<{ error: any }>(),
)

export const getSkillDefinitions = createAction(
    '[Definitions] Get Skill Definitions',
)

export const getSkillDefinitionsSuccess = createAction(
    '[Definitions] Get Skill Definitions Success',
    props<{ skillDefinitions: SkillDefinition[], dictionaryEntry: DictionaryEntry }>(),
)

export const getSkillDefinitionsFailure = createAction(
    '[Definitions] Get Skill Definitions Failure',
    props<{ error: any }>(),
)

export const getSoftwareDefinitions = createAction(
    '[Definitions] Get Software Definitions',
)

export const getSoftwareDefinitionsSuccess = createAction(
    '[Definitions] Get Software Definitions Success',
    props<{ softwareDefinitions: SoftwareDefinition[], dictionaryEntry: DictionaryEntry }>(),
)

export const getSoftwareDefinitionsFailure = createAction(
    '[Definitions] Get Software Definitions Failure',
    props<{ error: any }>(),
)

export const getCertificationDefinitions = createAction(
    '[Definitions] Get Certification Definitions',
)

export const getCertificationDefinitionsSuccess = createAction(
    '[Definitions] Get Certification Definitions Success',
    props<{ certificationDefinitions: CertificationDefinition[], dictionaryEntry: DictionaryEntry }>(),
)

export const getCertificationDefinitionsFailure = createAction(
    '[Definitions] Get Certification Definitions Failure',
    props<{ error: any }>(),
)

export const getCompanies = createAction(
    '[Definitions] Get Companies',
)

export const getCompaniesSuccess = createAction(
    '[Definitions] Get Companies Success',
    props<{ companies: Company[], dictionaryEntry: DictionaryEntry}>(),
)

export const getCompaniesFailure = createAction(
    '[Definitions] Get Companies Failure',
    props<{ error: any }>(),
)
