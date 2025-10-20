"use client";

import { QuizProgress } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionReview } from "@/components/QuestionReview";
import { QuizResults } from "@/components/QuizResults";
import { useQuizState } from "@/hooks/useQuizState";
import { GradeResult, QuizSubmission } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorStatus } from "./components/ErrorStatus";
import { LoadingStatus } from "./components/LoadingStatus";

export default function QuizApp() {
  const { state, actions, computed } = useQuizState();
  const [showReview, setShowReview] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const {
    data: quizzes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz`).then((res) =>
        res.json()
      ),
  });

  useEffect(() => {
    if (quizzes) {
      console.log(quizzes);
    }
  }, [quizzes]);
  // // Load quiz data on component mount
  // useEffect(() => {
  //   const loadQuiz = async () => {
  //     try {
  //       actions.setLoading();
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz`);
  //       if (!response.ok) {
  //         throw new Error("Failed to load quiz");
  //       }
  //       const quiz: Quiz = await response.json();
  //       actions.setQuiz(quiz);
  //     } catch (error) {
  //       actions.setError(
  //         error instanceof Error ? error.message : "Failed to load quiz"
  //       );
  //     }
  //   };

  //   loadQuiz();
  // }, [actions]);

  // Timer effect
  // useEffect(() => {
  //   if (state.status === "in-progress" && state.timeRemaining > 0) {
  //     const timer = setInterval(() => {
  //       const newTime = state.timeRemaining - 1;
  //       actions.updateTimer(newTime);

  //       if (newTime <= 0) {
  //         handleSubmitQuiz();
  //       }
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [state.status, state.timeRemaining, actions]);

  const handleStartQuiz = () => {
    setStartTime(Date.now());
    actions.startQuiz();
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    actions.setAnswer(questionId, value);
  };

  const handleSubmitQuiz = async () => {
    if (!state.quiz) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const submission: QuizSubmission = {
      quizId: state.quiz.id,
      answers: Object.values(state.answers),
      timeSpent,
    };

    try {
      actions.submitQuiz(submission);

      const response = await fetch("/api/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error("Failed to grade quiz");
      }

      const grade: GradeResult = await response.json();
      actions.setGrade(grade);
    } catch (error) {
      actions.setError(
        error instanceof Error ? error.message : "Failed to grade quiz"
      );
    }
  };

  const handleRetakeQuiz = () => {
    setShowReview(false);
    actions.resetQuiz();
    setStartTime(Date.now());
    actions.startQuiz();
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
              onClick={actions.prevQuestion}
              disabled={computed.isFirstQuestion}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {state.quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => actions.goToQuestion(index)}
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
                onClick={actions.nextQuestion}
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

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowReview(!showReview)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {showReview ? "Hide" : "Show"} Question Review
            </button>
          </div>

          {showReview && <QuestionReview grade={state.grade} />}
        </div>
      </div>
    );
  }

  return null;
}
