import { NextRequest, NextResponse } from 'next/server';
import { Quiz, Question } from '@/types/quiz';

// Mock quiz data
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

// Deterministic shuffle function using Fisher-Yates algorithm with seed
function deterministicShuffle<T>(array: T[], seed: string): T[] {
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

// Shuffle questions and options deterministically
function shuffleQuiz(questions: Question[], seed: string): Question[] {
  return questions.map(question => {
    const shuffledQuestion = { ...question };
    
    // Shuffle options if they exist
    if (question.options) {
      shuffledQuestion.options = deterministicShuffle(question.options, seed + question.id);
    }
    
    return shuffledQuestion;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed') || 'default';
    
    // Shuffle questions deterministically based on seed
    const shuffledQuestions = deterministicShuffle(mockQuestions, seed);
    const shuffledQuiz = shuffleQuiz(shuffledQuestions, seed);
    
    const quiz: Quiz = {
      id: 'quiz-1',
      title: 'General Knowledge Quiz',
      description: 'Test your knowledge across various topics including geography, programming, and science.',
      questions: shuffledQuiz,
      timeLimit: 300 // 5 minutes
    };
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz data' },
      { status: 500 }
    );
  }
}
