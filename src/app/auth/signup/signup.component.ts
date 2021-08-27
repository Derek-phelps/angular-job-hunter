import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AuthActions from '../store/auth.actions';

// import { AuthService } from '../auth.service';
// import { AlertService } from 'src/app/shared/services/alert.service';

import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

function passwordValidator(control: AbstractControl) {
  const result = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/.test(control.value);
  return result ? null : {passwordRules: true};
}

@Component({
  selector: 'hellotemp-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public form: FormGroup;

  constructor(
    // private alertService: AlertService,
    // private authService: AuthService,
    private router: Router,
    private store: Store<State>,
  ) {
    this.form = this.initForm();

  }

  initForm() {
    return new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl(null, Validators.compose([
        passwordValidator,
        Validators.minLength(8),
        Validators.maxLength(25),
        Validators.required,
      ])),
      conditionsCheck: new FormControl(null, Validators.required),
      confirm: new FormControl(null, Validators.compose([
        passwordValidator,
        Validators.minLength(8),
        Validators.maxLength(25),
        Validators.required,
      ])),
      // @ts-ignore
      }, {
        validators: [this.validatePasswords],
      })
  }

  private validatePasswords(group: FormGroup) {
    const password = group.controls.password.value;
    const confirm = group.controls.confirm.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/', 'session', 'login']);
  }

  register() {
    const { value } = this.form;
    this.store.dispatch(AuthActions.signupStart({ params: value }))
  }

  showErrorModal() {
    // const text = 'Check your information and try again';
    // const title = 'Registration Error';
    // this.alertService.error(text, title);
  }
}
