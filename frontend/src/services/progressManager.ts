'use client';

export interface CourseProgress {
  courseId: number;
  currentLevel: number; // 1-indexed: 1 = Unit 1 Node 1, 2 = Unit 1 Node 2, etc.
  completedLevels: number[]; // list of completed level numbers [1, 2, ...]
  claimedChests: number[]; // list of claimed chest level numbers [4, 9, 16, 24]
}

const STORAGE_PREFIX = 'duo_progress_course_';

export const progressManager = {
  getCourseProgress(courseId: number = 1): CourseProgress {
    if (typeof window === 'undefined') {
      return {
        courseId,
        currentLevel: 1,
        completedLevels: [],
        claimedChests: [],
      };
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${courseId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          courseId,
          currentLevel: Math.max(1, parsed.currentLevel || 1),
          completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
          claimedChests: Array.isArray(parsed.claimedChests) ? parsed.claimedChests : [],
        };
      }
    } catch (e) {
      console.warn('Failed to parse course progress:', e);
    }

    return {
      courseId,
      currentLevel: 1,
      completedLevels: [],
      claimedChests: [],
    };
  },

  completeLevel(courseId: number = 1, levelNum: number): CourseProgress {
    if (typeof window === 'undefined') {
      return { courseId, currentLevel: levelNum + 1, completedLevels: [levelNum], claimedChests: [] };
    }

    const current = this.getCourseProgress(courseId);
    const completedSet = new Set(current.completedLevels);
    completedSet.add(levelNum);

    // If completed the current active level, advance to the next level
    let nextLevel = current.currentLevel;
    if (levelNum >= current.currentLevel) {
      nextLevel = levelNum + 1;
    }

    const updated: CourseProgress = {
      courseId,
      currentLevel: nextLevel,
      completedLevels: Array.from(completedSet).sort((a, b) => a - b),
      claimedChests: current.claimedChests,
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save level progress:', e);
    }

    return updated;
  },

  claimChest(courseId: number = 1, chestLevelNum: number): CourseProgress {
    if (typeof window === 'undefined') {
      return { courseId, currentLevel: chestLevelNum + 1, completedLevels: [chestLevelNum], claimedChests: [chestLevelNum] };
    }

    const current = this.getCourseProgress(courseId);
    const completedSet = new Set(current.completedLevels);
    const chestsSet = new Set(current.claimedChests);

    completedSet.add(chestLevelNum);
    chestsSet.add(chestLevelNum);

    let nextLevel = current.currentLevel;
    if (chestLevelNum >= current.currentLevel) {
      nextLevel = chestLevelNum + 1;
    }

    const updated: CourseProgress = {
      courseId,
      currentLevel: nextLevel,
      completedLevels: Array.from(completedSet).sort((a, b) => a - b),
      claimedChests: Array.from(chestsSet).sort((a, b) => a - b),
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save chest claim:', e);
    }

    return updated;
  },

  jumpToUnit(courseId: number = 1, targetLevel: number): CourseProgress {
    if (typeof window === 'undefined') {
      return { courseId, currentLevel: targetLevel, completedLevels: [], claimedChests: [] };
    }

    const current = this.getCourseProgress(courseId);
    const completedSet = new Set(current.completedLevels);

    // Auto-complete previous levels up to targetLevel - 1
    for (let i = 1; i < targetLevel; i++) {
      completedSet.add(i);
    }

    const updated: CourseProgress = {
      courseId,
      currentLevel: targetLevel,
      completedLevels: Array.from(completedSet).sort((a, b) => a - b),
      claimedChests: current.claimedChests,
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to jump to unit:', e);
    }

    return updated;
  },

  resetCourseProgress(courseId: number = 1): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_PREFIX}${courseId}`);
      window.dispatchEvent(new CustomEvent('duo_progress_updated', {
        detail: { courseId, currentLevel: 1, completedLevels: [], claimedChests: [] }
      }));
    }
  }
};
