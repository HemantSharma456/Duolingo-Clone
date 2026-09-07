// Complete TypeScript interfaces matching backend models and schemas

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  hearts: number;
  max_hearts: number;
  gems: number;
  total_xp: number;
  daily_xp: number;
  daily_goal: number;
  streak: number;
  last_active_date?: string | null;
  current_course_id?: number | null;
  onboarding_completed?: boolean;
  created_at: string;
}

export interface CourseItem {
  id: number;
  title: string;
  language_code: string;
  flag_emoji: string;
  description?: string;
  learner_count: string;
}

export interface SkillPathItem {
  id: number;
  unit_id: number;
  order_index: number;
  title: string;
  icon_name: string;
  total_lessons: number;
  lessons_completed: number;
  is_unlocked: boolean;
  is_completed: boolean;
  first_lesson_id?: number | null;
}

export interface UnitPathItem {
  id: number;
  unit_number: number;
  title: string;
  description?: string;
  color_theme: string;
  skills: SkillPathItem[];
}

export interface CoursePathResponse {
  course_id: number;
  course_title: string;
  language_code: string;
  flag_emoji: string;
  units: UnitPathItem[];
}

export type ExerciseType = 
  | 'multiple_choice'
  | 'word_bank'
  | 'match_pairs'
  | 'fill_in_blank'
  | 'type_answer';

export interface Exercise {
  id: number;
  lesson_id: number;
  order_index: number;
  type: ExerciseType;
  prompt: string;
  prompt_translation?: string;
  audio_text?: string;
  options?: any;
  metadata?: any;
}

export interface Lesson {
  id: number;
  skill_id: number;
  skill_title: string;
  order_index: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
}

export interface ExerciseSubmissionResponse {
  is_correct: boolean;
  correct_answer: any;
  explanation?: string | null;
  hearts_remaining: number;
}

export interface LessonCompleteResponse {
  success: boolean;
  xp_earned: number;
  total_xp: number;
  streak: number;
  streak_increased: boolean;
  hearts_remaining: number;
  gems_earned: number;
  skill_completed: boolean;
  next_skill_unlocked: boolean;
  unlocked_achievements: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar_url: string;
  total_xp: number;
  is_current_user: boolean;
}

export interface LeaderboardResponse {
  league_name: string;
  days_remaining: number;
  entries: LeaderboardEntry[];
}

export interface AchievementItem {
  id: number;
  code: string;
  title: string;
  description: string;
  badge_icon: string;
  category: string;
  threshold: number;
  is_unlocked: boolean;
  unlocked_at?: string | null;
  progress: number;
}

export interface AchievementsResponse {
  achievements: AchievementItem[];
}

export interface UserStats {
  username: string;
  avatar_url: string;
  total_xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal: number;
  daily_xp: number;
  completed_skills: number;
  total_lessons_attempted: number;
  joined_date: string;
}
