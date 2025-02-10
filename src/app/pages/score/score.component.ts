import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ScoreService } from "../../services/score.service";
import { ActivityResults, Round } from "../../interface/quiz.interface";
import { Subscription } from "rxjs";
import { DisplayCardComponent } from "../../components/display-card/display-card.component";
import { Router } from "@angular/router";
import { BoldAsteriskPipe } from "../../pipes/bold-asterisk.pipe";

@Component({
  selector: "app-score",
  standalone: true,
  imports: [CommonModule, DisplayCardComponent, BoldAsteriskPipe],
  templateUrl: "./score.component.html",
  styleUrl: "./score.component.css",
})
export class ScoreComponent {
  smallHeader: string = "";
  mainHeader = "RESULTS";
  footer = "HOME";
  activityResults: ActivityResults;
  scoreSubscription!: Subscription;
  openQuestionIndex: number | null = null;
  openRoundIndex: number | null = null;

  constructor(private scoreService: ScoreService, private router: Router) {}

  ngOnInit() {
    this.getActivityResults();
  }

  /**  Fetches the Activity Results */
  getActivityResults(): void {
    this.scoreSubscription = this.scoreService
      .getUserAnswers()
      .subscribe((answers) => {
        if (!answers) {
          this.router.navigate(["/"]); // Redirect if no answers are available
        }

        // Store retrieved answers and update headers
        this.activityResults = answers;
        this.smallHeader = this.activityResults?.activity_name;

        // Check if the activity consists of multiple rounds
        if (this.activityResults?.is_multi_round) {
          // Group questions by round title
          const groupedRounds = Object.values(
            this.activityResults.questions.reduce((acc, question) => {
              const roundKey = question.round_title || "Unspecified Round";

              if (!acc[roundKey]) {
                acc[roundKey] = {
                  round_title: roundKey,
                  order: question.order,
                  questions: [],
                };
              }

              acc[roundKey].questions.push(question);
              return acc;
            }, {} as Record<string, Round>)
          ).sort((a, b) => a.order - b.order); // Ensure rounds are ordered correctly

          // Replace flat questions array with structured rounds
          this.activityResults.rounds = groupedRounds;
        }
      });
  }

  /**
   * Toggles the visibility of feedback for a specific item.
   * @param index - The index of the item whose feedback visibility should be toggled.
   */
  toggleFeedback(index: number) {
    this.openQuestionIndex = this.openQuestionIndex === index ? null : index;
  }

  /**
   * Toggles feedback visibility for a specific question within a round.
   * @param roundIndex - The index of the round.
   * @param questionIndex - The index of the question within the round.
   */
  toggleFeedbackByRound(roundIndex: number, questionIndex: number): void {
    const isSameSelection =
      this.openRoundIndex === roundIndex &&
      this.openQuestionIndex === questionIndex;

    this.openRoundIndex = isSameSelection ? null : roundIndex;
    this.openQuestionIndex = isSameSelection ? null : questionIndex;
  }

  /**
   * Resets the Score Service and unsunscribes to the subscription
   */
  ngOnDestroy() {
    this.scoreService.resetScoreService();
    this.scoreSubscription.unsubscribe(); // Prevent memory leaks
  }
}
