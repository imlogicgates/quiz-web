import { Question } from "@/types/quiz";
import React from "react";

interface AnswerInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
}

export function AnswerInput({
  question,
  value,
  onChange,
  disabled = false,
}: AnswerInputProps) {
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
      onChange(currentValues.filter((v) => v !== option));
    }
  };

  if (question.type === "text") {
    return (
      <input
        type="text"
        value={(value as string) || ""}
        onChange={handleTextChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-700 disabled:cursor-not-allowed"
        placeholder="Enter your answer..."
      />
    );
  }

  if (question.type === "radio") {
    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <label
            key={option}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              value === option
                ? "border-pink-500 bg-pink-500 text-white"
                : "border-gray-600 hover:border-gray-500"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => handleRadioChange(option)}
              disabled={disabled}
              className="mr-3 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-gray-300">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "checkbox") {
    const currentValues = Array.isArray(value) ? value : [];

    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <label
            key={option}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              currentValues.includes(option)
                ? "border-pink-500 bg-pink-500 text-white"
                : "border-gray-600 hover:border-gray-500"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <input
              type="checkbox"
              name={question.id}
              value={option}
              checked={currentValues.includes(option)}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              disabled={disabled}
              className="mr-3 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-gray-300">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return null;
}
