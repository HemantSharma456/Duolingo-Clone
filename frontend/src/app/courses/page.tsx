'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FlagIcon } from '../../components/ui/FlagIcon';
import { api } from '../../services/api';
import { useGame } from '../../context/GameContext';
import { CourseItem } from '../../types';
import { COURSE_ID_TO_LANG, LANG_TO_COURSE_ID } from '../../services/curriculumFallback';

// Order and display metadata matching real Duolingo catalog screenshot (all 13 courses)
const DEFAULT_COURSES = [
  { id: 1, title: 'Spanish', language_code: 'es', learner_count: '42.2M learners' },
  { id: 2, title: 'French', language_code: 'fr', learner_count: '22.8M learners' },
  { id: 9, title: 'Chess', language_code: 'chess', learner_count: '' },
  { id: 6, title: 'Japanese', language_code: 'ja', learner_count: '18.1M learners' },
  { id: 3, title: 'German', language_code: 'de', learner_count: '16M learners' },
  { id: 10, title: 'Math', language_code: 'math', learner_count: '' },
  { id: 7, title: 'Hindi', language_code: 'hi', learner_count: '13.7M learners' },
  { id: 11, title: 'Korean', language_code: 'ko', learner_count: '12.3M learners' },
  { id: 4, title: 'Italian', language_code: 'it', learner_count: '9.8M learners' },
  { id: 12, title: 'Chinese (Simplified)', language_code: 'zh', learner_count: '10.4M learners' },
  { id: 13, title: 'Russian', language_code: 'ru', learner_count: '8.6M learners' },
  { id: 8, title: 'English', language_code: 'en', learner_count: '15.9M learners' },
  { id: 5, title: 'Portuguese', language_code: 'pt', learner_count: '8.1M learners' },
];

export default function CoursesPage() {
  const router = useRouter();
  const { user, refreshUser } = useGame();
  const [courses, setCourses] = useState<any[]>(DEFAULT_COURSES);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [speakerDropdownOpen, setSpeakerDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const list = await api.getCourses();
        if (list && list.length > 0) {
          // Merge database IDs with display order matching reference screenshot
          const mapped = DEFAULT_COURSES.map((def) => {
            const found = list.find((c) => c.language_code === def.language_code);
            return found ? { ...def, id: found.id } : def;
          });
          setCourses(mapped);
        }
      } catch (err) {
        console.error('Failed to load courses from API:', err);
      }
    }
    loadCourses();
  }, []);

  const handleSelectCourse = async (courseId: number) => {
    setLoadingId(courseId);
    const selected = courses.find((c) => c.id === courseId) || DEFAULT_COURSES.find((c) => c.id === courseId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('duo_active_course_id', courseId.toString());
      if (selected?.language_code) {
        localStorage.setItem('duo_active_lang', selected.language_code);
      } else if (COURSE_ID_TO_LANG[courseId]) {
        localStorage.setItem('duo_active_lang', COURSE_ID_TO_LANG[courseId]);
      }
      window.dispatchEvent(new Event('duo_course_changed'));
    }
    try {
      await api.selectCourse(courseId);
      await refreshUser();
      router.push('/');
    } catch (err) {
      console.error('Failed to switch course:', err);
      router.push('/');
    } finally {
      setLoadingId(null);
    }
  };

  // Determine current active course
  const currentCourseId = (() => {
    if (typeof window !== 'undefined') {
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
    return user?.current_course_id ?? 7; // Default to Hindi
  })();

  return (
    <div className="w-full max-w-[1080px] mx-auto pt-2 pb-20 select-none">
      {/* Top Header Row: Courses for English Speakers & I SPEAK ENGLISH */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <h1 className="text-2xl sm:text-[28px] font-black text-[var(--text-primary)] tracking-tight">
          Courses for English Speakers
        </h1>

        {/* Language Selector dropdown pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSpeakerDropdownOpen(!speakerDropdownOpen)}
            className="text-xs font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors bg-transparent border-none py-1.5 px-2 rounded-lg hover:bg-[var(--bg-subtle)]"
          >
            <span>I SPEAK ENGLISH</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${speakerDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {speakerDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl z-50 py-1 overflow-hidden animate-scaleIn">
              {['English', 'Español', 'Français', 'Deutsch', 'Italiano'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSpeakerDropdownOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Course Cards (4 columns on desktop, exactly matching Image 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {courses.map((course) => {
          const isCurrent = course.id === currentCourseId;
          const isLoading = loadingId === course.id;

          return (
            <div
              key={course.language_code}
              onClick={() => handleSelectCourse(course.id)}
              className={`rounded-2xl border-2 transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[178px] relative group active:translate-y-0.5 ${
                isCurrent
                  ? 'border-[#58cc02] bg-[var(--bg-surface)] shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:border-[#8599a3]'
              } ${isLoading ? 'opacity-70 animate-pulse' : ''}`}
            >
              {/* Green checkmark badge in top-right corner if enrolled / active course */}
              {isCurrent && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-md bg-[#58cc02] text-white flex items-center justify-center text-xs font-black shadow-xs"
                  title="Current Course"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Big Flag or Subject Icon with authentic Duolingo rounded rectangle */}
              <div className="transform group-hover:scale-105 transition-transform duration-200">
                <FlagIcon code={course.language_code} width={76} height={54} />
              </div>

              {/* Course Title */}
              <span className="text-base font-black text-[var(--text-primary)] mt-3.5 leading-tight">
                {course.title}
              </span>

              {/* Subtitle / Learner count */}
              {course.learner_count ? (
                <span className="text-xs font-bold text-[var(--text-secondary)] mt-1.5 leading-none">
                  {course.learner_count}
                </span>
              ) : (
                <div className="h-3 mt-1.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
