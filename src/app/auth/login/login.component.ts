import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth.actions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// tslint:disable:nx-enforce-module-boundaries
import { LoadingModalComponent } from 'libs/ui/src/lib/loading-modal/loading-modal.component';
import { ErrorModalComponent } from 'libs/ui/src/lib/error-modal/error-modal.component';
import { ForgotPasswordComponent } from 'libs/ui/src/lib/forgot-password/forgot-password.component';
// import { AuthService } from '..//auth.service';
// tslint:enable:nx-enforce-module-boundaries


@Component({
  selector: 'hellotemp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public form: FormGroup;
  private authState$: Observable<any> = this.store.select(state => state.auth);
  private token: string | null = null;
  private errorShown = false;
  constructor(
    private router: Router,
    private store: Store<any>,
    public dialog: MatDialog,
  ) {
    this.form = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required),
    });
    this.authState$
    .pipe(
      takeUntil(this.destroy$),
    ).subscribe(auth => {
      this.token = auth.token;
      if (this.token) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  forgotPassword() {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '525px',
    })
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(AuthActions.forgotPassword({ email: val.email }));
      }
    })
  }

  signIn() {
    this.errorShown = false;
    const { value } = this.form;
    this.store.dispatch(AuthActions.loginStart({}));
    const dialogRef = this.dialog.open(LoadingModalComponent, {
      width: '350px',
      data: {
        title: 'Logging in...',
      },
    });
    this.authState$.pipe(takeUntil(this.destroy$)).subscribe(auth => {
      if (!auth.isLoggingIn) {
        dialogRef.close();
        if (auth.loginError && !this.errorShown) {
          this.errorShown = true;
          this.dialog.open(ErrorModalComponent, {
            width: '350px',
            data: {
              title: 'Error Logging In',
              message: 'Check your email and password and try again',
            },
          });
        }
      }

    })
  }

  signup() {
    this.router.navigate(['/', 'session', 'signup']);
  }

  showErrorModal() {
    const text = 'Check your information and try again';
    const title = 'Login Error';
    // this.alertService.error(text, title);
  }
}
