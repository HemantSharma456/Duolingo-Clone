'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DuoOwl } from '../../components/mascot/DuoOwl';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { FlagIcon } from '../../components/ui/FlagIcon';
import { api } from '../../services/api';
import { useGame } from '../../context/GameContext';
import { CourseItem } from '../../types';

// =============================================================================
// DUOLINGO BRAND LOGO & HEADER COMPONENT
// =============================================================================

const DuolingoBrandLogo = () => (
  <Link href="/welcome" className="flex items-center gap-2 select-none no-underline group">
    {/* Duo Mascot Face */}
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="shrink-0">
      <ellipse cx="20" cy="20" rx="18" ry="17" fill="#58cc02" />
      <circle cx="13" cy="18" r="6" fill="#ffffff" />
      <circle cx="27" cy="18" r="6" fill="#ffffff" />
      <circle cx="14" cy="18" r="3.2" fill="#4b4b4b" />
      <circle cx="26" cy="18" r="3.2" fill="#4b4b4b" />
      <circle cx="15" cy="17" r="1.2" fill="#ffffff" />
      <circle cx="27" cy="17" r="1.2" fill="#ffffff" />
      <polygon points="20,19 16,24 24,24" fill="#ff9600" />
    </svg>
    <span className="text-[28px] sm:text-[31px] font-black text-[#58cc02] tracking-[-0.04em] leading-none lowercase group-hover:brightness-105 transition-all">
      duolingo
    </span>
  </Link>
);

// =============================================================================
// 8 COURSES DATA IN EXACT ORDER AND NUMBERS FROM SCREENSHOT
// =============================================================================

const ONBOARDING_COURSES = [
  // Row 1
  { id: 1, title: 'Spanish', language_code: 'es', learner_count: '42.2M learners' },
  { id: 2, title: 'French', language_code: 'fr', learner_count: '22.8M learners' },
  { id: 9, title: 'Chess', language_code: 'chess', learner_count: '' },
  { id: 8, title: 'English', language_code: 'en', learner_count: '20.5M learners' },
  // Row 2
  { id: 6, title: 'Japanese', language_code: 'ja', learner_count: '18.1M learners' },
  { id: 3, title: 'German', language_code: 'de', learner_count: '16M learners' },
  { id: 10, title: 'Math', language_code: 'math', learner_count: '' },
  { id: 7, title: 'Hindi', language_code: 'hi', learner_count: '13.7M learners' },
];

const SITE_LANGUAGES = [
  'English',
  'Español',
  'Français',
  'Deutsch',
  'Italiano',
  'Português',
  '中文',
  '日本語',
];

// =============================================================================
// MAIN ONBOARDING COMPONENT
// =============================================================================

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useGame();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Selected course state
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [siteLangOpen, setSiteLangOpen] = useState(false);
  const [selectedSiteLang, setSelectedSiteLang] = useState('English');

  // Question flow states
  const [proficiency, setProficiency] = useState<string>('new');
  const [motivation, setMotivation] = useState<string>('');
  const [dailyGoal, setDailyGoal] = useState<number>(20);

  // Account creation states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const courseParam = searchParams.get('course');
    if (courseParam) {
      const id = parseInt(courseParam, 10);
      if (!isNaN(id)) {
        setSelectedCourseId(id);
      }
    }
  }, [searchParams]);

  const activeCourse =
    ONBOARDING_COURSES.find((c) => c.id === selectedCourseId) || ONBOARDING_COURSES[0];

  // Duo Speech Bubble Reactions for Proficiency
  const getDuoReaction = () => {
    if (proficiency === 'new') {
      return "Okay, we'll start fresh!";
    }
    if (proficiency === 'beginner') {
      return "Okay, we'll build on what you know!";
    }
    return "Wow, that's great!";
  };

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourseId(courseId);
    // Smooth transition to next step
    setTimeout(() => {
      setStep(2);
    }, 150);
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/welcome');
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);
    try {
      if (username.trim() && password.trim()) {
        await api.register({
          username: username.trim(),
          password: password.trim(),
          email: email.trim() || `${username.trim().toLowerCase()}@duo-clone.internal`,
          course_id: selectedCourseId,
          daily_goal: dailyGoal,
          motivation,
          proficiency,
        });
      } else {
        await api.selectCourse(selectedCourseId);
        await api.updateDailyGoal(dailyGoal);
      }
      await refreshUser();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup. Continuing to lessons...');
      setTimeout(() => router.push('/'), 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestFastTrack = async () => {
    setLoading(true);
    try {
      await api.selectCourse(selectedCourseId);
      await api.updateDailyGoal(dailyGoal);
      await refreshUser();
      router.push('/');
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.round(((step - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#4b4b4b] antialiased select-none font-sans">
      {/* =====================================================================
          1. HEADER
          - Step 1: Clean header with Duolingo logo and SITE LANGUAGE (matches screenshot)
          - Step 2+: Header with Back Arrow and Green Progress Bar
          ===================================================================== */}
      {step === 1 ? (
        <header className="w-full bg-white relative z-40">
          <div className="w-full max-w-[1040px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
            <DuolingoBrandLogo />

            {/* Site Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSiteLangOpen(!siteLangOpen)}
                className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-black uppercase text-[#afafaf] hover:text-[#777777] tracking-wider transition-colors cursor-pointer"
              >
                <span>SITE LANGUAGE: {selectedSiteLang}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${siteLangOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {siteLangOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSiteLangOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border-2 border-[#e5e5e5] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    {SITE_LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedSiteLang(lang);
                          setSiteLangOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm font-black transition-colors flex items-center justify-between cursor-pointer ${
                          selectedSiteLang === lang
                            ? 'text-[#1cb0f6] bg-[#f0f9ff]'
                            : 'text-[#4b4b4b] hover:bg-[#f7f7f7]'
                        }`}
                      >
                        <span>{lang}</span>
                        {selectedSiteLang === lang && <span className="text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header className="w-full max-w-3xl mx-auto px-6 py-6 flex items-center gap-5">
          <button
            onClick={handleBack}
            type="button"
            className="text-2xl font-black text-[#afafaf] hover:text-[#4b4b4b] p-1 cursor-pointer transition-colors"
            title="Go back"
            aria-label="Back"
          >
            ←
          </button>

          <div className="flex-1">
            <ProgressBar progress={progressPercent} color="#58cc02" height={14} />
          </div>
        </header>
      )}

      {/* =====================================================================
          2. MAIN STEP CONTENT
          ===================================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 w-full">
        {/* ===================================================================
            STEP 1: "I want to learn..." EXACT COURSE SELECTION GRID (4x2)
            =================================================================== */}
        {step === 1 && (
          <div className="w-full max-w-[840px] mx-auto flex flex-col items-center animate-in fade-in duration-200">
            {/* Page Heading */}
            <h1 className="text-2xl sm:text-[32px] font-black text-[#4b4b4b] text-center mb-8 sm:mb-10">
              I want to learn...
            </h1>

            {/* 4x2 Course Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 w-full">
              {ONBOARDING_COURSES.map((course) => {
                const isSelected = course.id === selectedCourseId;
                return (
                  <button
                    key={course.title}
                    type="button"
                    onClick={() => handleCourseSelect(course.id)}
                    className={`h-[170px] sm:h-[185px] rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group active:translate-y-1 ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-[#f0f9ff] shadow-xs'
                        : 'border-[#e5e5e5] bg-white hover:border-[#84d8ff] hover:bg-[#ddf4ff]/20'
                    }`}
                  >
                    {/* Flag / Icon */}
                    <div className="group-hover:scale-105 transition-transform drop-shadow-2xs">
                      <FlagIcon code={course.language_code} width={76} height={54} />
                    </div>

                    {/* Course Title */}
                    <div className="font-extrabold text-[15px] sm:text-base text-[#4b4b4b] mt-3.5 leading-tight">
                      {course.title}
                    </div>

                    {/* Learner Count Subtitle */}
                    {course.learner_count ? (
                      <div className="text-xs font-semibold text-[#afafaf] mt-1">
                        {course.learner_count}
                      </div>
                    ) : (
                      <div className="h-4 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 2: HOW MUCH [LANGUAGE] DO YOU KNOW? (With Signal Bars & Duo)
            =================================================================== */}
        {step === 2 && (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in duration-200">
            {/* Mascot with Dynamic Speech Bubble */}
            <div className="flex items-center gap-4 mb-8 w-full max-w-lg">
              <DuoOwl emotion={proficiency === 'new' ? 'happy' : 'celebrate'} size={76} />
              <div className="relative bg-white border-2 border-[#e5e5e5] px-5 py-3.5 rounded-2xl shadow-xs text-base font-extrabold text-[#4b4b4b]">
                {getDuoReaction()}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-[#e5e5e5]" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-[28px] font-black text-[#4b4b4b] text-center mb-6">
              How much {activeCourse.title} do you know?
            </h2>

            {/* Proficiency Levels with Signal Bars */}
            <div className="flex flex-col gap-3 w-full max-w-lg">
              {[
                { id: 'new', bars: 1, label: `I'm new to ${activeCourse.title}` },
                { id: 'beginner', bars: 2, label: 'I know some common words and phrases' },
                { id: 'intermediate', bars: 3, label: 'I can have simple conversations' },
                { id: 'advanced', bars: 4, label: 'I can discuss a variety of topics' },
                { id: 'fluent', bars: 5, label: 'I can discuss almost anything in detail' },
              ].map((lvl) => {
                const isSelected = proficiency === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setProficiency(lvl.id)}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 font-black text-left text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-[#f0f9ff] text-[#1cb0f6]'
                        : 'border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] text-[#4b4b4b]'
                    }`}
                  >
                    {/* Signal Bars Indicator */}
                    <div className="flex items-end gap-1 w-6 h-5 shrink-0">
                      {[1, 2, 3, 4, 5].map((barNum) => (
                        <div
                          key={barNum}
                          className={`w-1 rounded-full transition-colors ${
                            barNum <= lvl.bars
                              ? isSelected
                                ? 'bg-[#1cb0f6]'
                                : 'bg-[#58cc02]'
                              : 'bg-[#e5e5e5]'
                          }`}
                          style={{ height: `${barNum * 20}%` }}
                        />
                      ))}
                    </div>

                    <span className="flex-1">{lvl.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 3: WHY ARE YOU LEARNING?
            =================================================================== */}
        {step === 3 && (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in duration-200">
            <div className="flex items-center gap-4 mb-8 w-full max-w-lg">
              <DuoOwl emotion="talking" size={72} />
              <div className="relative bg-white border-2 border-[#e5e5e5] px-5 py-3.5 rounded-2xl shadow-xs text-base font-extrabold text-[#4b4b4b]">
                Why are you learning {activeCourse.title}?
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-[#e5e5e5]" />
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-lg">
              {[
                { id: 'travel', emoji: '✈️', label: 'Prepare for travel' },
                { id: 'career', emoji: '💼', label: 'Boost my career' },
                { id: 'brain', emoji: '🧠', label: 'Brain training & mental fitness' },
                { id: 'family', emoji: '👥', label: 'Connect with family & friends' },
                { id: 'curiosity', emoji: '🎨', label: 'Culture, media & curiosity' },
              ].map((item) => {
                const isSelected = motivation === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMotivation(item.id)}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 font-black text-left text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-[#f0f9ff] text-[#1cb0f6]'
                        : 'border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] text-[#4b4b4b]'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 4: COURSE OVERVIEW / WHAT YOU CAN ACHIEVE
            =================================================================== */}
        {step === 4 && (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center animate-in fade-in duration-200">
            <DuoOwl emotion="celebrate" size={100} className="mb-4" />
            <h2 className="text-2xl sm:text-[30px] font-black text-[#4b4b4b] mb-2">
              Here&apos;s what you can achieve in {activeCourse.title}!
            </h2>
            <p className="text-sm font-bold text-[#afafaf] mb-8">
              Bite-sized practice tuned to build real-world confidence
            </p>

            <div className="flex flex-col gap-3.5 w-full max-w-md text-left">
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white shadow-2xs">
                <span className="text-3xl">💬</span>
                <div>
                  <div className="font-black text-base text-[#4b4b4b]">
                    1,500+ Words & Phrases
                  </div>
                  <div className="text-xs font-semibold text-[#afafaf]">
                    Master practical vocabulary for daily conversation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white shadow-2xs">
                <span className="text-3xl">🎯</span>
                <div>
                  <div className="font-black text-base text-[#4b4b4b]">
                    5 Interactive Exercise Types
                  </div>
                  <div className="text-xs font-semibold text-[#afafaf]">
                    Multiple choice, word bank, pair matching, fill-in, and typing
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#e5e5e5] bg-white shadow-2xs">
                <span className="text-3xl">🔥</span>
                <div>
                  <div className="font-black text-base text-[#4b4b4b]">
                    Build a Lifelong Daily Habit
                  </div>
                  <div className="text-xs font-semibold text-[#afafaf]">
                    Daily streak tracking, hearts, gems, and leaderboard leagues
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 5: DAILY LEARNING GOAL
            =================================================================== */}
        {step === 5 && (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in duration-200">
            <h2 className="text-2xl sm:text-[30px] font-black text-[#4b4b4b] mb-2 text-center">
              Choose your daily learning goal
            </h2>
            <p className="text-sm font-bold text-[#afafaf] mb-8 text-center">
              You can always adjust this later in settings
            </p>

            <div className="flex flex-col gap-3 w-full max-w-md">
              {[
                { xp: 10, label: 'Casual', time: '3 min / day', desc: '10 XP' },
                { xp: 20, label: 'Regular', time: '10 min / day', desc: '20 XP (Recommended)' },
                { xp: 30, label: 'Serious', time: '15 min / day', desc: '30 XP' },
                { xp: 50, label: 'Intense', time: '30 min / day', desc: '50 XP' },
              ].map((item) => {
                const isSelected = dailyGoal === item.xp;
                return (
                  <button
                    key={item.xp}
                    type="button"
                    onClick={() => setDailyGoal(item.xp)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 font-black text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-[#f0f9ff] text-[#1cb0f6]'
                        : 'border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] text-[#4b4b4b]'
                    }`}
                  >
                    <div>
                      <div className="text-base">{item.label}</div>
                      <div className="text-xs font-semibold opacity-70">{item.time}</div>
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 6: CREATE PROFILE / START LEARNING
            =================================================================== */}
        {step === 6 && (
          <div className="w-full max-w-md mx-auto flex flex-col items-center animate-in fade-in duration-200">
            <DuoOwl emotion="happy" size={84} className="mb-3" />
            <h2 className="text-2xl sm:text-[28px] font-black text-[#4b4b4b] mb-1 text-center">
              Create your profile
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#afafaf] mb-6 text-center">
              Save your progress in {activeCourse.title} and compete with friends!
            </p>

            {error && (
              <div className="w-full mb-4 p-3 rounded-xl bg-[#ffdfe0] text-[#ea2b2b] border border-[#ffb8b8] text-xs font-bold">
                {error}
              </div>
            )}

            <div className="w-full flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-4 h-12 rounded-xl border-2 border-[#e5e5e5] bg-white font-bold text-[#4b4b4b] focus:border-[#1cb0f6] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 h-12 rounded-xl border-2 border-[#e5e5e5] bg-white font-bold text-[#4b4b4b] focus:border-[#1cb0f6] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 h-12 rounded-xl border-2 border-[#e5e5e5] bg-white font-bold text-[#4b4b4b] focus:border-[#1cb0f6] outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleGuestFastTrack}
                disabled={loading}
                className="mt-2 text-xs font-black text-[#1cb0f6] hover:underline text-center cursor-pointer uppercase tracking-wider"
              >
                Or continue as guest learner &rarr;
              </button>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          3. BOTTOM ACTION FOOTER (Visible on Step 2+; Step 1 is clean)
          ===================================================================== */}
      {step > 1 && (
        <footer className="w-full border-t border-[#e5e5e5] bg-white py-5 px-6">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="h-11 px-6 rounded-2xl border-2 border-[#e5e5e5] border-b-4 hover:bg-[#f7f7f7] active:border-b-2 font-black text-xs uppercase tracking-wider text-[#afafaf] hover:text-[#4b4b4b] transition-all cursor-pointer"
            >
              Back
            </button>

            <Button
              variant="primary"
              disabled={loading}
              onClick={handleNext}
              className="min-w-36 h-11 uppercase font-black tracking-wider text-sm"
            >
              {loading
                ? 'Starting...'
                : step === totalSteps
                ? 'Complete & Start'
                : 'Continue'}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-black text-xl text-[#afafaf] animate-pulse">
          Loading...
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  );
}
