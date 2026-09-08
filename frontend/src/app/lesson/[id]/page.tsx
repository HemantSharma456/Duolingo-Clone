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
import { getFallbackLesson, evaluateLocalExercise, COURSE_ID_TO_LANG, LANG_TO_COURSE_ID } from '../../../services/curriculumFallback';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { user, refreshUser, updateUserHearts, updateUserGems } = useGame();
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
  const [currentLang, setCurrentLang] = useState<string>('hi');

  // Consistently resolve active course ID
  const resolveActiveCourseId = (): number => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qCourse = urlParams.get('course_id');
      if (qCourse) {
        const parsed = parseInt(qCourse, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      const qLang = urlParams.get('lang');
      if (qLang && LANG_TO_COURSE_ID[qLang.toLowerCase().trim()]) {
        return LANG_TO_COURSE_ID[qLang.toLowerCase().trim()];
      }
      const stored = localStorage.getItem('duo_active_course_id');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      const storedLang = localStorage.getItem('duo_active_lang');
      if (storedLang && LANG_TO_COURSE_ID[storedLang.toLowerCase().trim()]) {
        return LANG_TO_COURSE_ID[storedLang.toLowerCase().trim()];
      }
    }
    return user?.current_course_id || 7;
  };

  const resolveActiveLang = (courseId: number): string => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qLang = urlParams.get('lang');
      if (qLang && qLang.trim()) return qLang.toLowerCase().trim();
      const storedLang = localStorage.getItem('duo_active_lang');
      if (storedLang && storedLang.trim()) return storedLang.toLowerCase().trim();
    }
    return COURSE_ID_TO_LANG[courseId] || 'hi';
  };

  useEffect(() => {
    if (user) {
      setHearts(user.hearts);
    }
  }, [user]);

  useEffect(() => {
    // Reset all exercise and modal states when advancing to a new lesson
    setCurrentStep(0);
    setSelectedAnswer(null);
    setFeedbackStatus('idle');
    setCorrectAnswer(null);
    setExplanation(null);
    setIsSubmitting(false);
    setMistakesCount(0);
    setCompleteResult(null);
    setIsCompleteOpen(false);
    setLoading(true);

    async function loadLesson() {
      const activeCourseId = resolveActiveCourseId();
      const activeLang = resolveActiveLang(activeCourseId);
      setCurrentLang(activeLang);

      try {
        const data = await api.getLesson(lessonId, activeCourseId, activeLang);
        if (data && data.exercises && data.exercises.length > 0) {
          setLesson(data);
          setError(null);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('Backend API lesson fetch unreachable, activating offline calibrated curriculum:', err);
      }

      // Automatic fallback: Provide full interactive lesson without blocking the learner!
      try {
        const fallback = getFallbackLesson(lessonId, activeCourseId, activeLang);
        setLesson(fallback);
        setError(null);
      } catch (fallbackErr: any) {
        setError(fallbackErr.message || 'Failed to load lesson exercises');
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 select-none">
        <DuoOwl emotion="thinking" size={110} className="animate-float" />
        <div className="text-xl font-extrabold text-[var(--text-secondary)] animate-pulse">
          Preparing your exercises...
        </div>
      </div>
    );
  }

  if (error || !lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center select-none px-4">
        <DuoOwl emotion="sad" size={120} />
        <h2 className="text-2xl font-black text-[var(--duo-red)]">Lesson unavailable</h2>
        <p className="text-sm font-bold text-[var(--text-secondary)] max-w-sm">{error || 'No exercises found.'}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => {
              const fallback = getFallbackLesson(lessonId);
              setLesson(fallback);
              setError(null);
            }}
            className="px-6 py-2.5 rounded-2xl bg-[#58cc02] hover:bg-[#61e002] border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Start Offline Lesson
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Back to Path
          </button>
        </div>
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
      return;
    } catch (err: any) {
      console.warn('Backend submit unavailable, evaluating answer locally:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Local evaluation when backend is unreachable or offline
    const localEval = evaluateLocalExercise(currentExercise, selectedAnswer, hearts);
    if (localEval.is_correct) {
      playCorrectSound();
      setFeedbackStatus('correct');
    } else {
      playWrongSound();
      setFeedbackStatus('incorrect');
      setCorrectAnswer(localEval.correct_answer);
      setExplanation(localEval.explanation || null);
      setMistakesCount((prev) => prev + 1);

      setHearts(localEval.hearts_remaining);
      updateUserHearts(localEval.hearts_remaining);

      if (localEval.hearts_remaining <= 0) {
        setOutOfHeartsOpen(true);
      }
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
      let finalResult: LessonCompleteResponse;
      try {
        finalResult = await api.completeLesson(lesson.id, mistakesCount);
      } catch (err) {
        console.warn('Backend complete unreachable, generating local lesson completion:', err);
        const earnedXp = lesson.xp_reward || 15;
        finalResult = {
          success: true,
          xp_earned: earnedXp,
          total_xp: (user?.total_xp ?? 309) + earnedXp,
          streak: (user?.streak ?? 1) + 1,
          streak_increased: true,
          hearts_remaining: hearts,
          gems_earned: 10,
          skill_completed: true,
          next_skill_unlocked: true,
          unlocked_achievements: mistakesCount === 0 ? ['Flawless Finish'] : [],
        };
      }

      setCompleteResult(finalResult);
      setIsCompleteOpen(true);

      const activeCourse = resolveActiveCourseId();
      progressManager.completeLevel(activeCourse, lessonId);
      updateUserGems(finalResult.gems_earned || 10);
      try {
        await refreshUser();
      } catch {
        // ignore offline refresh failure
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
        currentLessonId={lessonId}
        courseId={resolveActiveCourseId()}
        langCode={currentLang}
      />
    </div>
  );
}
