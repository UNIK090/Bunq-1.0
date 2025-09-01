import React, { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, Brain, BookOpen } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  correctCount: number;
  incorrectCount: number;
}

interface FlashcardSystemProps {
  flashcards: Flashcard[];
  onUpdateProgress: (flashcardId: string, correct: boolean) => void;
}

const FlashcardSystem: React.FC<FlashcardSystemProps> = ({
  flashcards,
  onUpdateProgress
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleAnswer = (correct: boolean) => {
    if (currentCard) {
      onUpdateProgress(currentCard.id, correct);
      setCompletedCards(prev => new Set([...prev, currentCard.id]));
    }

    setShowAnswer(false);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completed
      setCurrentIndex(0);
      setCompletedCards(new Set());
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompletedCards(new Set());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Flashcards Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create some flashcards to start learning!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress: {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="min-h-64 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center h-full">
          {!showAnswer ? (
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Question
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {currentCard.front}
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty}
                </span>
              </div>
              <button
                onClick={() => setShowAnswer(true)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
              >
                Show Answer
              </button>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Answer
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {currentCard.back}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900 rounded-md transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Incorrect</span>
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Correct</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={resetQuiz}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Correct: {currentCard.correctCount} | Incorrect: {currentCard.incorrectCount}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {flashcards.filter(card => card.correctCount > card.incorrectCount).length}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Mastered</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {flashcards.filter(card => card.correctCount === card.incorrectCount).length}
          </div>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">Learning</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {flashcards.filter(card => card.correctCount < card.incorrectCount).length}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">Needs Review</div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardSystem;
