import {
  User,
  CoursePathResponse,
  Lesson,
  ExerciseSubmissionResponse,
  LessonCompleteResponse,
  LeaderboardResponse,
  AchievementsResponse,
  UserStats
} from '../types';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    // If in the browser on localhost or 127.0.0.1, use local backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000';
    }
    // On deployed HTTPS origins without explicit API URL, use relative origin to avoid mixed-content blocks
    return '';
  }
  return 'http://127.0.0.1:8000';
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorDetail = 'API Request Failed';
      try {
        const errorJson = await res.json();
        errorDetail = errorJson.detail || errorDetail;
      } catch {
        errorDetail = `${res.status} ${res.statusText}`;
      }
      throw new Error(errorDetail);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`API Error on [${options?.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  register: (data: { username: string; email?: string; password: string; course_id?: number; daily_goal?: number; motivation?: string; proficiency?: string }) =>
    request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { username: string; password: string }) =>
    request<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () =>
    request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  // User endpoints
  getCurrentUser: () => request<User>('/api/users/me'),
  updateDailyGoal: (daily_goal: number) =>
    request<User>('/api/users/me/daily-goal', {
      method: 'PUT',
      body: JSON.stringify({ daily_goal }),
    }),
  refillHearts: (method: 'practice' | 'gems' = 'practice') =>
    request<{ hearts: number; gems: number; message: string }>('/api/users/me/refill-hearts', {
      method: 'POST',
      body: JSON.stringify({ method }),
    }),
  purchaseShopItem: (item_type: string) =>
    request<{ success: boolean; message: string; hearts: number; gems: number }>('/api/users/shop/purchase', {
      method: 'POST',
      body: JSON.stringify({ item_type }),
    }),
  getUserStats: () => request<UserStats>('/api/users/me/stats'),

  // Courses & Learning Path
  getCourses: () => request<import('../types').CourseItem[]>('/api/courses'),
  selectCourse: (course_id: number) =>
    request<CoursePathResponse>('/api/courses/select', {
      method: 'POST',
      body: JSON.stringify({ course_id }),
    }),
  getCurrentPath: () => request<CoursePathResponse>('/api/courses/current/path'),

  // Lessons
  getLesson: (lessonId: number, courseId?: number, lang?: string) => {
    const params = new URLSearchParams();
    if (courseId) params.append('course_id', courseId.toString());
    if (lang) params.append('lang', lang);
    const qs = params.toString();
    return request<Lesson>(`/api/lessons/${lessonId}${qs ? `?${qs}` : ''}`);
  },
  getPracticeSession: (courseId?: number, lang?: string) => {
    const params = new URLSearchParams();
    if (courseId) params.append('course_id', courseId.toString());
    if (lang) params.append('lang', lang);
    const qs = params.toString();
    return request<Lesson>(`/api/lessons/practice/session${qs ? `?${qs}` : ''}`);
  },
  submitExercise: (lessonId: number, exerciseId: number, answer: any) =>
    request<ExerciseSubmissionResponse>(`/api/lessons/${lessonId}/submit-exercise`, {
      method: 'POST',
      body: JSON.stringify({ exercise_id: exerciseId, answer }),
    }),
  completeLesson: (lessonId: number, mistakesCount: number, timeSpentSeconds: number = 0) =>
    request<LessonCompleteResponse>(`/api/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ mistakes_count: mistakesCount, time_spent_seconds: timeSpentSeconds }),
    }),

  // Leaderboard
  getLeaderboard: () => request<LeaderboardResponse>('/api/leaderboard'),

  // Achievements
  getAchievements: () => request<AchievementsResponse>('/api/achievements'),
};
