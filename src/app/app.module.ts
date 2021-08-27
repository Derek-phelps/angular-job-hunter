import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { MaterialModule } from '@material';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { UiModule } from '@hellotemp/ui'
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { InterviewsEffects } from './store/interviews/interviews.effects';
import { AuthEffects } from './auth/store/auth.effects';
import { EngagementsEffects } from './store/engagements/engagements.effects';
import { RestModule } from '@hellotemp/rest';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { DefinitionsEffects } from './store/definitions/definitions.effects';
import { OpportunitiesEffects } from './store/opportunities/opportunities.effects';
import { CandidatesEffects } from './store/candidates/candidates.effects';
import { ReviewsEffects } from './store/reviews/reviews.effects';
import { ExternalReviewModule } from './external-review/external-review.module';
import { ExternalReviewEffects } from './external-review/store/external-review.effects';
import { CoreModule } from '@hellotemp/core'
import * as Sentry from "@sentry/browser";
import { NgxMaskModule } from 'ngx-mask';

// Sentry.init({
//   dsn: "https://2ddb40368a0c4a918166faadac010595@sentry.io/2984034",
//   environment: environment.name,
// });

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error: any) {
    const eventId = Sentry.captureException(error.originalError || error);
    // Sentry.showReportDialog({ eventId });
  }
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UiModule,
    HttpClientModule,
    PagesModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreDevtoolsModule.instrument({ maxAge: 50, logOnly: environment.production }),
    EffectsModule.forRoot([
      AuthEffects,
      InterviewsEffects,
      EngagementsEffects,
      DefinitionsEffects,
      OpportunitiesEffects,
      CandidatesEffects,
      ReviewsEffects,
      ExternalReviewEffects,
    ]),
    RestModule.forRoot({ rootUrl: environment.apiUrl }),
    ExternalReviewModule,
    CoreModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    HttpClient,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
