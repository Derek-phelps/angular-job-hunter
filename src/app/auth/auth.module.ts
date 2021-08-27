import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '@material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthComponent } from './auth/auth.component';

const routes = [
  {
   path: '',
   component: AuthComponent,
  },
  // {
  //   path: 'signup',
  //   component: SignupComponent,
  // },
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    AuthComponent,
  ],
})
export class AuthModule {}
