import React from 'react';
import { GradeResult } from '@/types/quiz';

interface QuizResultsProps {
  grade: GradeResult;
  onRetake: () => void;
}

export function QuizResults({ grade, onRetake }: QuizResultsProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good effort!';
    if (percentage >= 60) return 'Not bad, keep studying!';
    return 'Keep practicing!';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-lg text-gray-600">{getScoreMessage(grade.percentage)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className={`text-4xl font-bold ${getScoreColor(grade.percentage)}`}>
              {grade.percentage}%
            </div>
            <div className="text-gray-600 mt-2">Final Score</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-600">
              {grade.correctAnswers}
            </div>
            <div className="text-gray-600 mt-2">Correct</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-red-600">
              {grade.incorrectAnswers + grade.unanswered}
            </div>
            <div className="text-gray-600 mt-2">Incorrect</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium">{grade.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Spent:</span>
                <span className="font-medium">{Math.floor(grade.timeSpent / 60)}:{(grade.timeSpent % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered:</span>
                <span className="font-medium">{grade.unanswered}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Correct: {grade.correctAnswers}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Incorrect: {grade.incorrectAnswers}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Unanswered: {grade.unanswered}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onRetake}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
