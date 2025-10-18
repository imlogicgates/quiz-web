import React from 'react';
import { GradeResult } from '@/types/quiz';

interface QuestionReviewProps {
  grade: GradeResult;
}

export function QuestionReview({ grade }: QuestionReviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h2>
        
        <div className="space-y-6">
          {grade.details.map((detail, index) => (
            <div
              key={detail.questionId}
              className={`border rounded-lg p-6 ${
                detail.correct
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Question {index + 1}
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  detail.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {detail.correct ? 'Correct' : 'Incorrect'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Your Answer:</h4>
                  <p className="text-gray-600">
                    {Array.isArray(detail.userAnswer) 
                      ? detail.userAnswer.join(', ') 
                      : detail.userAnswer || 'No answer provided'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Correct Answer:</h4>
                  <p className="text-gray-600">
                    {Array.isArray(detail.correctAnswer) 
                      ? detail.correctAnswer.join(', ') 
                      : detail.correctAnswer
                    }
                  </p>
                </div>

                {detail.explanation && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Explanation:</h4>
                    <p className="text-gray-600">{detail.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
