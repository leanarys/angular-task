import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Quiz } from "../interface/quiz.interface";
import { tap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root", // Makes it available app-wide
})
export class ActivityService {
  private activity = new BehaviorSubject<Quiz | null>(null);
  private readonly apiUrl =
    "https://leanarys-bucket.s3.us-east-1.amazonaws.com/mock-data/error-find-payload.json";

  constructor(private http: HttpClient) {}

  /** Fetch from API only if not already loaded */
  fetchActivityData(): void {
    if (!this.activity.getValue()) {
      this.http
        .get<Quiz>(this.apiUrl)
        .pipe(
          tap((data) => {
            if (data?.activities) {
              data.activities = [...data.activities].sort(
                (a, b) => a.order - b.order
              );
            }
            this.activity.next(data);
          }),
          catchError((error) => {
            console.error("Failed to fetch activity data:", error);
            return []; // Returns an empty array as a fallback
          })
        )
        .subscribe();
    }
  }

  /**
   * Get stored data as Observable
   * @returns observable
   */
  getActivityData(): Observable<Quiz | null> {
    return this.activity.asObservable();
  }
}
