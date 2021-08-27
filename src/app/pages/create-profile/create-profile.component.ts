import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { Observable } from 'rxjs';
import * as CandidatesActions from '../../store/candidates/candidates.actions';
import { Candidate } from '@hellotemp/models';
import { StorageService } from '../../services/storage.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { filter, map, startWith } from 'rxjs/operators';
import { MatTabNav } from '@angular/material';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-create-profile',
  templateUrl: './create-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  candidate$: Observable<State['candidates']> = this.store.select(state => state.candidates);
  public candidate: Candidate | Partial<Candidate> | null = null;
  public isValid = false;
  public isSettingCandidate = false;
  public isActive = true;
  public disabled = false;
  public links = [{
    url: '/create-profile/general-info',
    isActive: false,
    label: 'General Info',
  }, {
    url: '/create-profile/skills-expertise',
    isActive: false,
    label: 'Skills and Expertise',
  }, {
    url: '/create-profile/availability',
    isActive: false,
    label: 'Availability',
  }, {
    url: '/create-profile/history',
    isActive: false,
    label: 'History',
  }];

  @ViewChild(MatTabNav, {static: true}) tabs!: MatTabNav;
  constructor(
    public router: Router,
    private store: Store<State>,
    private storage: StorageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
    ).subscribe(() => {
      this.setLinksActive();
    });
    this.candidate$.subscribe(candidates => {
      const candidate = candidates.candidate;
      // setting disabled to control navigation if candidate hasn't been created
      this.disabled = !candidate || candidate && !candidate.id;
      if (candidate && candidate.id && !this.candidate && !this.isSettingCandidate) {
        this.isSettingCandidate = true;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: this.isValid }));
      }
      this.candidate = candidate;
      this.isValid = candidates.isValid;
      if (candidate && this.candidate) {
        this.isSettingCandidate = false;
        this.isActive = this.candidate.active !== false;
      } else {
        this.isActive = true;
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: { active: this.isActive }, isValid: this.isValid }));
      }
    })
  }

  ngOnDestroy() {}

  setLinksActive() {
    this.links = this.links.map(link => {
      return {
        ...link,
        isActive: this.router.isActive(link.url, true),
      };
    });
    this.cdr.detectChanges();
    this.tabs.updateActiveLink();
  }

  changeActive() {
    this.isActive = !this.isActive;
    const candidate = {
      ...this.candidate,
      active: this.isActive,
    }
    this.store.dispatch(CandidatesActions.setCandidate({ candidate, isValid: this.isValid }));
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

  onFileChanged(event: any) {
    const selectedFile = event.target.files[0];
    this.storage.uploadFile(selectedFile, 'profileImage').pipe(
      map(res => res.downloadUrl),
    )
    .subscribe({
      next: (url: string) => {
        const headshot = url
        this.store.dispatch(CandidatesActions.setCandidate({ candidate: { ...this.candidate, headshot }, isValid: this.isValid }))
      },
      error: (error: any) => console.warn('error in image upload', error),
    });
  }

}
