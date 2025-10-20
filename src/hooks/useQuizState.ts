import { GradeResult, Quiz, QuizSubmission } from "@/types/quiz";
import { useCallback, useState } from "react";

type QuizStatus = "loading" | "ready" | "in-progress" | "completed" | "error";

export function useQuizState() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [status, setStatus] = useState<QuizStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, { questionId: string; value: string | string[] }>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [grade, setGrade] = useState<GradeResult | null>(null);

  const currentQuestion = quiz?.questions[currentIndex] ?? null;
  const totalQuestions = quiz?.questions.length ?? 0;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === Math.max(0, totalQuestions - 1);
  const progress = totalQuestions ? (currentIndex + 1) / totalQuestions : 0;
  const answeredQuestions = Object.keys(answers).length;

  const loadQuiz = useCallback((q: Quiz) => {
    setQuiz(q);
    setTimeRemaining(q.timeLimit ?? 0);
    setStatus("ready");
    setError(null);
    setCurrentIndex(0);
    setAnswers({});
    setSubmission(null);
    setGrade(null);
  }, []);

  const answer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { questionId, value } }));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) =>
      Math.min(i + 1, Math.max(0, (quiz?.questions.length ?? 1) - 1))
    );
  }, [quiz]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const go = useCallback(
    (i: number) => {
      const max = Math.max(0, (quiz?.questions.length ?? 1) - 1);
      setCurrentIndex(Math.max(0, Math.min(i, max)));
    },
    [quiz]
  );

  const start = useCallback(() => setStatus("in-progress"), []);
  const submit = useCallback((s: QuizSubmission) => {
    setSubmission(s);
    setStatus("completed");
  }, []);
  const reset = useCallback(() => {
    setStatus("ready");
    setError(null);
    setCurrentIndex(0);
    setAnswers({});
    setSubmission(null);
    setGrade(null);
    setTimeRemaining(quiz?.timeLimit ?? 0);
  }, [quiz]);

  return {
    state: {
      quiz,
      currentQuestionIndex: currentIndex,
      answers,
      timeRemaining,
      status,
      error,
      submission,
      grade,
    },
    actions: {
      loadQuiz,
      start,
      answer,
      next,
      prev,
      go,
      submit,
      reset,
      setGrade,
      setTimeRemaining,
      setError,
    },
    computed: {
      currentQuestion,
      isFirstQuestion,
      isLastQuestion,
      progress,
      answeredQuestions,
      totalQuestions,
    },
  };
}
