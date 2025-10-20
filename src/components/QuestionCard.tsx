import { Question } from "@/types/quiz";
import { AnswerInput } from "./AnswerInput";

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
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-pink-500 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-pink-400">
            Question {questionNumber} of {totalQuestions}
          </h2>
          <span className="px-3 py-1 text-pink-100 bg-pink-800 text-sm font-medium rounded-full">
            {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
          </span>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed">
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
