import { useReducer, useCallback } from 'react';
import { QuizState, Quiz, Answer, QuizSubmission, GradeResult } from '@/types/quiz';

export type QuizAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_QUIZ'; payload: Quiz }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_ANSWER'; payload: { questionId: string; value: string | string[] } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'GO_TO_QUESTION'; payload: number }
  | { type: 'START_QUIZ' }
  | { type: 'SUBMIT_QUIZ'; payload: QuizSubmission }
  | { type: 'SET_GRADE'; payload: GradeResult }
  | { type: 'RESET_QUIZ' }
  | { type: 'UPDATE_TIMER'; payload: number };

const initialState: QuizState = {
  quiz: null,
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 0,
  status: 'loading',
  error: null,
  submission: null,
  grade: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'SET_QUIZ':
      return {
        ...state,
        quiz: action.payload,
        timeRemaining: action.payload.timeLimit || 0,
        status: 'ready',
        error: null,
        currentQuestionIndex: 0,
        answers: {},
      };

    case 'SET_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: {
            questionId: action.payload.questionId,
            value: action.payload.value,
          },
        },
      };

    case 'NEXT_QUESTION':
      if (!state.quiz) return state;
      const nextIndex = Math.min(
        state.currentQuestionIndex + 1,
        state.quiz.questions.length - 1
      );
      return {
        ...state,
        currentQuestionIndex: nextIndex,
      };

    case 'PREV_QUESTION':
      const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
      return {
        ...state,
        currentQuestionIndex: prevIndex,
      };

    case 'GO_TO_QUESTION':
      if (!state.quiz) return state;
      const targetIndex = Math.max(
        0,
        Math.min(action.payload, state.quiz.questions.length - 1)
      );
      return {
        ...state,
        currentQuestionIndex: targetIndex,
      };

    case 'START_QUIZ':
      return {
        ...state,
        status: 'in-progress',
      };

    case 'SUBMIT_QUIZ':
      return {
        ...state,
        submission: action.payload,
        status: 'completed',
      };

    case 'SET_GRADE':
      return {
        ...state,
        grade: action.payload,
      };

    case 'RESET_QUIZ':
      return {
        ...initialState,
        quiz: state.quiz, // Keep the quiz data
        timeRemaining: state.quiz?.timeLimit || 0,
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timeRemaining: Math.max(0, action.payload),
      };

    default:
      return state;
  }
}

export function useQuizState() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const setLoading = useCallback(() => {
    dispatch({ type: 'SET_LOADING' });
  }, []);

  const setQuiz = useCallback((quiz: Quiz) => {
    dispatch({ type: 'SET_QUIZ', payload: quiz });
  }, []);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { questionId, value } });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    dispatch({ type: 'GO_TO_QUESTION', payload: index });
  }, []);

  const startQuiz = useCallback(() => {
    dispatch({ type: 'START_QUIZ' });
  }, []);

  const submitQuiz = useCallback((submission: QuizSubmission) => {
    dispatch({ type: 'SUBMIT_QUIZ', payload: submission });
  }, []);

  const setGrade = useCallback((grade: GradeResult) => {
    dispatch({ type: 'SET_GRADE', payload: grade });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, []);

  const updateTimer = useCallback((timeRemaining: number) => {
    dispatch({ type: 'UPDATE_TIMER', payload: timeRemaining });
  }, []);

  // Computed values
  const currentQuestion = state.quiz?.questions[state.currentQuestionIndex] || null;
  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === (state.quiz?.questions.length || 1) - 1;
  const progress = state.quiz ? (state.currentQuestionIndex + 1) / state.quiz.questions.length : 0;
  const answeredQuestions = Object.keys(state.answers).length;
  const totalQuestions = state.quiz?.questions.length || 0;

  return {
    state,
    actions: {
      setLoading,
      setQuiz,
      setError,
      setAnswer,
      nextQuestion,
      prevQuestion,
      goToQuestion,
      startQuiz,
      submitQuiz,
      setGrade,
      resetQuiz,
      updateTimer,
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
