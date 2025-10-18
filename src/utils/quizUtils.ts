import { Question, QuizSubmission, GradeResult } from '../types/quiz';

// Normalize text answers for comparison
export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Check if two arrays contain the same elements (order independent)
export function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
}

// Grade a single question
export function gradeQuestion(question: Question, userAnswer: string | string[]): {
  correct: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
} {
  const isCorrect = (() => {
    if (question.type === 'text') {
      const correctAnswer = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer[0] 
        : question.correctAnswer;
      return normalizeText(userAnswer as string) === normalizeText(correctAnswer);
    }
    
    if (question.type === 'radio') {
      return userAnswer === question.correctAnswer;
    }
    
    if (question.type === 'checkbox') {
      const correctAnswers = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer];
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      return arraysEqual(userAnswers, correctAnswers);
    }
    
    return false;
  })();

  return {
    correct: isCorrect,
    userAnswer,
    correctAnswer: question.correctAnswer,
  };
}

// Validate submission data
export function validateSubmission(submission: QuizSubmission): string | null {
  if (!submission.quizId) {
    return 'Quiz ID is required';
  }
  
  if (!submission.answers || !Array.isArray(submission.answers)) {
    return 'Answers array is required';
  }
  
  if (typeof submission.timeSpent !== 'number' || submission.timeSpent < 0) {
    return 'Valid time spent is required';
  }
  
  // Check for duplicate question IDs
  const questionIds = submission.answers.map(answer => answer.questionId);
  const uniqueIds = new Set(questionIds);
  if (questionIds.length !== uniqueIds.size) {
    return 'Duplicate question IDs found in answers';
  }
  
  return null;
}

// Deterministic shuffle function using Fisher-Yates algorithm with seed
export function deterministicShuffle<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  let hash = 0;
  
  // Simple hash function for the seed
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use hash as seed for Math.random
  let currentIndex = shuffled.length;
  let randomIndex: number;
  
  while (currentIndex > 0) {
    // Generate pseudo-random number using the hash
    hash = (hash * 1664525 + 1013904223) % 2147483647;
    randomIndex = Math.floor((hash / 2147483647) * currentIndex);
    currentIndex--;
    
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex], shuffled[currentIndex]
    ];
  }
  
  return shuffled;
}
