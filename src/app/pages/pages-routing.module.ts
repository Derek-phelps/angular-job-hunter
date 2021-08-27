import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AvailabilityComponent } from './create-profile/availability/availability.component';
import { GeneralInfoComponent } from './create-profile/general-info/general-info.component';
import { HistoryComponent } from './create-profile/history/history.component';
import { SkillsExpertiseComponent } from './create-profile/skills-expertise/skills-expertise.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobPostingComponent } from './job-posting/job-posting.component';
import { MessagesComponent } from './messages/messages.component';
import { ConversationsComponent } from './messages/conversations/conversations.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ProfileComponent } from './profile/profile.component';
import { OffersComponent } from './messages/offers/offers.component';

const routes: Routes = [
    {
        path: 'create-profile',
        component: CreateProfileComponent,
        children: [
            {
                path: 'availability',
                component: AvailabilityComponent,
            },
            {
                path: 'general-info',
                component: GeneralInfoComponent,
            },
            {
                path: 'history',
                component: HistoryComponent,
            },
            {
                path: 'skills-expertise',
                component: SkillsExpertiseComponent,
            },
            {
                path: '',
                redirectTo: 'general-info',
                pathMatch: 'prefix',
            },
            {
                path: '**',
                redirectTo: 'create-profile/general-info',
                pathMatch: 'prefix',
            },
        ],
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'job-posting',
        component: JobPostingComponent,
    },
    {
        path: 'job-posting/:id',
        component: JobPostingComponent,
    },
    {
        path: 'messages',
        component: MessagesComponent,
        children: [
          {
            path: 'conversation',
            component: ConversationsComponent,
          },
          {
            path: 'conversation/:id',
            component: ConversationsComponent,
          },
          {
            path: 'offers',
            component: OffersComponent,
          },
          {
            path: 'offers/:id',
            component: OffersComponent,
          },
          {
            path: '**',
            redirectTo: 'conversation',
            pathMatch: 'prefix',
          },
        ],
    },
    {
        path: 'profile',
        component: ProfileComponent,
    },
    {
    path: 'reviews',
    component: ReviewsComponent,
    },
    {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'prefix',
    },
]

@NgModule({
    imports: [
      RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})

export class PagesRoutingModule {}