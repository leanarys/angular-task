import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Activity, Question, Quiz } from "../../interface/quiz.interface";
import { ActivityService } from "../../services/activity.service";
import { CommonModule } from "@angular/common";
import { BehaviorSubject } from "rxjs";
import { BoldAsteriskPipe } from "../../pipes/bold-asterisk.pipe";
import { ScoreService } from "../../services/score.service";

@Component({
  selector: "app-activity",
  standalone: true,
  imports: [CommonModule, BoldAsteriskPipe],
  templateUrl: "./activity.component.html",
  styleUrl: "./activity.component.css",
})
export class ActivityComponent {
  /** Selected activity from home */
  activityName = "";
  activityData?: Quiz;
  activity?: Activity;

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
    this.extractRouteParams();
    this.getActivityData();
    this.setRoundVisibility();
  }

  /** Resets the State */
  resetState(): void {
    this.userResponses = [];
    this.currentQuestionIndex = 0;
    this.currentRoundIndex = 0;
  }

  /** Extract parameters from the route */
  extractRouteParams(): void {
    this.route.params.subscribe((params) => {
      this.activityName = params["name"] || ""; // Extract activity name safely
    });
  }

  /**  Fetches the Activity Data */
  getActivityData(): void {
    this.activityService.getActivityData().subscribe((data) => {
      if (data) {
        this.activityData = data;
        this.setActivity();
      } else {
        this.activityService.fetchActivityData();
      }
    });
  }

  /**
   * Sets the visibility of the Round
   */
  setRoundVisibility(): void {
    this.watchRound.subscribe((value) => {
      this.showRoundCard = true; // Show the card
      setTimeout(() => {
        this.showRoundCard = false; // Hide after 3 seconds
      }, 1900);
    });
  }

  /**
   * Checks if the activity has multiple rounds.
   * Activity is considered to have multiple rounds if the first question object
   * contains either a "round_title" or a "questions" property.
   */
  get hasMultipleRounds(): boolean {
    return (
      // Check if "round_title" exists in the first question object
      "round_title" in (this.activity.questions[0] || {}) ||
      // Check if "questions" exists in the first question object
      "questions" in (this.activity.questions[0] || {})
    );
  }

  /** Sets the selected activity */
  // private
  setActivity() {
    this.activity = this.activityData?.activities
      // ?.sort((a, b) => a.order - b.order)
      ?.find((act) => act.activity_name === this.activityName);
    if (!this.activity) {
      this.router.navigate(["/page-not-found"]);
    }
  }

  /**
   * Records user's answer and moves to next question
   * @param isCorrect - Whether the user's answer is correct.
   * @param answeredQuestion - The question object being answered.
   */
  saveAnswer(isCorrect: boolean, answeredQuestion: Question) {
    /** Set user_answer from the question */
    answeredQuestion.user_answer = isCorrect;

    /** Prepare object to be passed on scores tally */
    this.userResponses.push(answeredQuestion);

    const hasNextQuestion =
      this.activity &&
      this.currentQuestionIndex < this.activity.questions.length - 1;

    if (hasNextQuestion) {
      this.currentQuestionIndex++;
    } else {
      /** Activity finished - reroute to score page */
      this.router.navigate(["/score"]);

      this.scoreService.setUserAnswers({
        activity_name: this.activity.activity_name,
        is_multi_round: false,
        questions: this.userResponses,
      });
    }
  }

  /**
   * Saves the user's answer for the current round.
   * Updates the `user_answer` property of the given question.
   * @param isCorrect - Indicates whether the user's answer is correct.
   * @param answeredQuestion - The question object being answered.
   */
  saveRoundAnswer(isCorrect: boolean, answeredQuestion: Question) {
    /** Set user_answer from the question */
    answeredQuestion.user_answer = isCorrect;
    answeredQuestion.round_title = `Round ${this.currentRoundIndex + 1}`;
    /** Prepare object to be passed on scores tally */
    this.userResponses.push(answeredQuestion);

    const currentRound = this.activity.questions[this.currentRoundIndex];
    const hasNextQuestion =
      this.currentQuestionIndex < currentRound.questions.length - 1;
    const hasNextRound =
      this.currentRoundIndex < this.activity.questions.length - 1;

    if (hasNextQuestion) {
      this.currentQuestionIndex++;
    } else if (hasNextRound) {
      this.currentRoundIndex++;
      this.currentQuestionIndex = 0; // Reset for next round

      /** Watch round changes and trigger card round display */
      this.watchRound.next(this.currentRoundIndex);
    } else {
      /** Activity finished - reroute to score page */
      this.router.navigate(["/score"]);

      this.scoreService.setUserAnswers({
        activity_name: this.activity.activity_name,
        is_multi_round: true,
        questions: this.userResponses,
      });
    }
  }
}
