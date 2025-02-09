export interface Quiz {
  name: string;
  heading: string;
  activities: Activity[];
}

export interface Round {
  round_title: string;
  order: number;
  questions: Question[];
}

export interface Activity {
  activity_name: string;
  order: number;
  questions?: Question[];
}

export interface Question {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answer: boolean;
  user_answers: boolean[];
  feedback: string;

  round_title?: string;
  questions?: Question[];
}

export interface ActivityResults {
  activity_name: string;
  is_multi_round: boolean;
  questions?: Question[];
  rounds?: Round[];
}
