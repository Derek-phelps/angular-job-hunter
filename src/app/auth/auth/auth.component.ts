import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../auth0.service';
import { Router } from '@angular/router';
import * as AuthActions from '../store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'hellotemp-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  constructor(
    private auth0Service: Auth0Service,
    private store: Store<any>,
  ) { }

  ngOnInit() {
  }

  signUp() {
    this.store.dispatch(AuthActions.loginStart({
      mode: 'signup',
    }));
  }

  signIn() {
    this.store.dispatch(AuthActions.loginStart({}));
  }

  forgotPassword() {

  }
}
