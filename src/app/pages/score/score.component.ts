import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ScoreService } from "../../services/score.service";
import { ActivityResults, Question, Round } from "../../models/quiz.model";
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

  constructor(private scoreService: ScoreService, private router: Router) {}
  ngOnInit() {
    this.scoreSubscription = this.scoreService
      .getUserAnswers()
      .subscribe((answers) => {
        if (!answers) {
          this.router.navigate(["/home"]);
        }
        this.activityResults = answers;
        this.smallHeader = this.activityResults?.activity_name;
        if (this.activityResults?.is_multi_round) {
          // Group questions by round
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
          );

          // Replace flat questions with structured rounds
          this.activityResults.rounds = groupedRounds;
        }
        if (this.activityResults) console.log(this.activityResults);
      });
  }

  openQuestionIndex: number | null = null;
  toggleFeedback(index: number) {
    console.log(index);
    this.openQuestionIndex = this.openQuestionIndex === index ? null : index;
  }
  openRoundIndex: number | null = null;
  toggleFeedbackByRound(roundIndex: number, questionIndex: number) {
    if (
      this.openRoundIndex === roundIndex &&
      this.openQuestionIndex === questionIndex
    ) {
      this.openRoundIndex = null;
      this.openQuestionIndex = null;
    } else {
      this.openRoundIndex = roundIndex;
      this.openQuestionIndex = questionIndex;
    }
  }

  ngOnDestroy() {
    this.scoreService.resetScoreService();
    this.scoreSubscription.unsubscribe(); // Prevent memory leaks
  }
}
