import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quiz } from '../models/quiz.model';

@Injectable({
  providedIn: 'root', // Makes it available app-wide
})
export class ActivityService {
  private activity = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Fetch from API only if not already loaded
  fetchActivityData(): void {
    if (!this.activity.value) {
      // 'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json'
      this.http.get<Quiz>('../../assets/payload.json').subscribe((data) => {
        if (data?.activities) {
          data.activities = data.activities.sort((a, b) => a.order - b.order);
        }
        this.activity.next(data);
      });
    }
  }

  // Get stored data
  getActivityData(): Observable<Quiz | null> {
    return this.activity.asObservable();
  }
}
