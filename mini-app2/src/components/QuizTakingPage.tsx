import React, { useState, useEffect } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { getQuizById } from "../data/quizzes";
import { Quiz, QuizResult, UserQuizProgress } from "../types/quiz";

interface QuizTakingPageProps {
  quizId: string;
}

export const QuizTakingPage: React.FC<QuizTakingPageProps> = ({ quizId }) => {
  const wallet = useTonWallet();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const foundQuiz = getQuizById(quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setSelectedAnswers(new Array(foundQuiz.questions.length).fill(-1));
      setTimeLeft(foundQuiz.estimatedTime * 60); // Convert minutes to seconds
    }
  }, [quizId]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      handleQuizSubmit();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setSelectedAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizSubmit(newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(selectedAnswers[currentQuestionIndex - 1]);
      setShowExplanation(false);
    }
  };

  const handleQuizSubmit = (finalAnswers?: number[]) => {
    if (!quiz) return;

    const answers = finalAnswers || selectedAnswers;
    let correctCount = 0;
    
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setQuizCompleted(true);

    // Save quiz result
    const result: QuizResult = {
      quizId: quiz.id,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      completedAt: new Date(),
      earnedReward: correctCount === quiz.questions.length ? quiz.rewardAmount : 0,
      answers
    };

    // Update user progress
    const existingProgress = localStorage.getItem('quiz-progress');
    const progress: Record<string, UserQuizProgress> = existingProgress ? JSON.parse(existingProgress) : {};
    
    const userProgress: UserQuizProgress = progress[quiz.id] || {
      quizId: quiz.id,
      completed: false,
      bestScore: 0,
      attempts: 0,
      rewardClaimed: false
    };

    userProgress.attempts += 1;
    userProgress.bestScore = Math.max(userProgress.bestScore, correctCount);
    userProgress.completed = correctCount === quiz.questions.length;
    userProgress.lastAttempt = new Date();

    progress[quiz.id] = userProgress;
    localStorage.setItem('quiz-progress', JSON.stringify(progress));

    // Save quiz result
    const existingResults = localStorage.getItem('quiz-results');
    const results: QuizResult[] = existingResults ? JSON.parse(existingResults) : [];
    results.push(result);
    localStorage.setItem('quiz-results', JSON.stringify(results));
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz!.questions.length).fill(-1));
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(quiz!.estimatedTime * 60);
    setQuizStarted(false);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#282c34] text-white p-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <Link to="/quizzes" className="text-blue-400 hover:text-blue-300">
            ← Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isPerfectScore = score === quiz.questions.length;

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-[#282c34] text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link to="/quizzes" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back to Quizzes
            </Link>
          </div>

          <div className="bg-[#3a3f47] rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">{quiz.icon}</div>
            <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
            <p className="text-gray-300 mb-6">{quiz.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#2a2d34] rounded p-4">
                <div className="text-2xl font-bold text-blue-400">{quiz.questions.length}</div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
              <div className="bg-[#2a2d34] rounded p-4">
                <div className="text-2xl font-bold text-green-400">{quiz.estimatedTime}</div>
                <div className="text-sm text-gray-400">Minutes</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-purple-400 text-lg font-semibold">
                <span>💎</span>
                <span>Reward: {quiz.rewardAmount} TON</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Complete all questions correctly to earn the full reward!
              </p>
            </div>

            <div className="mb-6">
              <TonConnectButton />
            </div>

            <button
              onClick={startQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completion screen
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-[#282c34] text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#3a3f47] rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">
              {isPerfectScore ? "🏆" : score >= quiz.questions.length * 0.7 ? "🎉" : "📚"}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              {isPerfectScore ? "Perfect Score!" : "Quiz Completed!"}
            </h1>
            
            <div className="bg-[#2a2d34] rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold mb-2">
                {score}/{quiz.questions.length}
              </div>
              <div className="text-gray-400">Correct Answers</div>
              <div className="text-lg mt-2">
                {Math.round((score / quiz.questions.length) * 100)}% Score
              </div>
            </div>

            {isPerfectScore && (
              <div className="bg-purple-600/20 border border-purple-600/50 rounded-lg p-4 mb-6">
                <div className="text-purple-400 font-semibold mb-2">🎊 Congratulations!</div>
                <div className="text-white">
                  You earned {quiz.rewardAmount} TON for perfect completion!
                </div>
                <Link
                  to="/quiz/$quizId/claim"
                  params={{ quizId: quiz.id }}
                  className="inline-block mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Claim Reward 💰
                </Link>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/quizzes"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded transition-colors"
              >
                Back to Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking screen
  return (
    <div className="min-h-screen bg-[#282c34] text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with progress */}
        <div className="bg-[#3a3f47] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="text-lg font-mono">
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-[#2a2d34] rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#3a3f47] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-600/20'
                    : 'border-gray-600 bg-[#2a2d34] hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showExplanation && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <div className="text-blue-400 font-semibold mb-2">Explanation:</div>
              <div className="text-gray-300">{currentQuestion.explanation}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Previous
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            disabled={selectedAnswer === null}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            {showExplanation ? "Hide" : "Show"} Explanation
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};