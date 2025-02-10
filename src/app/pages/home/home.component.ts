import { Component } from "@angular/core";
import { Activity, Question, Quiz } from "../../models/quiz.model";
import { CommonModule, NgFor } from "@angular/common";
import { Router } from "@angular/router";
import { ActivityService } from "../../services/activity.service";
import { DisplayCardComponent } from "../../components/display-card/display-card.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, NgFor, DisplayCardComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  smallHeader = "CAE";
  footer = "RESULTS";
  activityData?: Quiz;
  score: number = 0;
  sortedActivities?: Activity[];

  constructor(
    private router: Router,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    /** Fetch activity payload data */
    this.activityService.getActivityData().subscribe((data) => {
      if (data) {
        this.activityData = data;
      } else {
        // Fetch if data was lost
        this.activityService.fetchActivityData();
      }
    });
  }

  navigateToActivity(activity: Activity) {
    this.router.navigate([`/activity/${activity.activity_name}`]);
  }
}
