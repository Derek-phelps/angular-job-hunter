import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'session',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'external-reviewer',
    loadChildren: () => import('./external-review/external-review.module').then(m => m.ExternalReviewModule),
  },
  {
    path: '',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [ AuthGuard ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule],
})

export class AppRoutingModule { }
