'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, Exercise, LessonCompleteResponse } from '../../types';
import { api } from '../../services/api';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { LessonHeader } from '../../components/lesson/LessonHeader';
import { FeedbackBar } from '../../components/lesson/FeedbackBar';
import { LessonCompleteModal } from '../../components/lesson/LessonCompleteModal';
import { MultipleChoice } from '../../components/exercises/MultipleChoice';
import { WordBank } from '../../components/exercises/WordBank';
import { MatchPairs } from '../../components/exercises/MatchPairs';
import { FillInBlank } from '../../components/exercises/FillInBlank';
import { TypeAnswer } from '../../components/exercises/TypeAnswer';
import { DuoOwl } from '../../components/mascot/DuoOwl';

const FALLBACK_PRACTICE_LESSON: Lesson = {
  id: 9999,
  skill_id: 1,
  skill_title: 'Personalized Practice & Heart Recovery',
  order_index: 1,
  title: 'Heart Recovery Practice Session',
  xp_reward: 15,
  exercises: [
    {
      id: 9901,
      lesson_id: 9999,
      order_index: 1,
      type: 'multiple_choice',
      prompt: 'Select the correct translation for "Hello"',
      prompt_translation: 'Greeting',
      audio_text: 'Hello',
      options: [
        { text: 'Hola / こんにちは / Bonjour', translation: 'Greeting' },
        { text: 'Adiós / さようなら / Au revoir', translation: 'Goodbye' },
        { text: 'Por favor / お願いします / S\'il vous plaît', translation: 'Please' },
      ],
      metadata: { correct_answer: 'Hola / こんにちは / Bonjour' },
    },
    {
      id: 9902,
      lesson_id: 9999,
      order_index: 2,
      type: 'match_pairs',
      prompt: 'Match the words with their meanings',
      prompt_translation: 'Vocabulary match',
      audio_text: 'Thank you',
      options: {
        left: ['Hello', 'Thank you', 'Water', 'Friend'],
        right: ['Greeting', 'Gratitude', 'Drink', 'Companion'],
      },
      metadata: {
        correct_matches: {
          'Hello': 'Greeting',
          'Thank you': 'Gratitude',
          'Water': 'Drink',
          'Friend': 'Companion',
        },
      },
    },
    {
      id: 9903,
      lesson_id: 9999,
      order_index: 3,
      type: 'word_bank',
      prompt: 'Build the correct sentence: "Good morning, friend"',
      prompt_translation: 'Good morning, friend',
      audio_text: 'Good morning, friend',
      options: ['Good', 'morning,', 'friend', 'night', 'water', 'tea'],
      metadata: { correct_tokens: ['Good', 'morning,', 'friend'] },
    },
    {
      id: 9904,
      lesson_id: 9999,
      order_index: 4,
      type: 'fill_in_blank',
      prompt: 'Fill in the blank: "Thank you very _____!"',
      prompt_translation: 'Gratitude phrase',
      audio_text: 'Thank you very much',
      options: ['much', 'dog', 'tree', 'cat'],
      metadata: { correct_answer: 'much' },
    },
  ],
};

export default function PracticePage() {
  const router = useRouter();
  const { user, refreshUser } = useGame();
  const { playCorrectSound, playWrongSound } = useSound();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // Timed challenge state
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60s timer

  // Exercise loop state
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctAnswer, setCorrectAnswer] = useState<any>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  const [completeResult, setCompleteResult] = useState<LessonCompleteResponse | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  useEffect(() => {
    async function loadPractice() {
      try {
        const data = await api.getPracticeSession();
        if (data && data.exercises && data.exercises.length > 0) {
          setLesson(data);
        } else {
          setLesson(FALLBACK_PRACTICE_LESSON);
        }
      } catch (err: any) {
        console.warn('Backend practice unavailable, using fallback exercises:', err);
        setLesson(FALLBACK_PRACTICE_LESSON);
      } finally {
        setLoading(false);
      }
    }
    loadPractice();
  }, []);

  // Countdown timer for timed challenge
  useEffect(() => {
    if (!isTimedMode || isCompleteOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimedMode, isCompleteOpen, timeLeft]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 select-none">
        <DuoOwl emotion="thinking" size={100} className="animate-float" />
        <div className="text-xl font-extrabold text-[var(--text-secondary)] animate-pulse">
          Generating personalized practice session...
        </div>
      </div>
    );
  }

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center select-none">
        <DuoOwl emotion="sad" size={100} />
        <h2 className="text-2xl font-black text-[var(--duo-red)]">Practice session unavailable</h2>
        <button onClick={() => router.push('/')} className="btn-3d btn-primary">
          Back to Learn
        </button>
      </div>
    );
  }

  const currentExercise: Exercise = lesson.exercises[currentStep];
  const totalExercises = lesson.exercises.length;
  const progressPercent = Math.round((currentStep / totalExercises) * 100);

  const canCheck = Boolean(
    selectedAnswer !== null &&
    (typeof selectedAnswer === 'string' ? selectedAnswer.trim().length > 0 : true) &&
    (Array.isArray(selectedAnswer) ? selectedAnswer.length > 0 : true) &&
    (typeof selectedAnswer === 'object' && !Array.isArray(selectedAnswer)
      ? Object.keys(selectedAnswer).length > 0
      : true)
  );

  const handleCheckAnswer = async () => {
    if (!canCheck || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await api.submitExercise(lesson.id, currentExercise.id, selectedAnswer);

      if (res.is_correct) {
        playCorrectSound();
        setFeedbackStatus('correct');
      } else {
        playWrongSound();
        setFeedbackStatus('incorrect');
        setCorrectAnswer(res.correct_answer);
        setExplanation(res.explanation || null);
        setMistakesCount((prev) => prev + 1);
      }
    } catch (err: any) {
      console.warn('Practice check error, evaluating locally:', err);
      const meta = currentExercise.metadata || {};
      const expected = meta.correct_answer || meta.correct_matches || meta.correct_tokens;
      let isCorrect = false;

      if (currentExercise.type === 'multiple_choice' || currentExercise.type === 'fill_in_blank') {
        isCorrect = selectedAnswer === expected;
      } else if (currentExercise.type === 'word_bank') {
        isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(expected);
      } else if (currentExercise.type === 'match_pairs') {
        isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(expected);
      } else {
        isCorrect = true;
      }

      if (isCorrect) {
        playCorrectSound();
        setFeedbackStatus('correct');
      } else {
        playWrongSound();
        setFeedbackStatus('incorrect');
        setCorrectAnswer(expected);
        setMistakesCount((prev) => prev + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (currentStep < totalExercises - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedbackStatus('idle');
      setCorrectAnswer(null);
      setExplanation(null);
    } else {
      // Completed practice session
      try {
        const finalResult = await api.completeLesson(lesson.id, mistakesCount);
        setCompleteResult(finalResult);
        setIsCompleteOpen(true);
        await refreshUser();
      } catch (err) {
        console.warn('Failed to complete practice via API, rendering local results:', err);
        setCompleteResult({
          success: true,
          xp_earned: 15,
          total_xp: (user?.total_xp || 0) + 15,
          gems_earned: 10,
          hearts_remaining: 5,
          streak: user?.streak || 1,
          streak_increased: true,
          skill_completed: false,
          next_skill_unlocked: false,
          unlocked_achievements: [],
        });
        setIsCompleteOpen(true);
      }
    }
  };

  const accuracy = Math.max(0, Math.round(((totalExercises - mistakesCount) / totalExercises) * 100));

  return (
    <div className="min-h-screen flex flex-col justify-between pb-32">
      {/* Top Banner: Practice Mode Details & Timed Switch */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="text-xs font-black uppercase text-[var(--duo-purple)] tracking-wider">
            Practice & Heart Recovery (Hearts Protected)
          </span>
        </div>

        {/* Timed Challenge Toggle */}
        <button
          onClick={() => {
            setIsTimedMode(!isTimedMode);
            setTimeLeft(60);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-extrabold text-xs tracking-wider transition-all cursor-pointer ${
            isTimedMode
              ? 'border-[var(--duo-yellow-dark)] bg-[var(--duo-yellow-light)] text-[var(--duo-yellow-dark)]'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
          }`}
          title="Toggle 60s Timed Practice"
        >
          <span>⏱️</span>
          <span>{isTimedMode ? `${timeLeft}s` : 'Timed Mode'}</span>
        </button>
      </div>

      {/* Lesson Header */}
      <LessonHeader progress={progressPercent} hearts={user?.hearts ?? 5} />

      {/* Main Exercise Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex items-center justify-center">
        {currentExercise.type === 'multiple_choice' && (
          <MultipleChoice
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onSelect={(ans) => setSelectedAnswer(ans)}
            disabled={feedbackStatus !== 'idle'}
          />
        )}

        {currentExercise.type === 'word_bank' && (
          <WordBank
            exercise={currentExercise}
            selectedAnswer={selectedAnswer || []}
            onSelect={(tokens) => setSelectedAnswer(tokens)}
            disabled={feedbackStatus !== 'idle'}
          />
        )}

        {currentExercise.type === 'match_pairs' && (
          <MatchPairs
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onSelect={(matches) => setSelectedAnswer(matches)}
            disabled={feedbackStatus !== 'idle'}
          />
        )}

        {currentExercise.type === 'fill_in_blank' && (
          <FillInBlank
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onSelect={(word) => setSelectedAnswer(word)}
            disabled={feedbackStatus !== 'idle'}
          />
        )}

        {currentExercise.type === 'type_answer' && (
          <TypeAnswer
            exercise={currentExercise}
            selectedAnswer={selectedAnswer || ''}
            onSelect={(text) => setSelectedAnswer(text)}
            onSubmit={handleCheckAnswer}
            disabled={feedbackStatus !== 'idle'}
          />
        )}
      </main>

      {/* Bottom Feedback Drawer */}
      <FeedbackBar
        status={feedbackStatus}
        correctAnswer={correctAnswer}
        explanation={explanation}
        onCheck={handleCheckAnswer}
        onContinue={handleContinue}
        canCheck={canCheck}
        isSubmitting={isSubmitting}
      />

      {/* Complete Celebration Modal */}
      {completeResult && (
        <LessonCompleteModal
          isOpen={isCompleteOpen}
          result={completeResult}
          accuracy={accuracy}
        />
      )}
    </div>
  );
}
