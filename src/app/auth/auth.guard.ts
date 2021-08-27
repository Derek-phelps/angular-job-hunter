import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { Auth0Service } from './auth0.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth0Service: Auth0Service,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth0Service.isAuthenticated$.pipe(
      take(1),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/session']);
        }
      }),
    );
  }
}
