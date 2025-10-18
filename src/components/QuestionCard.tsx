import React from 'react';
import { Question } from '@/types/quiz';
import { AnswerInput } from './AnswerInput';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  disabled = false
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Question {questionNumber} of {totalQuestions}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
          </span>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          {question.question}
        </p>
      </div>
      
      <div className="mt-6">
        <AnswerInput
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
