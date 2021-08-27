import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DestroyService implements OnDestroy {
  private _destroyed$ = new Subject<void>();
  public destroyed$ = this._destroyed$.asObservable();
  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
