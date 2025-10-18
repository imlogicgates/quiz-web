export interface Question {
  id: string;
  type: 'text' | 'radio' | 'checkbox';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in seconds
}

export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface QuizSubmission {
  quizId: string;
  answers: Answer[];
  timeSpent: number; // in seconds
}

export interface GradeResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeSpent: number;
  details: QuestionGrade[];
}

export interface QuestionGrade {
  questionId: string;
  correct: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface QuizState {
  quiz: Quiz | null;
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  timeRemaining: number;
  status: 'loading' | 'ready' | 'in-progress' | 'completed' | 'error';
  error: string | null;
  submission: QuizSubmission | null;
  grade: GradeResult | null;
}
