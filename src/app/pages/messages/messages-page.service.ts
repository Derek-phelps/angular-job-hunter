import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MessagesPageService {
  private _navState$ = new BehaviorSubject<'opened' | 'closed'>('opened');
  get navState$() {
    return this._navState$.asObservable();
  }
  constructor() { }

  setNavState(state: 'opened' | 'closed') {
    this._navState$.next(state);
  }
}
