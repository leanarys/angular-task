import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivityResults } from "../interface/quiz.interface";

@Injectable({
  providedIn: "root", // Makes it available app-wide
})
export class ScoreService {
  private userAnswersSubject = new BehaviorSubject<ActivityResults | null>(
    null
  );

  /** Set or update user answers */
  setUserAnswers(answers: ActivityResults): void {
    this.userAnswersSubject.next(answers);
  }

  /** Get stored data as Observable */
  getUserAnswers(): Observable<ActivityResults | null> {
    return this.userAnswersSubject.asObservable();
  }

  /** Reset stored answers */
  resetScoreService(): void {
    this.userAnswersSubject.next(null);
  }
}
