import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestReviewComponent } from './request-review/request-review.component';

const routes: Routes = [
    {
        path: '',
        component: RequestReviewComponent,
    },
    {
        path: ':candidateId/:reviewId',
        component: RequestReviewComponent,
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'prefix',
    },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})

export class ExternalReviewRoutingModule {}