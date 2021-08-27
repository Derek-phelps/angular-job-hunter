import { Component, OnInit, OnDestroy } from '@angular/core';
import { Candidate } from '@hellotemp/models';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';
import * as CandidatesActions from '../../../store/candidates/candidates.actions';
import { DateTime } from 'luxon';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ResponsiveService } from '../../../services/responsive.service';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
})
export class AvailabilityComponent implements OnInit, OnDestroy {
  candidates$: Observable<State['candidates']> = this.store.select(state => state.candidates);
  private candidate: Candidate | Partial<Candidate> | null = null;

  public form!: FormGroup;
  public hours = Array(80).fill(0).map((x, i) => (i + 1).toString());
  public weeks = Array(52).fill(0).map((x, i) => (i + 1).toString());
  public isLoading = false;
  isMobile$ = this.responsiveService.isMobile$;
  isValid = false;
  constructor(
    private store: Store<State>,
    private router: Router,
    private responsiveService: ResponsiveService,
  ) {
    this.candidates$.subscribe(candidates => {
      this.candidate = candidates.candidate;
      this.isLoading = !this.candidate || candidates.isGettingCandidate || candidates.isUpdatingCandidate || false;
      this.isValid = candidates.isValid;
      if (this.candidate) {
        this.form = this.initForm(this.candidate as Candidate);
        this.form.valueChanges.subscribe(() => this.saveToState());
      }
    })
  }

  ngOnInit() {
    // this.store.dispatch(CandidatesActions.setIsValid({ isValid: true }));
  }

  ngOnDestroy() {}

  get willWorkRemote() {
    return this.form.get('willWorkRemote') as FormControl;
  }

  get maxHoursPerWeek() {
    return this.form.get('maxHoursPerWeek') as FormControl;
  }

  initForm(candidate?: Candidate) {
    return new FormGroup({
      hasFlexSchedule: new FormControl(candidate && candidate.hasFlexSchedule || false),
      nextAvailableDate: new FormControl(candidate && candidate.nextAvailableDate && DateTime.fromISO(candidate.nextAvailableDate).toString() || ''),
      availableUntil: new FormControl(candidate && candidate.availableUntil && DateTime.fromISO(candidate.availableUntil).toString() || ''),
      minEngagementDurationWeeks: new FormControl(candidate && candidate.minEngagementDurationWeeks && candidate.minEngagementDurationWeeks.toString() || candidate && candidate.maxEngagementDurationWeeks === null && 'No preference' || 'No preference'),
      maxEngagementDurationWeeks: new FormControl(candidate && candidate.maxEngagementDurationWeeks && candidate.maxEngagementDurationWeeks.toString() || candidate && candidate.maxEngagementDurationWeeks === null && 'No preference' || 'No preference'),
      maxHoursPerWeek: new FormControl(candidate && candidate.maxHoursPerWeek && candidate.maxHoursPerWeek.toString() || candidate && candidate.maxHoursPerWeek === null && 'No preference' || 'No preference'),
      willWorkRemote: new FormControl(candidate && candidate.willWorkRemote || false),
      scheduleDescription: new FormControl(candidate && candidate.scheduleDescription || null),
    })
  }

  next() {
    if (!this.isValid) {
      return;
    }
    this.saveToState();
    this.store.dispatch(CandidatesActions.updateCandidate({ candidate: this.candidate as Candidate}));
    this.router.navigate(['/create-profile/history'])
  }

  saveToState() {
    const { value } = this.form;
    const candidate = {
      ...this.candidate as Candidate,
      hasFlexSchedule: value.hasFlexSchedule,
      nextAvailableDate: DateTime.fromJSDate(new Date(value.nextAvailableDate)).toISODate(),
      availableUntil: DateTime.fromJSDate(new Date(value.availableUntil)).toISODate(),
      minEngagementDurationWeeks: value.minEngagementDurationWeeks === 'No preference' ? null : value.minEngagementDurationWeeks,
      maxEngagementDurationWeeks: value.maxEngagementDurationWeeks === 'No preference' ? null : value.maxEngagementDurationWeeks,
      maxHoursPerWeek: value.maxHoursPerWeek === 'No preference' ? null : value.maxHoursPerWeek,
      willWorkRemote: value.willWorkRemote,
      scheduleDescription: value.scheduleDescription,
    };
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: true }));
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
