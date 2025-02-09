import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Activity,
  ActivityResults,
  Question,
  Quiz,
} from '../../../models/quiz.model';
import { ActivityService } from '../../../services/activity.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { BoldAsteriskPipe } from '../../../pipes/bold-asterisk.pipe';
import { ScoreService } from '../../../services/score.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, BoldAsteriskPipe],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
})
export class ActivityComponent {
  /** Selected activity from home */
  activityName = '';
  activityData?: Quiz;
  activity?: Activity; // Allow undefined initially

  /** Start of quiz */
  userResponses: Question[] = [];
  currentQuestionIndex = 0;
  currentRoundIndex = 0;

  /** Shows a card slide */
  watchRound: any = new BehaviorSubject(0);
  showRoundCard: boolean = false;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private activityService: ActivityService,
    private scoreService: ScoreService
  ) {}

  ngOnInit() {
    this.resetState();
    this.route.params.subscribe((params) => {
      this.activityName = params['name'] || ''; // Extract activity name safely
    });

    this.activityService.getActivityData().subscribe((data) => {
      if (data) {
        this.activityData = data;
        this.setActivity();
      } else {
        this.activityService.fetchActivityData();
      }
    });

    this.watchRound.subscribe((value) => {
      this.showRoundCard = true; // Show the card
      setTimeout(() => {
        this.showRoundCard = false; // Hide after 3 seconds
      }, 1900);
    });
  }

  get hasMultipleRounds(): boolean {
    return (
      'round_title' in (this.activity.questions[0] || {}) ||
      'questions' in (this.activity.questions[0] || {})
    );
  }

  /** Sets the selected activity */
  private setActivity() {
    this.activity = this.activityData?.activities
      ?.sort((a, b) => a.order - b.order)
      ?.find((act) => act.activity_name === this.activityName);
    if (!this.activity) {
      this.router.navigate(['/page-not-found']);
    }
  }

  /** Records user's answer and moves to next question */
  saveAnswer(isCorrect: boolean, answeredQuestion: Question) {
    /** Set user_answer from the question */
    answeredQuestion.user_answer = isCorrect;

    /** Prepare object to be passed on scores tally */
    this.userResponses.push(answeredQuestion);

    if (
      this.currentQuestionIndex <
      (this.activity?.questions?.length ?? 0) - 1
    ) {
      this.currentQuestionIndex++;
    } else {
      /** Activity finished - reroute to score page - scoreService*/
      this.router.navigate(['/score']);
      this.scoreService.setUserAnswers({
        activity_name: this.activity.activity_name,
        is_multi_round: false,
        questions: this.userResponses,
      });
      console.log('User Responses:', this.scoreService.getUserAnswers());
    }
  }

  saveRoundAnswer(isCorrect: boolean, answeredQuestion: Question) {
    /** Set user_answer from the question */
    answeredQuestion.user_answer = isCorrect;
    answeredQuestion.round_title = `Round ${this.currentRoundIndex + 1}`;
    /** Prepare object to be passed on scores tally */
    this.userResponses.push(answeredQuestion);

    const currentRound = this.activity.questions[this.currentRoundIndex];

    if (this.currentQuestionIndex < currentRound.questions.length - 1) {
      this.currentQuestionIndex++;
    } else if (this.currentRoundIndex < this.activity.questions.length - 1) {
      this.currentRoundIndex++;
      this.currentQuestionIndex = 0; // Reset for next round

      /** Watch round changes and trigger card round display */
      this.watchRound.next(this.currentRoundIndex);
    } else {
      /** Activity finished - reroute to score page - scoreService*/
      this.router.navigate(['/score']);
      this.scoreService.setUserAnswers({
        activity_name: this.activity.activity_name,
        is_multi_round: true,
        questions: this.userResponses,
      });
      console.log('User Responses:', this.scoreService.getUserAnswers());
    }
  }

  resetState() {
    this.userResponses = [];
    this.currentQuestionIndex = 0;
    this.currentRoundIndex = 0;
  }
}
