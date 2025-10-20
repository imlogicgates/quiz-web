import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining?: number;
}

export function QuizProgress({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions, 
  timeRemaining 
}: QuizProgressProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="text-sm text-gray-500">
            {answeredQuestions} answered
          </div>
        </div>
        {timeRemaining !== undefined && (
          <div className={`text-sm font-medium ${
            timeRemaining < 60 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>
      <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
    </div>
  );
}
