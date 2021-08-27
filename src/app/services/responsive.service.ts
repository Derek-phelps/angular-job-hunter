import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  public isMobile$ = this.breakpointObserver.observe('(max-width: 599px)').pipe(
    map(breakpoint => breakpoint.matches),
    shareReplay(1),
  );
  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }
}
