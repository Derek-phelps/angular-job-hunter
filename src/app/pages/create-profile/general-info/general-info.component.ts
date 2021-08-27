import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Candidate } from '@hellotemp/models';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CandidateRate } from '@hellotemp/rest';
import { Observable, combineLatest, Subject, asyncScheduler } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import { getEnumAsEntries } from '@hellotemp/util';
import { CommuteDistance, CommuteDistanceNumbers } from '@hellotemp/enum';
import * as CandidatesActions from '../../../store/candidates/candidates.actions';
import * as AuthActions from '../../../auth/store/auth.actions';
import { map, observeOn, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import {
  getJobTitleDefinitions,
  getSkillDefinitions,
  getSoftwareDefinitions,
  getCertificationDefinitions,
  getIndustryDefinitions,
  getCompanies,
} from '../../../store/definitions/definitions.actions';
import { ResponsiveService } from '../../../services/responsive.service';


const AmericanStates = [
  'AL',
  'AK',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WI',
  'WV',
  'WY',
  'AS',
  'GU',
  'MP',
  'PR',
  'UM',
  'VI',
];

function digitOnly(control: AbstractControl) {
  return /\d+/.test(control.value) ? null : {digitOnly: true};
}

@Component({
  selector: 'hellotemp-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneralInfoComponent implements OnInit, OnDestroy {
  // enums
  public getEnumAsEntries = getEnumAsEntries;
  public commuteDistance = getEnumAsEntries(CommuteDistance).reverse();
  public commuteDistanceNumbers = CommuteDistanceNumbers;

  // state
  auth$: Observable<State['auth']> = this.store.select(state => state.auth);
  candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);
  definitions$: Observable<State['definitions']> = this.store.select(state => state.definitions);

  // public
  public form!: FormGroup;
  public jobsArray: any[] = [];
  public isLoading = false;
  public candidate: Candidate | Partial<Candidate> | null = null;
  public AmericanStates = AmericanStates;

  // private
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private user: any;
  private userId!: string | null;
  private isGettingJobTitles = false;
  private isGettingSkills = false;
  private isGettingSoftware = false;
  private isGettingCertifications = false;
  private isGettingIndustries = false;
  private isGettingCompanies = false;
  isMobile$ = this.responsiveService.isMobile$;
  isValid = false;
  constructor(
    private store: Store<State>,
    private router: Router,
    private storage: StorageService,
    private responsiveService: ResponsiveService,
  ) {
  }

  get rates() {
    return this.form.get('rates') as FormArray;
  }

  ngOnInit() {
    combineLatest(this.auth$, this.candidates$, this.definitions$)
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe(([auth, candidates, definitions]) => {
      this.user = auth.user;
      this.userId = auth.userId;
      this.candidate = candidates.candidate;
      this.jobsArray = definitions.jobTitleDefinitions;
      this.handleDefinitions(definitions);
      this.isLoading = candidates.isGettingCandidate || candidates.isCreatingCandidate || candidates.isUpdatingCandidate || false;
      this.isValid = candidates.isValid;
      if (this.user.id) {
        if (this.candidate) {
          this.form = this.initOrUpdateForm(this.candidate as Candidate);
          if (this.form.valid !== candidates.isValid) {
            this.saveToState();
          }
        } else {
          this.form = this.initOrUpdateForm();
        }
      } else {
        if (this.candidate) {
          this.form = this.initOrUpdateForm(this.candidate as Candidate);
        } else {
          this.form = this.initOrUpdateForm();
        }
      }
    });
    const stateCtrl = (this.form.get('state') as FormControl);
    stateCtrl.valueChanges.pipe(
      observeOn(asyncScheduler),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      if (stateCtrl.valid) {
        this.saveToState();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initOrUpdateForm(candidate?: Candidate) {
    const formState = {
      firstName: candidate && candidate.firstName || candidate && candidate.user && candidate.user.firstName || '',
      lastName: candidate && candidate.lastName || candidate && candidate.user && candidate.user.lastName || '',
      phoneNumber: candidate && candidate.phoneNumber || null,
      street1: candidate && candidate.street1 || null,
      city: candidate && candidate.city || null,
      state: candidate && candidate.state || null,
      zip: candidate && candidate.zip || null,
      maxCommuteDistance: candidate && candidate.maxCommuteDistance ? candidate.maxCommuteDistance : CommuteDistance.fortyPlusMiles,
      bio: candidate && candidate.bio || null,
    }
    if (this.form) {
      const rateControls = candidate && candidate.rates ? this.populateRates(candidate.rates) : this.populateRates();
      this.form.setControl('rates', new FormArray(rateControls));
    } else {
      this.form = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl(null, [Validators.required]),
        street1: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        state: new FormControl(null, Validators.required),
        zip: new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          digitOnly,
        ]),
        maxCommuteDistance: new FormControl(0, Validators.required),
        bio: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
        rates: new FormArray(candidate && candidate.rates ? this.populateRates(candidate.rates) : this.populateRates()),
      });
    }
    this.form.patchValue(formState, {emitEvent: false});
    return this.form;
  }

  populateRates(rates?: CandidateRate[]) {
    if (rates && rates.length > 0) {
      const ratesForm = rates.map(r => {
        return this.rateForm(r);
      })

      // comment this line of code to prevent auto adding new form group after save rate
      // ratesForm.push(this.rateForm());
      return ratesForm;
    } else {
      return [ this.rateForm() ];
    }
  }

  addNewRate() {
    if (this.rates) {
      const blankRates = Array.from(this.rates.controls).filter(item => (!item.value.jobTitleId || !item.value.rate));
      if (blankRates && blankRates.length >= 1) {
        return;
      }
      this.rates.push(this.rateForm());
      const rateForm = Array.from(this.rates.controls);
      return this.form.setControl('rates', new FormArray(rateForm));
    }
  }

  rateForm(rate?: CandidateRate) {
    return new FormGroup({
      id: new FormControl(rate && rate.id || null),
      isPrimary: new FormControl(rate && rate.isPrimary || ''),
      rate: new FormControl(rate && rate.rate || null, [Validators.required, Validators.max(1000)]),
      jobTitleId: new FormControl(rate && rate.jobTitleId || null, [Validators.required]),
    });
  }

  rateInvalid(index: number) {
    const rates = this.form.get('rates') as FormArray;
    return rates.controls[index].value.jobTitleId && rates.controls[index].value.rate ? false : true;
  }

  saveRate(index: number) {
    const rates = this.form.get('rates') as FormArray;
    const candidate = new Candidate({ ...this.candidate } as Candidate);
    if (rates) {

      const rate = { ...rates.value[index] };
      // putting isPrimary to false here, can be updated once we have something to designate primary rate
      rate.isPrimary = false;
      if (rate.id && candidate.rates) {
        candidate.rates = [ ...candidate.rates ] // i guess this makes it no longer read only
        candidate.rates[index] = rate;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: this.form.valid }));
      }
      if (!rate.id && rate.rate && rate.jobTitleId) {
        // rate.id is null here, but still exists on the object.
        delete rate.id;
        if (this.rateInvalid(rates.length - 1)) {
          const updatedRates = [ ...candidate.rates ];
          updatedRates[index] = rate;
          candidate.rates = updatedRates;
        } else {

          // prevent auto adding same item after have a empty id Rate item then save
          const lastIndex = candidate.rates[candidate.rates.length - 1];
          if (JSON.stringify(rate) === JSON.stringify(lastIndex)) {
            return;
          }
          candidate.rates = [ ...candidate.rates, rate ];
        }
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: this.form.valid }));
      }
    }

  }

  deleteRate(index: number) {
    const rates = this.form.get('rates') as FormArray;
    if (rates) {
      const rate = rates.value[index];
      let candidateRates: any[] = [];
      if (this.candidate && this.candidate.rates) {
        candidateRates = this.candidate.rates.filter((n, i) => i !== index);
      }
      this.rates.removeAt(index);
      if (!rate.id) {
        return;
      }

      if (rate.id) {
        this.store.dispatch(CandidatesActions.deleteRate({ candidate: new Candidate({ ...this.candidate as Candidate, rates: candidateRates }), rate}))
      }
      this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate({ ...this.candidate as Candidate, rates: candidateRates }), isValid: this.form.valid }))
    }
  }

  // handle getting definitions if definitions haven't been fetched before getting to this view
  handleDefinitions(definitions: State['definitions']) {
    if (definitions.skillDefinitions.length === 0 && !this.isGettingSkills) {
      this.isGettingSkills = true;
      this.store.dispatch(getSkillDefinitions());
    }
    if (definitions.softwareDefinitions.length === 0 && !this.isGettingSoftware) {
      this.isGettingSoftware = true;
      this.store.dispatch(getSoftwareDefinitions());

    }
    if (definitions.jobTitleDefinitions.length === 0 && !this.isGettingJobTitles) {
      this.isGettingJobTitles = true;
      this.store.dispatch(getJobTitleDefinitions());
    }
    if (definitions.certificationDefinitions.length === 0 && !this.isGettingCertifications) {
      this.isGettingCertifications = true;
      this.store.dispatch(getCertificationDefinitions());
    }
    if (definitions.industryDefinitions.length === 0 && !this.isGettingIndustries) {
      this.isGettingIndustries = true;
      this.store.dispatch(getIndustryDefinitions());
    }
    if (definitions.companies.length === 0 && !this.isGettingCompanies) {
      this.isGettingCompanies = true;
      this.store.dispatch(getCompanies());
    }
  }

  next() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (this.form.valid) {
      this.saveToState();
      if (this.candidate && !this.candidate.id) {
        this.store.dispatch(CandidatesActions.createCandidate({ candidate: this.candidate }));
      }
      this.router.navigate(['/create-profile/skills-expertise']);
    }
  }

  saveToState(e?: any) {
    const { value } = this.form;
    const candidate = {
      ...this.candidate as Candidate,
      userId: this.user.id || this.userId,
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
      cellNumber: value.phoneNumber,
      street1: value.street1,
      city: value.city,
      zip: value.zip,
      state: value.state,
      maxCommuteDistance: value.maxCommuteDistance,
      bio: value.bio,
      // add rates here
    }
    localStorage.removeItem('candidateForm');
    localStorage.setItem('candidateForm', JSON.stringify(candidate));
    console.log(candidate)
    // this.store.dispatch(CandidatesActions.updateCandidate({ candidate: this.candidate as Candidate, close: true }));
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: this.form.valid }));
  }

  onFileChanged(event: any) {
    const selectedFile = event.target.files[0];
    this.storage.uploadFile(selectedFile, 'resume').pipe(
      map(res => res.downloadUrl),
    )
    .subscribe({
      next: (url: string) => {
        const resume = url
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: { ...this.candidate, resume }, isValid: this.form.valid }))
      },
      error: (error: any) => console.warn('error in file upload', error),
    })
  }

  removeResume() {
    this.storage.deleteFile('resume')
    .subscribe({
      next: (val: any) => console.log('deleted', val),
      error: (error: any) => console.warn('error in file upload', error),
      complete: () => {
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: { ...this.candidate, resume: null }, isValid: this.form.valid }))
      },
    })
  }

  submitCandidate() {
    if (this.form.valid) {
      if (this.candidate && this.candidate.id) {
        this.store.dispatch(CandidatesActions.updateCandidate({ candidate: this.candidate, close: true }));
      }
      if (this.candidate && !this.candidate.id) {
        this.store.dispatch(CandidatesActions.createCandidate({ candidate: this.candidate, close: true }));
      }
    }
  }

}
