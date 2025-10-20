interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  className = "",
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: QuizProgressProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-pink-500 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-300">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="text-sm text-gray-400">
            {answeredQuestions} answered
          </div>
        </div>
      </div>
      <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
    </div>
  );
}
