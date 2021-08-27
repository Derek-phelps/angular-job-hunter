import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { IndustryDefinition, SkillRequirement, SkillDefinition, SoftwareDefinition, CertificationDefinition, CandidateSkill, CandidateSoftwareSkill, CandidateCertification, CandidateIndustryExperience } from '@hellotemp/rest';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import { Router } from '@angular/router';
import { Candidate, Dictionary } from '@hellotemp/models';
import * as CandidatesActions from '../../../store/candidates/candidates.actions';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ResponsiveService } from '../../../services/responsive.service';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-skills-expertise',
  templateUrl: './skills-expertise.component.html',
  styleUrls: ['./skills-expertise.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkillsExpertiseComponent implements OnInit, OnDestroy {
  candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);
  definitions$: Observable<State['definitions']> = this.store.select(state => state.definitions);
  candidate!: Candidate | Partial<Candidate> | null;
  industryOptions: IndustryDefinition[] = [];
  selectedIndustries: CandidateIndustryExperience[] = [];
  selectedSkills: CandidateSkill[] = [];
  skillOptions: SkillDefinition[] = [];
  selectedSoftware: CandidateSoftwareSkill[] = [];
  softwareOptions: SoftwareDefinition[] = [];
  certificationOptions: CertificationDefinition[] = [];
  selectedCertifications: CandidateCertification[] = [];
  dictionary!: Dictionary;
  public isLoading = false;
  isValid = false;
  constructor(
    private store: Store<State>,
    private router: Router,
    public responsiveService: ResponsiveService,
  ) {
    combineLatest(this.candidates$, this.definitions$)
    .subscribe(([candidates, definitions]) => {
      this.candidate = candidates.candidate as Candidate;
      this.dictionary = definitions.dictionary;
      if (this.candidate && this.candidate.skills) {
        this.selectedSkills = this.candidate.skills
        this.selectedSoftware = this.candidate.softwareSkills || []
        this.selectedIndustries = this.candidate.industryExperiences || []
        this.selectedCertifications = this.candidate.certifications || [];
      }
      this.isLoading = candidates.isGettingCandidate || candidates.isCreatingCandidate || candidates.isUpdatingCandidate || false;
      this.industryOptions = definitions.industryDefinitions;
      this.skillOptions = definitions.skillDefinitions;
      this.softwareOptions = definitions.softwareDefinitions;
      this.certificationOptions = definitions.certificationDefinitions;
      this.isValid = candidates.isValid;
    });
  }


  ngOnInit() {
    // this.store.dispatch(CandidatesActions.setIsValid({ isValid: true }));
  }

  ngOnDestroy() {}

  public cancel() {
    this.router.navigate(['/profile']);
  }

  public navigateToDescription() {
    if (!this.isValid) {
      return;
    }
    this.store.dispatch(CandidatesActions.updateCandidate({ candidate: this.candidate as Candidate }));
    this.router.navigate(['/create-profile/availability']);
  }

  public certificationSelected(certificationDefinition: CertificationDefinition) {
    const candidate = { ...this.candidate } as Candidate;
    const certification = {
      candidateId: candidate.id,
      certificationDefinitionId: certificationDefinition.id,
      isActive: false,
    }
    candidate.certifications = [ ...candidate.certifications, { ...certification, certificationDefinition } as any];
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.createCertification({ candidate, certification: certification as any }))
  }

  public certificationUnselected(unselectedCertification: CandidateCertification) {
    let candidate = { ...this.candidate } as Candidate;
    const certification = {
      candidateId: candidate.id,
      certificationDefinitionId: unselectedCertification.certificationDefinitionId,
      id: unselectedCertification.id,
    }
    if (unselectedCertification.id) {
      this.store.dispatch(CandidatesActions.deleteCertification({ candidate, certification: certification as any }));
    }
    this.selectedCertifications = this.selectedCertifications.filter(c => c.certificationDefinitionId !== unselectedCertification.certificationDefinitionId);
    candidate = { ...candidate, certifications: this.selectedCertifications } as Candidate;
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
  }

  public industrySelected(industry: IndustryDefinition) {
    const candidate = { ...this.candidate } as Candidate;
    const industryExperience = {
      candidateId: candidate.id,
      industryDefinitionId: industry.id,
    }
    candidate.industryExperiences = [ ...candidate.industryExperiences, { ...industryExperience, industryDefinition: industry } as any];
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.createIndustryExperience({ candidate: this.candidate as Candidate, industryExperience: industryExperience as CandidateIndustryExperience }))
  }

  public industryUnselected(unselectedIndustry: CandidateIndustryExperience) {
    const candidate = { ...this.candidate } as Candidate;
    const industryExperience = {
      candidateId: candidate.id,
      industryDefinitionId: unselectedIndustry.industryDefinitionId,
      id: unselectedIndustry.id,
    }
    if (unselectedIndustry.id) {
      this.store.dispatch(CandidatesActions.deleteIndustryExperience({ candidate: this.candidate as Candidate, industryExperience: industryExperience as CandidateIndustryExperience }))
    }
    this.selectedIndustries = this.selectedIndustries.filter(industry => industry.industryDefinitionId !== unselectedIndustry.industryDefinitionId);
    candidate.industryExperiences = this.selectedIndustries;
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
  }

  public softwareSelected(software: SoftwareDefinition) {
    const candidate = { ...this.candidate } as Candidate;
    const softwareSkill = {
      candidateId: candidate.id,
      softwareDefinitionId: software.id,
      skillLevel: 0,
    }
    candidate.softwareSkills = [ ...candidate.softwareSkills, { ...softwareSkill, softwareDefinition: software } as any];
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.createSoftwareSkill({ candidate: this.candidate as Candidate, softwareSkill: softwareSkill as CandidateSoftwareSkill }))
  }

  public softwareUnselected(unselectedSoftware: CandidateSoftwareSkill) {
    const candidate = { ...this.candidate } as Candidate;
    const softwareSkill = {
      candidateId: candidate.id,
      id: unselectedSoftware.id,
      softwareDefinitionId: unselectedSoftware.id,
    } as any
    if (unselectedSoftware.id) {
      this.store.dispatch(CandidatesActions.deleteSoftwareSkill({ candidate: this.candidate as Candidate, softwareSkill: softwareSkill as CandidateSoftwareSkill }))
    }
    this.selectedSoftware = this.selectedSoftware.filter(s => s.softwareDefinitionId !== unselectedSoftware.softwareDefinitionId);
    candidate.softwareSkills = this.selectedSoftware;
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
  }

  public skillSelected(skillDefinition: SkillDefinition) {
    const candidate = { ...this.candidate } as Candidate;
    const skill = {
      candidateId: candidate.id,
      skillDefinitionId: skillDefinition.id,
      skillLevel: 0,
    }
    candidate.skills = [ ...candidate.skills, { ...skill, skillDefinition } as any];
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.createSkill({ candidate: this.candidate as Candidate, skill: skill as CandidateSkill }))
  }

  public skillUnselected(unselectedSkill: CandidateSkill) {
    const candidate = { ...this.candidate } as Candidate;
    const skill = {
      candidateId: candidate.id,
      skillDefinitionId: unselectedSkill.skillDefinitionId,
      id: unselectedSkill.id,
    }
    if (unselectedSkill.id) {
      this.store.dispatch(CandidatesActions.deleteSkill({ candidate: this.candidate as Candidate, skill: skill as CandidateSkill }))
    }
    this.selectedSkills = this.selectedSkills.filter(s => s.skillDefinitionId !== unselectedSkill.skillDefinitionId);
    candidate.skills = this.selectedSkills;
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
  }

  public desiredAbilityUpdateSkills(value: CandidateSkill | any) {
    const candidate = { ...this.candidate } as Candidate;
    this.selectedSkills = this.selectedSkills.map(s => {
      if (s.skillDefinitionId === value.skillDefinitionId) {
        s = value;
      }
      return s;
    });
    candidate.skills = [ ...this.selectedSkills ];
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.updateSkill({ candidate, skill: value }))
  }

  public desiredAbilityUpdateSoftware(value: CandidateSoftwareSkill | any) {
    const candidate = { ...this.candidate } as Candidate;
    this.selectedSoftware = this.selectedSoftware.map(s => {
      if (s.softwareDefinitionId === value.softwareDefinitionId) {
        s = value;
      }
      return s;
    });
    candidate.softwareSkills = this.selectedSoftware;
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.updateSoftwareSkill({ candidate, softwareSkill: value }));

  }

  public isActiveUpdate(value: CandidateCertification) {
    console.log(value);
    const candidate = { ...this.candidate } as Candidate;
    this.selectedCertifications = this.selectedCertifications.map(s => {
      if (s.certificationDefinitionId === value.certificationDefinitionId) {
        s = value;
      }
      return s;
    })
    candidate.certifications = this.selectedCertifications;
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
    // this.store.dispatch(CandidatesActions.updateCertification({ candidate, certification: value }));
  }

  submitCandidate() {
    if (this.isValid) {
      if (this.candidate && this.candidate.id) {
        this.store.dispatch(CandidatesActions.updateCandidate({ candidate: this.candidate, close: true }));
      }
      if (this.candidate && !this.candidate.id) {
        this.store.dispatch(CandidatesActions.createCandidate({ candidate: this.candidate, close: true }));
      }
    }
  }
}
