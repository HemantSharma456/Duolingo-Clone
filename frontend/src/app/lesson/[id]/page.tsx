'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, Exercise, LessonCompleteResponse } from '../../../types';
import { api } from '../../../services/api';
import { useGame } from '../../../context/GameContext';
import { useSound } from '../../../context/SoundContext';
import { LessonHeader } from '../../../components/lesson/LessonHeader';
import { FeedbackBar } from '../../../components/lesson/FeedbackBar';
import { OutOfHeartsModal } from '../../../components/lesson/OutOfHeartsModal';
import { LessonCompleteModal } from '../../../components/lesson/LessonCompleteModal';
import { MultipleChoice } from '../../../components/exercises/MultipleChoice';
import { WordBank } from '../../../components/exercises/WordBank';
import { MatchPairs } from '../../../components/exercises/MatchPairs';
import { FillInBlank } from '../../../components/exercises/FillInBlank';
import { TypeAnswer } from '../../../components/exercises/TypeAnswer';
import { DuoOwl } from '../../../components/mascot/DuoOwl';
import { progressManager } from '../../../services/progressManager';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { user, refreshUser, updateUserHearts } = useGame();
  const { playCorrectSound, playWrongSound } = useSound();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exercise Loop State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctAnswer, setCorrectAnswer] = useState<any>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gamification & Modals
  const [mistakesCount, setMistakesCount] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts ?? 5);
  const [outOfHeartsOpen, setOutOfHeartsOpen] = useState(false);
  const [completeResult, setCompleteResult] = useState<LessonCompleteResponse | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setHearts(user.hearts);
    }
  }, [user]);

  useEffect(() => {
    async function loadLesson() {
      try {
        let activeCourseId: number | undefined = undefined;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const qCourse = urlParams.get('course_id');
          if (qCourse) {
            const parsed = parseInt(qCourse, 10);
            if (!isNaN(parsed)) activeCourseId = parsed;
          }
          if (!activeCourseId) {
            const stored = localStorage.getItem('duo_active_course_id');
            if (stored) {
              const parsed = parseInt(stored, 10);
              if (!isNaN(parsed)) activeCourseId = parsed;
            }
          }
        }
        if (!activeCourseId && user?.current_course_id) {
          activeCourseId = user.current_course_id;
        }
        const data = await api.getLesson(lessonId, activeCourseId);
        setLesson(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [lessonId, user?.current_course_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <DuoOwl emotion="thinking" size={110} className="animate-float" />
        <div className="text-xl font-extrabold text-[var(--text-secondary)] animate-pulse">
          Preparing your exercises...
        </div>
      </div>
    );
  }

  if (error || !lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <DuoOwl emotion="sad" size={120} />
        <h2 className="text-2xl font-black text-[var(--duo-red)]">Lesson unavailable</h2>
        <p className="text-sm font-bold text-[var(--text-secondary)]">{error || 'No exercises found.'}</p>
        <button onClick={() => router.push('/')} className="btn-3d btn-primary">
          Back to Path
        </button>
      </div>
    );
  }

  const currentExercise: Exercise = lesson.exercises[currentStep];
  const totalExercises = lesson.exercises.length;
  const progressPercent = Math.round(((currentStep) / totalExercises) * 100);

  // Check if current exercise has an answer provided
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

        // Update remaining hearts
        setHearts(res.hearts_remaining);
        updateUserHearts(res.hearts_remaining);

        if (res.hearts_remaining <= 0) {
          setOutOfHeartsOpen(true);
        }
      }
    } catch (err: any) {
      console.error('Answer check error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    // If more exercises remain
    if (currentStep < totalExercises - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedbackStatus('idle');
      setCorrectAnswer(null);
      setExplanation(null);
    } else {
      // Completed last exercise!
      try {
        const finalResult = await api.completeLesson(lesson.id, mistakesCount);
        setCompleteResult(finalResult);
        setIsCompleteOpen(true);
        progressManager.completeLevel(user?.current_course_id || 1, lessonId);
        await refreshUser();
      } catch (err) {
        console.error('Failed to complete lesson:', err);
        router.push('/');
      }
    }
  };

  const accuracy = Math.max(0, Math.round(((totalExercises - mistakesCount) / totalExercises) * 100));

  return (
    <div className="min-h-screen flex flex-col justify-between pb-32">
      {/* Lesson Header */}
      <LessonHeader progress={progressPercent} hearts={hearts} />

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

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal
        isOpen={outOfHeartsOpen}
        onRefilled={() => {
          setOutOfHeartsOpen(false);
          setHearts(5);
        }}
      />

      {/* Lesson Complete Modal */}
      <LessonCompleteModal
        isOpen={isCompleteOpen}
        result={completeResult}
        accuracy={accuracy}
      />
    </div>
  );
}
