import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Auth0Service } from './auth0.service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
      private auth0Service: Auth0Service,
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.auth0Service.getTokenSilently$().pipe(
      mergeMap(token => {
        const tokenReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next.handle(tokenReq);
      }),
    );

  }
}
