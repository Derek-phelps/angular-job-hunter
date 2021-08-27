import { Action, createReducer, on } from '@ngrx/store';
import * as Actions from './definitions.actions';
import { IndustryDefinition, JobTitle, SkillDefinition, SoftwareDefinition, CertificationDefinition, Company } from '@hellotemp/rest';
import { Dictionary } from '@hellotemp/models';

export interface State {
    isGettingIndustries: boolean;
    getIndustriesError: any;
    industryDefinitions: IndustryDefinition[];
    isGettingSkills: boolean;
    getSkillsError: any;
    skillDefinitions: SkillDefinition[];
    isGettingSoftware: boolean;
    getSoftwareError: any;
    softwareDefinitions: SoftwareDefinition[];
    isGettingCertifications: boolean;
    getCertificationsError: any;
    certificationDefinitions: CertificationDefinition[];
    isGettingJobTitles: boolean;
    getJobTitlesError: any;
    jobTitleDefinitions: JobTitle[];
    companies: Company[];
    isGettingCompanies: boolean;
    getCompaniesError: any;
    dictionary: Dictionary;
}

const dictionary: Dictionary = {
    industry: {},
    jobTitles: {},
    skills: {},
    software: {},
    certifications: {},
    companies: {},
}

export const initialState: State = {
    isGettingIndustries: false,
    getIndustriesError: {},
    industryDefinitions: [],
    isGettingSkills: false, 
    getSkillsError: {},
    skillDefinitions: [],
    isGettingSoftware: false,
    getSoftwareError: {},
    softwareDefinitions: [],
    isGettingCertifications: false,
    getCertificationsError: {},
    certificationDefinitions: [],
    isGettingJobTitles: false,
    getJobTitlesError: {},
    jobTitleDefinitions: [],
    companies: [],
    getCompaniesError: {},
    isGettingCompanies: false,
    dictionary,
}

const definitionsReducer = createReducer(
    initialState,
    // industry
    on(Actions.getIndustryDefinitions, state => ({ ...state, isGettingIndustries: true, getIndustriesError: {} })),
    on(Actions.getIndustryDefinitionsSuccess, (state, action) => ({ ...state, isGettingIndustries: false, industryDefinitions: action.industryDefinitions, dictionary: { ...state.dictionary, industry: action.dictionaryEntry } })),
    on(Actions.getIndustryDefinitionsFailure, (state, action) => ({ ...state, isGettingIndustries: false, getIndustriesError: action.error })),
    // skills
    on(Actions.getSkillDefinitions, state => ({ ...state, isGettingSkills: true, getSkillsError: {} })),
    on(Actions.getSkillDefinitionsSuccess, (state, action) => ({ ...state, isGettingSkills: false, skillDefinitions: action.skillDefinitions, dictionary: { ...state.dictionary, skills: action.dictionaryEntry }  })),
    on(Actions.getSkillDefinitionsFailure, (state, action) => ({ ...state, isGettingSkills: false, getSkillsError: action.error })),
    // software
    on(Actions.getSoftwareDefinitions, state => ({ ...state, isGettingSoftware: true, getSoftwareError: {} })),
    on(Actions.getSoftwareDefinitionsSuccess, (state, action) => ({ ...state, isGettingSoftware: false, softwareDefinitions: action.softwareDefinitions, dictionary: { ...state.dictionary, software: action.dictionaryEntry }  })),
    on(Actions.getSoftwareDefinitionsFailure, (state, action) => ({ ...state, isGettingSoftware: false, getSoftwareError: action.error })),
    // certifications
    on(Actions.getCertificationDefinitions, state => ({ ...state, isGettingCertifications: true, getCertificationsError: {} })),
    on(Actions.getCertificationDefinitionsSuccess, (state, action) => ({ ...state, isGettingCertifications: false, certificationDefinitions: action.certificationDefinitions, dictionary: { ...state.dictionary, certifications: action.dictionaryEntry }  })),
    on(Actions.getCertificationDefinitionsFailure, (state, action) => ({ ...state, isGettingCertifications: false, getCertificationsError: action.error })),
    // job title
    on(Actions.getJobTitleDefinitions, state => ({ ...state, isGettingJobTitles: true, getJobTitlesError: {} })),
    on(Actions.getJobTitleDefinitionsSuccess, (state, action) => ({ ...state, isGettingJobTitles: false, jobTitleDefinitions: action.jobTitleDefinitions, dictionary: { ...state.dictionary, jobTitles: action.dictionaryEntry }  })),
    on(Actions.getJobTitleDefinitionsFailure, (state, action) => ({ ...state, isGettingJobTitles: false, getjobTitleDefinitionsError: action.error })),
    // companies
    on(Actions.getCompaniesSuccess, state => ({ ...state, isGettingCompanies: true, getCompaniesError: {} })),
    on(Actions.getCompaniesSuccess, (state, action) => ({ ...state, isGettingCompanies: false, companies: action.companies, dictionary: { ...state.dictionary, companies: action.dictionaryEntry }  })),
    on(Actions.getCompaniesFailure, (state, action) => ({ ...state, isGettingCompanies: false, getCompaniesError: action.error })),
)

export function reducer(state: State | undefined, action: Action) {
    return definitionsReducer(state, action);
}