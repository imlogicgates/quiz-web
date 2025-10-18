import { Question } from '../../types/quiz';
import { normalizeText, arraysEqual, gradeQuestion, validateSubmission, deterministicShuffle } from '../quizUtils';

describe('quizUtils', () => {
  describe('normalizeText', () => {
    it('should normalize text correctly', () => {
      expect(normalizeText('  Hello   World  ')).toBe('hello world');
      expect(normalizeText('PARIS')).toBe('paris');
      expect(normalizeText('Application Programming Interface')).toBe('application programming interface');
    });
  });

  describe('arraysEqual', () => {
    it('should return true for identical arrays', () => {
      expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
    });

    it('should return true for arrays with same elements in different order', () => {
      expect(arraysEqual(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(true);
    });

    it('should return false for arrays with different lengths', () => {
      expect(arraysEqual(['a', 'b'], ['a', 'b', 'c'])).toBe(false);
    });

    it('should return false for arrays with different elements', () => {
      expect(arraysEqual(['a', 'b'], ['a', 'c'])).toBe(false);
    });
  });

  describe('gradeQuestion', () => {
    const textQuestion: Question = {
      id: 'q1',
      type: 'text',
      question: 'What is the capital of France?',
      correctAnswer: 'Paris',
    };

    const radioQuestion: Question = {
      id: 'q2',
      type: 'radio',
      question: 'Which planet is closest to the Sun?',
      options: ['Venus', 'Mercury', 'Earth', 'Mars'],
      correctAnswer: 'Mercury',
    };

    const checkboxQuestion: Question = {
      id: 'q3',
      type: 'checkbox',
      question: 'Which are programming languages?',
      options: ['JavaScript', 'HTML', 'Python', 'CSS'],
      correctAnswer: ['JavaScript', 'Python'],
    };

    describe('text questions', () => {
      it('should grade correct text answers', () => {
        const result = gradeQuestion(textQuestion, 'Paris');
        expect(result.correct).toBe(true);
      });

      it('should grade correct text answers with different case', () => {
        const result = gradeQuestion(textQuestion, 'paris');
        expect(result.correct).toBe(true);
      });

      it('should grade correct text answers with extra spaces', () => {
        const result = gradeQuestion(textQuestion, '  Paris  ');
        expect(result.correct).toBe(true);
      });

      it('should grade incorrect text answers', () => {
        const result = gradeQuestion(textQuestion, 'London');
        expect(result.correct).toBe(false);
      });
    });

    describe('radio questions', () => {
      it('should grade correct radio answers', () => {
        const result = gradeQuestion(radioQuestion, 'Mercury');
        expect(result.correct).toBe(true);
      });

      it('should grade incorrect radio answers', () => {
        const result = gradeQuestion(radioQuestion, 'Venus');
        expect(result.correct).toBe(false);
      });
    });

    describe('checkbox questions', () => {
      it('should grade correct checkbox answers', () => {
        const result = gradeQuestion(checkboxQuestion, ['JavaScript', 'Python']);
        expect(result.correct).toBe(true);
      });

      it('should grade correct checkbox answers in different order', () => {
        const result = gradeQuestion(checkboxQuestion, ['Python', 'JavaScript']);
        expect(result.correct).toBe(true);
      });

      it('should grade incorrect checkbox answers with wrong selection', () => {
        const result = gradeQuestion(checkboxQuestion, ['JavaScript', 'HTML']);
        expect(result.correct).toBe(false);
      });

      it('should grade incorrect checkbox answers with missing options', () => {
        const result = gradeQuestion(checkboxQuestion, ['JavaScript']);
        expect(result.correct).toBe(false);
      });

      it('should grade incorrect checkbox answers with extra options', () => {
        const result = gradeQuestion(checkboxQuestion, ['JavaScript', 'Python', 'HTML']);
        expect(result.correct).toBe(false);
      });
    });
  });

  describe('validateSubmission', () => {
    const validSubmission = {
      quizId: 'quiz-1',
      answers: [
        { questionId: 'q1', value: 'answer1' },
        { questionId: 'q2', value: 'answer2' },
      ],
      timeSpent: 120,
    };

    it('should validate correct submission', () => {
      expect(validateSubmission(validSubmission)).toBeNull();
    });

    it('should reject submission without quizId', () => {
      const invalid = { ...validSubmission, quizId: '' };
      expect(validateSubmission(invalid)).toBe('Quiz ID is required');
    });

    it('should reject submission without answers', () => {
      const invalid = { ...validSubmission, answers: undefined };
      expect(validateSubmission(invalid)).toBe('Answers array is required');
    });

    it('should reject submission with invalid timeSpent', () => {
      const invalid = { ...validSubmission, timeSpent: -1 };
      expect(validateSubmission(invalid)).toBe('Valid time spent is required');
    });

    it('should reject submission with duplicate question IDs', () => {
      const invalid = {
        ...validSubmission,
        answers: [
          { questionId: 'q1', value: 'answer1' },
          { questionId: 'q1', value: 'answer2' },
        ],
      };
      expect(validateSubmission(invalid)).toBe('Duplicate question IDs found in answers');
    });
  });

  describe('deterministicShuffle', () => {
    it('should produce same result for same seed', () => {
      const array = [1, 2, 3, 4, 5];
      const seed = 'test-seed';
      
      const result1 = deterministicShuffle(array, seed);
      const result2 = deterministicShuffle(array, seed);
      
      expect(result1).toEqual(result2);
    });

    it('should produce different results for different seeds', () => {
      const array = [1, 2, 3, 4, 5];
      
      const result1 = deterministicShuffle(array, 'seed1');
      const result2 = deterministicShuffle(array, 'seed2');
      
      expect(result1).not.toEqual(result2);
    });

    it('should preserve all elements', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = deterministicShuffle(array, 'test');
      
      expect(shuffled.sort()).toEqual(array.sort());
    });

    it('should handle empty arrays', () => {
      const result = deterministicShuffle([], 'test');
      expect(result).toEqual([]);
    });

    it('should handle single element arrays', () => {
      const result = deterministicShuffle([42], 'test');
      expect(result).toEqual([42]);
    });
  });
});
