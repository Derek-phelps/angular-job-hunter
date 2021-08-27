import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  public unsubscribeState = new Subject<void>();
  public unsubscribeState$ = this.unsubscribeState.asObservable();

  public unsubscribeMessages$ = new Subject<void>();
  public unsubMessages$ = this.unsubscribeMessages$.asObservable();

  public unsubscribeToken$ = new Subject<void>();
  public unsubToken$ = this.unsubscribeToken$.asObservable();
  
  constructor() { }
}
