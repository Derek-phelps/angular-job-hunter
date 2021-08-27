import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AvailabilityComponent } from './create-profile/availability/availability.component';
import { GeneralInfoComponent } from './create-profile/general-info/general-info.component';
import { HistoryComponent } from './create-profile/history/history.component';
import { SkillsExpertiseComponent } from './create-profile/skills-expertise/skills-expertise.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { MessagesComponent } from './messages/messages.component';
import { ConversationsComponent } from './messages/conversations/conversations.component';
import { OffersComponent } from './messages/offers/offers.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { PagesComponent } from './pages.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiModule } from '@hellotemp/ui';
import { MaterialModule } from '@material';
import {PagesRoutingModule} from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    CreateProfileComponent,
    AvailabilityComponent,
    GeneralInfoComponent,
    HistoryComponent,
    SkillsExpertiseComponent,
    DashboardComponent,
    JobPostingComponent,
    MessagesComponent,
    ConversationsComponent,
    OffersComponent,
    ProfileComponent,
    ReviewsComponent,
    PagesComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    FlexLayoutModule,
    UiModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    DigitOnlyModule,
    NgxMaskModule,
  ],
})
export class PagesModule { }
