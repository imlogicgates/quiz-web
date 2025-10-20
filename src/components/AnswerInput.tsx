import React from 'react';
import { Question } from '@/types/quiz';

interface AnswerInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
}

export function AnswerInput({ question, value, onChange, disabled = false }: AnswerInputProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleRadioChange = (option: string) => {
    onChange(option);
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, option]);
    } else {
      onChange(currentValues.filter(v => v !== option));
    }
  };

  if (question.type === 'text') {
    return (
      <input
        type="text"
        value={value as string || ''}
        onChange={handleTextChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Enter your answer..."
      />
    );
  }

  if (question.type === 'radio') {
    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <label
            key={option}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              value === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => handleRadioChange(option)}
              disabled={disabled}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === 'checkbox') {
    const currentValues = Array.isArray(value) ? value : [];
    
    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <label
            key={option}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              currentValues.includes(option)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="checkbox"
              name={question.id}
              value={option}
              checked={currentValues.includes(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              disabled={disabled}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return null;
}
