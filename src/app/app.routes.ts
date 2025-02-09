import { Routes } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { ActivityComponent } from './app/pages/activity/activity.component';
import { ScoreComponent } from './app/pages/score/score.component';
import { PageNotFoundComponent } from './app/pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'activity/:name',
    component: ActivityComponent,
  },
  {
    path: 'score',
    component: ScoreComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
];
