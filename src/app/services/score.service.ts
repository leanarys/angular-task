import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivityResults } from "../interface/quiz.interface";

@Injectable({
  providedIn: "root", // Makes it available app-wide
})
export class ScoreService {
  private activity = new BehaviorSubject<any>(null);

  // Fetch from API only if not already loaded
  setUserAnswers(answers: ActivityResults): void {
    if (!this.activity.value) {
      this.activity.next(answers);
    }
  }

  // Get stored data
  getUserAnswers(): Observable<ActivityResults | null> {
    return this.activity.asObservable();
  }

  // Reset
  resetScoreService() {
    this.activity = new BehaviorSubject<any>(null);
  }
}
