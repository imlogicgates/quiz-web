"use client";

import { QuizProgress } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { QuizResults } from "@/components/QuizResults";
import { useQuizState } from "@/hooks/useQuizState";
import { GradeResult, Question, Quiz } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorStatus } from "./components/ErrorStatus";
import { LoadingStatus } from "./components/LoadingStatus";
import { mapAnswersToBackend } from "./utils";

export default function QuizApp() {
  const { state, actions, computed } = useQuizState();
  const [startTime, setStartTime] = useState<number>(0);

  const { data: quizzes, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ["quiz"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz`).then((res) =>
        res.json()
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (
      !isLoadingQuiz &&
      !state.quiz &&
      Array.isArray(quizzes) &&
      quizzes.length > 0
    ) {
      const mappedQuiz: Quiz = {
        id: "remote",
        title: "General Knowledge Quiz",
        description: "Answer the questions below.",
        questions: (
          quizzes as Array<{
            id: number | string;
            type: "text" | "checkbox" | "radio";
            question: string;
            choices?: string[];
          }>
        ).map((q) => {
          const mappedQuestion: Question = {
            id: String(q.id),
            type: q.type,
            question: q.question,
            options: q.choices ?? [],
            correctAnswer: "",
          };
          return mappedQuestion;
        }),
      };

      actions.loadQuiz(mappedQuiz);
    }
  }, [quizzes, isLoadingQuiz, state.quiz, actions.loadQuiz]);

  const handleStartQuiz = () => {
    setStartTime(Date.now());
    actions.start();
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    actions.answer(questionId, value);
  };

  const handleSubmitQuiz = async () => {
    if (!state.quiz) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const answersForBackend = mapAnswersToBackend(
      state.quiz.questions,
      state.answers
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/grade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: answersForBackend }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to grade quiz");
      }

      const serverGrade: {
        score: number;
        total: number;
        results: Array<{ id: string | number; correct: boolean }>;
      } = await response.json();

      const totalQuestions = serverGrade.total;
      const correctAnswers = serverGrade.score;
      const incorrectAnswers = totalQuestions - correctAnswers;
      const unanswered = 0;
      const percentage = Math.round(
        (correctAnswers / Math.max(1, totalQuestions)) * 100
      );

      const details = state.quiz.questions.map((q) => {
        const userAnswer =
          state.answers[q.id]?.value ?? (q.type === "checkbox" ? [] : "");
        const result = serverGrade.results.find(
          (r) => String(r.id) === String(q.id)
        );
        return {
          questionId: String(q.id),
          correct: result ? result.correct : false,
          userAnswer,
          correctAnswer: q.type === "checkbox" ? [] : "",
          explanation: undefined,
        };
      });

      const grade: GradeResult = {
        score: correctAnswers,
        totalQuestions,
        percentage,
        correctAnswers,
        incorrectAnswers,
        unanswered,
        timeSpent,
        details,
      };

      // Mark as submitted/completed and store grade
      actions.submit({
        quizId: state.quiz.id,
        answers: Object.values(state.answers),
        timeSpent,
      });
      actions.setGrade(grade);
    } catch (error) {
      actions.setError(
        error instanceof Error ? error.message : "Failed to grade quiz"
      );
    }
  };

  const handleRetakeQuiz = () => {
    actions.reset();
    setStartTime(Date.now());
    actions.start();
  };

  if (state.status === "loading") {
    return <LoadingStatus />;
  }

  if (state.status === "error") {
    return <ErrorStatus error={state.error || ""} />;
  }

  // Quiz ready state
  if (state.status === "ready" && state.quiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {state.quiz.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {state.quiz.description}
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Quiz Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Questions:</span>{" "}
                  {state.quiz.questions.length}
                </div>
                <div>
                  <span className="font-medium">Time Limit:</span>{" "}
                  {state.quiz.timeLimit
                    ? `${Math.floor(state.quiz.timeLimit / 60)} minutes`
                    : "No limit"}
                </div>
                <div>
                  <span className="font-medium">Question Types:</span> Text,
                  Radio, Checkbox
                </div>
              </div>
            </div>
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  if (
    state.status === "in-progress" &&
    state.quiz &&
    computed.currentQuestion
  ) {
    const currentAnswer =
      state.answers[computed.currentQuestion.id]?.value || "";

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <QuizProgress
            currentQuestion={state.currentQuestionIndex}
            totalQuestions={state.quiz.questions.length}
            answeredQuestions={computed.answeredQuestions}
            timeRemaining={state.timeRemaining}
          />

          <QuestionCard
            question={computed.currentQuestion}
            questionNumber={state.currentQuestionIndex + 1}
            totalQuestions={state.quiz.questions.length}
            value={currentAnswer}
            onChange={(value) =>
              handleAnswerChange(computed.currentQuestion!.id, value)
            }
          />

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={actions.prev}
              disabled={computed.isFirstQuestion}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {state.quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => actions.go(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    index === state.currentQuestionIndex
                      ? "bg-blue-600 text-white"
                      : state.answers[state.quiz!.questions[index].id]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {computed.isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={actions.next}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed
  if (state.status === "completed" && state.grade) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <QuizResults grade={state.grade} onRetake={handleRetakeQuiz} />
        </div>
      </div>
    );
  }

  return null;
}
