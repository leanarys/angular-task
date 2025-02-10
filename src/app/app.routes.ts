import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ActivityComponent } from "./pages/activity/activity.component";
import { ScoreComponent } from "./pages/score/score.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "activity/:name",
    component: ActivityComponent,
  },
  {
    path: "score",
    component: ScoreComponent,
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
  {
    path: "page-not-found",
    component: PageNotFoundComponent,
  },
];
