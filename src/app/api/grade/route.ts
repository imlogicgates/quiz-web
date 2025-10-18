import { NextRequest, NextResponse } from 'next/server';
import { QuizSubmission, GradeResult, QuestionGrade, Quiz, Question } from '@/types/quiz';

// Mock quiz data (same as in quiz route for consistency)
const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'text',
    question: 'What is the capital of France?',
    correctAnswer: 'Paris',
    explanation: 'Paris has been the capital of France since the 6th century.'
  },
  {
    id: 'q2',
    type: 'radio',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctAnswer: 'Mercury',
    explanation: 'Mercury is the closest planet to the Sun in our solar system.'
  },
  {
    id: 'q3',
    type: 'checkbox',
    question: 'Which of the following are programming languages?',
    options: ['JavaScript', 'HTML', 'Python', 'CSS', 'TypeScript'],
    correctAnswer: ['JavaScript', 'Python', 'TypeScript'],
    explanation: 'JavaScript, Python, and TypeScript are programming languages. HTML and CSS are markup and styling languages respectively.'
  },
  {
    id: 'q4',
    type: 'text',
    question: 'What does API stand for?',
    correctAnswer: 'Application Programming Interface',
    explanation: 'API stands for Application Programming Interface, which allows different software applications to communicate with each other.'
  },
  {
    id: 'q5',
    type: 'radio',
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 'Blue Whale',
    explanation: 'The blue whale is the largest mammal and the largest animal ever known to have lived on Earth.'
  },
  {
    id: 'q6',
    type: 'checkbox',
    question: 'Which of the following are React hooks?',
    options: ['useState', 'useEffect', 'useRouter', 'useCallback', 'useMemo'],
    correctAnswer: ['useState', 'useEffect', 'useCallback', 'useMemo'],
    explanation: 'useState, useEffect, useCallback, and useMemo are all React hooks. useRouter is a Next.js hook, not a React hook.'
  },
  {
    id: 'q7',
    type: 'text',
    question: 'What is the time complexity of binary search?',
    correctAnswer: 'O(log n)',
    explanation: 'Binary search has a time complexity of O(log n) because it eliminates half of the search space with each comparison.'
  },
  {
    id: 'q8',
    type: 'radio',
    question: 'Which HTTP method is typically used for creating new resources?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswer: 'POST',
    explanation: 'POST is typically used for creating new resources, while PUT is used for updating existing resources.'
  }
];

// Normalize text answers for comparison
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Check if two arrays contain the same elements (order independent)
function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
}

// Grade a single question
function gradeQuestion(question: Question, userAnswer: string | string[]): QuestionGrade {
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
    questionId: question.id,
    correct: isCorrect,
    userAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
}

// Validate submission data
function validateSubmission(submission: QuizSubmission): string | null {
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

export async function POST(request: NextRequest) {
  try {
    const submission: QuizSubmission = await request.json();
    
    // Validate submission
    const validationError = validateSubmission(submission);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    // Create a map of questions for quick lookup
    const questionMap = new Map(mockQuestions.map(q => [q.id, q]));
    
    // Grade each answer
    const questionGrades: QuestionGrade[] = [];
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    
    // Check all questions in the quiz
    for (const question of mockQuestions) {
      const userAnswer = submission.answers.find(a => a.questionId === question.id);
      
      if (!userAnswer || !userAnswer.value) {
        // Question was not answered
        unansweredCount++;
        questionGrades.push({
          questionId: question.id,
          correct: false,
          userAnswer: '',
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        });
      } else {
        const grade = gradeQuestion(question, userAnswer.value);
        questionGrades.push(grade);
        
        if (grade.correct) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    }
    
    const totalQuestions = mockQuestions.length;
    const score = correctCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    const result: GradeResult = {
      score,
      totalQuestions,
      percentage,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansweredCount,
      timeSpent: submission.timeSpent,
      details: questionGrades
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error grading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to grade quiz submission' },
      { status: 500 }
    );
  }
}
