import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, Award, AlertCircle, Lightbulb } from 'lucide-react';
import { useLearningAnalytics } from '../../hooks/useLearningAnalytics';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  hint?: string;
  image?: string;
}

interface QuizEngineProps {
  stepId: string;
  lessonId: string;
  quizContent: {
    questions: Question[];
    passingScore?: number;
    allowRetry?: boolean;
    instantFeedback?: boolean;
  };
  onComplete?: (results: QuizResults) => void;
}

interface QuizResults {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  timeSpent: number;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  stepId,
  lessonId,
  quizContent,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const { trackQuizEvent } = useLearningAnalytics();
  const { user } = useUser();
  const passingScore = quizContent.passingScore || 70;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setShowExplanation(false);
    setShowHint(false);
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    const questionTime = Date.now() - questionStartTime;

    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));

    trackQuizEvent('answer', {
      stepId,
      lessonId,
      questionIndex: currentQuestion,
      answer,
      timeSpent: questionTime,
    });

    if (quizContent.instantFeedback) {
      setShowExplanation(true);
      setTimeout(() => {
        if (currentQuestion < quizContent.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          submitQuiz();
        }
      }, 3000);
    } else {
      if (currentQuestion < quizContent.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        submitQuiz();
      }
    }
  };

  const submitQuiz = async () => {
    const results = calculateResults();

    trackQuizEvent('submit', {
      stepId,
      lessonId,
      score: results.score,
      timeSpent,
    });

    if (user) {
      await supabase.from('learning_quiz_results').insert({
        user_id: user.id,
        step_id: stepId,
        score: results.score,
        max_score: 100,
        answers: answers,
        time_spent: timeSpent,
        attempt_number: 1,
        passed: results.passed,
      });
    }

    setShowResults(true);

    if (results.passed && onComplete) {
      onComplete(results);
    }
  };

  const calculateResults = (): QuizResults => {
    let correctCount = 0;

    quizContent.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quizContent.questions.length) * 100);

    return {
      score,
      passed: score >= passingScore,
      correctCount,
      totalQuestions: quizContent.questions.length,
      timeSpent,
    };
  };

  const useHint = () => {
    setHintsUsed(prev => new Set([...prev, currentQuestion]));
    setShowHint(true);

    trackQuizEvent('hint_used', {
      stepId,
      lessonId,
      questionIndex: currentQuestion,
    });
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeSpent(0);
    setHintsUsed(new Set());
    setShowHint(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const results = calculateResults();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="text-center">
          {results.passed ? (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <Award className="w-10 h-10 text-green-600" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
          )}

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {results.passed ? 'Excellent Work!' : 'Keep Practicing!'}
          </h3>
          <p className="text-gray-600">
            You scored {results.score}% ({results.correctCount}/{results.totalQuestions} correct)
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Your Score
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {results.score}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${results.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  results.passed ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="text-xl font-bold text-gray-900">{formatTime(timeSpent)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Passing Score</p>
              <p className="text-xl font-bold text-gray-900">{passingScore}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Review Answers</h4>
          {quizContent.questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                    <p className="text-sm text-gray-600">
                      Your answer: <span className="font-medium">{userAnswer || 'Not answered'}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-600 mt-1">
                        Correct answer: <span className="font-medium text-green-600">{question.correctAnswer}</span>
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-sm text-gray-700 mt-2 italic">{question.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          {quizContent.allowRetry && !results.passed && (
            <button
              onClick={retryQuiz}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          )}
          {results.passed && (
            <button
              onClick={() => onComplete && onComplete(results)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const question = quizContent.questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / quizContent.questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizContent.questions.length}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{question.text}</h3>
            {question.image && (
              <img
                src={question.image}
                alt="Question"
                className="w-full max-w-md rounded-lg mb-4"
              />
            )}
          </div>

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = answers[currentQuestion] === option.value;
              const isCorrect = option.value === question.correctAnswer;
              const showCorrectness = showExplanation;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => !showExplanation && handleAnswer(option.value)}
                  disabled={showExplanation}
                  whileHover={!showExplanation ? { scale: 1.01 } : {}}
                  whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    showCorrectness && isCorrect
                      ? 'border-green-500 bg-green-50'
                      : showCorrectness && isSelected && !isCorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-medium text-gray-700">
                        {option.label}
                      </span>
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                    {showCorrectness && isCorrect && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {showCorrectness && isSelected && !isCorrect && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showExplanation && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">{question.explanation}</p>
              </div>
            </motion.div>
          )}

          {question.hint && !hintsUsed.has(currentQuestion) && !showExplanation && (
            <button
              onClick={useHint}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Show Hint
            </button>
          )}

          {showHint && question.hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900">{question.hint}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {!showExplanation && (
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion === quizContent.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={!answers[currentQuestion]}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
