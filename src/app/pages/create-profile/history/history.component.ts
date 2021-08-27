import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Candidate } from '@hellotemp/models';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CandidateDegree, CandidateQualification, Reference } from '@hellotemp/rest';
import * as CandidatesActions from '../../../store/candidates/candidates.actions';
import * as ReviewsActions from '../../../store/reviews/reviews.actions';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ResponsiveService } from '../../../services/responsive.service';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
  candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);

  private candidate: Candidate | Partial<Candidate> | null = null;
  public isLoading = false;
  public form!: FormGroup;
  isMobile$ = this.responsiveService.isMobile$;
  constructor(
    private store: Store<State>,
    private router: Router,
    private responsiveService: ResponsiveService,
  ) {
    this.candidates$.subscribe(candidates => {
      this.candidate = candidates.candidate;
      if (this.candidate) {
        this.form = this.initForm(this.candidate as Candidate);
      }
      this.isLoading = !this.form || candidates.isCreatingCandidate || candidates.isUpdatingCandidate || false;
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  get degrees() {
    return this.form.get('degrees') as FormArray;
  }

  get qualifications() {
    return this.form.get('qualifications') as FormArray;
  }

  get references() {
    return this.form.get('references') as FormArray;
  }

  get reviewers() {
    return this.form.get('reviewers') as FormArray;
  }

  initForm(candidate?: Candidate) {
    return new FormGroup({
      degrees: new FormArray(candidate && candidate.degrees ? this.populateForm(candidate.degrees, this.degreeForm) : [ this.degreeForm() ]),
      qualifications: new FormArray(candidate && candidate.qualifications ? this.populateForm(candidate.qualifications, this.qualificationForm) : [ this.qualificationForm() ]),
      references: new FormArray(candidate && candidate.references ? this.populateForm(candidate.references, this.referenceForm) : [ this.referenceForm() ]),
      reviewers: new FormArray(candidate && candidate.reviewRequests ? this.populateForm(candidate.reviewRequests, this.reviewerForm) : [ this.reviewerForm() ]),
    })
  }

  populateForm(array: any, form: any) {
    const formArray = array.reduce((acc: any, el: any) => {
       acc = [ ...acc, form(el)];
      return acc;
    }, [])
    formArray.push(form());
    return formArray;
  }

  degreeForm(degree?: CandidateDegree) {
    return new FormGroup({
      id: new FormControl(degree && degree.id || null),
      degreeObtained: new FormControl(degree && degree.degreeObtained || '', Validators.required),
      institution: new FormControl(degree && degree.institution || '', Validators.required),
    })
  }

  qualificationForm(qualification?: CandidateQualification) {
    return new FormGroup({
      id: new FormControl(qualification && qualification.id || null),
      title: new FormControl(qualification && qualification.title || '', Validators.required),
      institution: new FormControl(qualification && qualification.institution || '', Validators.required),
    })
  }

  referenceForm(reference?: Reference) {
    return new FormGroup({
      id: new FormControl(reference && reference.id || null),
      email: new FormControl(reference && reference.email || '', Validators.required),
      firstName: new FormControl(reference && reference.firstName || '', Validators.required),
      lastName: new FormControl(reference && reference.lastName || '', Validators.required),
      phoneNumber: new FormControl(reference && reference.phoneNumber || '', Validators.required),
      company: new FormControl(reference && reference.company || '', Validators.required),
      title: new FormControl(reference && reference.title || '', Validators.required),
    })
  }

  reviewerForm(review?: any) {
    return new FormGroup({
      id: new FormControl(review && review.externalReviewer && review.externalReviewer.id || null),
      email: new FormControl(review && review.externalReviewer && review.externalReviewer.email || '', [Validators.required, Validators.email]),
      firstName: new FormControl(review && review.externalReviewer && review.externalReviewer.firstName || '', Validators.required),
      lastName: new FormControl(review && review.externalReviewer && review.externalReviewer.lastName || '', Validators.required),
      companyName: new FormControl(review && review.externalReviewer && review.externalReviewer.companyName || '', Validators.required),
      jobTitle: new FormControl(review && review.externalReviewer && review.externalReviewer.jobTitle || '', Validators.required),
    })
  }

  saveDegree(index: number) {
    const degrees = this.form.get('degrees') as FormArray;
    const candidate = { ...this.candidate } as Candidate;
    if (degrees) {
      let degree = { ...degrees.value[index] };
      if (degree.id && candidate.degrees.length > 0) {
        candidate.degrees = [ ...candidate.degrees ]
        candidate.degrees[index] = degree;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: true }));
        this.store.dispatch(CandidatesActions.updateDegree({ candidate, degree }));
      }
      if (!degree.id && degree.degreeObtained && degree.institution) {
        delete degree.id;
        this.store.dispatch(CandidatesActions.createDegree({ candidate, degree }));
        degree = { ...degree, id: '' };
        const updatedCandidate = { ...candidate, degrees: [ ...candidate.degrees, degree ] };
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(updatedCandidate), isValid: true }));
      }
    }
  }

  deleteDegree(index: number) {
    const degrees = this.form.get('degrees') as FormArray;
    if (degrees) {
      const degree = degrees.value[index];
      if (this.candidate && this.candidate.degrees) {
        const candidateDegrees = this.candidate.degrees.filter((n, i) => i !== index);
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate({ ...this.candidate as Candidate, degrees: candidateDegrees }), isValid: true }));
        this.store.dispatch(CandidatesActions.deleteDegree({ candidate: this.candidate as Candidate, degree }));
      }
    }
  }

  saveQualification(index: number) {
    const qualifications = this.form.get('qualifications') as FormArray;
    const candidate = { ...this.candidate } as Candidate;
    if (qualifications) {
      let qualification = { ...qualifications.value[index] };
      if (qualification.id && candidate.qualifications.length > 0) {
        candidate.qualifications = [ ...candidate.qualifications ]
        candidate.qualifications[index] = qualification;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: true }));
        this.store.dispatch(CandidatesActions.updateQualification({ candidate, qualification }));
      }
      if (!qualification.id && qualification.title && qualification.institution) {
        delete qualification.id;
        this.store.dispatch(CandidatesActions.createQualification({ candidate, qualification }));
        qualification = { ...qualification, id: '' };
        const updatedCandidate = { ...candidate, qualifications: [ ...candidate.qualifications, qualification ] };
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(updatedCandidate), isValid: true }));
      }
    }
  }

  deleteQualification(index: number) {
    const qualifications = this.form.get('qualifications') as FormArray;
    if (qualifications) {
      const qualification = qualifications.value[index];
      if (this.candidate && this.candidate.qualifications) {
        const candidateQualifications = this.candidate.qualifications.filter((n, i) => i !== index);
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate({ ...this.candidate as Candidate, qualifications: candidateQualifications }), isValid: true }));
        this.store.dispatch(CandidatesActions.deleteQualification({ candidate: this.candidate as Candidate, qualification }));
      }
    }
  }

  saveReference(index: number) {
    const references = this.form.get('references') as FormArray;
    let candidate = { ...this.candidate } as Candidate;
    if (references) {
      let reference = { ...references.value[index] };
      if (reference.id && candidate.references.length > 0) {
        candidate.references = [ ...candidate.references ]
        candidate.references[index] = reference;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: true }));
        this.store.dispatch(CandidatesActions.updateReference({ candidate, reference }));
      }
      if (!reference.id && reference.firstName && reference.lastName && reference.company && reference.title && reference.phoneNumber && reference.email) {
        delete reference.id;
        reference.candidateId = candidate.id;
        this.store.dispatch(CandidatesActions.createReference({ candidate, reference }));
        reference = { ...reference, id: ''};
        candidate = { ...candidate, references: [ ...candidate.references, reference ] } as Candidate;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: true }));
      }
    }
  }

  deleteReference(index: number) {
    const references = this.form.get('references') as FormArray;
    if (references) {
      const reference = references.value[index];
      if (this.candidate && this.candidate.references) {
        const candidateReferences = this.candidate.references.filter((n, i) => i !== index);
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate({ ...this.candidate as Candidate, references: candidateReferences }), isValid: true }));
        this.store.dispatch(CandidatesActions.deleteReference({ candidate: this.candidate as Candidate, reference }));
      }
    }
  }

  // this fires off the email as well as saving the reviewer in the database
  saveReviewer(index: number) {
    const reviewers = this.form.get('reviewers') as FormArray;
    let candidate = { ...this.candidate } as Candidate;
    if (reviewers) {
      let reviewer = reviewers.value[index];
      if (reviewer.id && candidate.reviewRequests.length > 0) {
        const requests = candidate.reviewRequests.map(r => {
          if (r.externalReviewer.id === reviewer.id) {
            return { ...r, externalReviewer: reviewer};
          }
          return r;
        });
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate({ ...candidate, reviewRequests: requests }), isValid: true }));
        this.store.dispatch(ReviewsActions.updateExternalReviewer({ candidate, externalReviewer: reviewer }));
      }
      if (!reviewer.id && reviewer.firstName && reviewer.lastName && reviewer.email && reviewer.companyName && reviewer.jobTitle) {
        delete reviewer.id;
        this.store.dispatch(ReviewsActions.createExternalReviewer({ candidate, externalReviewer: reviewer }));
        reviewer = { ...reviewer, id: '' };
        const requests = [ ...candidate.reviewRequests, { externalReviewer: reviewer }];
        candidate = { ...candidate, reviewRequests: requests } as Candidate;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate(candidate), isValid: true }));
      }
    }
  }

  deleteReviewer(index: number) {
    const reviewers = this.form.get('reviewers') as FormArray;
    const candidate = { ...this.candidate };
    if (reviewers) {
      const reviewer = reviewers.value[index];
      if (this.candidate && this.candidate.reviewRequests) {
        const candidateReviewers = this.candidate.reviewRequests.filter((n, i) => i !== index);
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: new Candidate({ ...this.candidate as Candidate, reviewRequests: candidateReviewers }), isValid: true }));
        this.store.dispatch(ReviewsActions.deleteExternalReviewer({ candidate: candidate as Candidate, externalReviewer: reviewer }));
      }
    }
  }

  saveToState() {
    const { value } = this.form;
    const candidateObj = this.candidate as Candidate;
    const candidate = {
      ...candidateObj,
      degrees: [ value.degrees ],
      qualifications: [ value.qualifications ],
      references: [ value.references ],
    }
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
  }

  next() {
    this.store.dispatch(CandidatesActions.updateCandidate({ candidate: this.candidate as Candidate, close: true }))
    this.router.navigate(['/profile'])
  }

}
