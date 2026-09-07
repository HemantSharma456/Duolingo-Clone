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
      // 1. Direct course-specific progress
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${courseId}`);
      let currentProgress: CourseProgress | null = null;
      if (stored) {
        const parsed = JSON.parse(stored);
        currentProgress = {
          courseId,
          currentLevel: Math.max(1, parsed.currentLevel || 1),
          completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
          claimedChests: Array.isArray(parsed.claimedChests) ? parsed.claimedChests : [],
        };
      }

      // 2. Global fallback progress backup (to ensure progress is never lost if course ID varied)
      const globalStored = localStorage.getItem('duo_global_progress');
      if (globalStored) {
        try {
          const globalParsed = JSON.parse(globalStored);
          if (globalParsed && typeof globalParsed === 'object') {
            const gLevel = Math.max(1, globalParsed.currentLevel || 1);
            const gCompleted = Array.isArray(globalParsed.completedLevels) ? globalParsed.completedLevels : [];
            const gChests = Array.isArray(globalParsed.claimedChests) ? globalParsed.claimedChests : [];

            if (!currentProgress || (currentProgress.currentLevel === 1 && currentProgress.completedLevels.length === 0 && (gLevel > 1 || gCompleted.length > 0))) {
              currentProgress = {
                courseId,
                currentLevel: gLevel,
                completedLevels: gCompleted,
                claimedChests: gChests,
              };
              localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(currentProgress));
            }
          }
        } catch {
          // ignore
        }
      }

      // 3. Self-heal from any other course key if this course still has no progress
      if (!currentProgress || (currentProgress.currentLevel === 1 && currentProgress.completedLevels.length === 0)) {
        const commonCourseIds = [1, 2, 8, 3, 4, 5, 6, 7];
        for (const cid of commonCourseIds) {
          try {
            const altStored = localStorage.getItem(`${STORAGE_PREFIX}${cid}`);
            if (altStored) {
              const altParsed = JSON.parse(altStored);
              if (altParsed && (altParsed.currentLevel > 1 || (altParsed.completedLevels && altParsed.completedLevels.length > 0))) {
                currentProgress = {
                  courseId,
                  currentLevel: Math.max(1, altParsed.currentLevel || 1),
                  completedLevels: Array.isArray(altParsed.completedLevels) ? altParsed.completedLevels : [],
                  claimedChests: Array.isArray(altParsed.claimedChests) ? altParsed.claimedChests : [],
                };
                localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(currentProgress));
                localStorage.setItem('duo_global_progress', JSON.stringify(currentProgress));
                break;
              }
            }
          } catch {
            // ignore
          }
        }
      }

      if (currentProgress) {
        // Guarantee completedLevels consistency: all levels up to currentLevel - 1 (except unclaimed chests) are completed
        if (currentProgress.currentLevel > 1) {
          const compSet = new Set(currentProgress.completedLevels);
          for (let i = 1; i < currentProgress.currentLevel; i++) {
            if (![4, 9, 16, 21].includes(i)) {
              compSet.add(i);
            }
          }
          currentProgress.completedLevels = Array.from(compSet).sort((a, b) => a - b);
        }
        return currentProgress;
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
    // Mark this level and all prior lesson levels as completed
    for (let i = 1; i <= levelNum; i++) {
      if (![4, 9, 16, 21].includes(i) || i === levelNum) {
        completedSet.add(i);
      }
    }

    // Advance currentLevel to at least levelNum + 1
    const nextLevel = Math.max(current.currentLevel, levelNum + 1);

    const updated: CourseProgress = {
      courseId,
      currentLevel: nextLevel,
      completedLevels: Array.from(completedSet).sort((a, b) => a - b),
      claimedChests: current.claimedChests,
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(updated));
      localStorage.setItem('duo_global_progress', JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());
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
      localStorage.setItem('duo_global_progress', JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());
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
      localStorage.setItem('duo_global_progress', JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to jump to unit:', e);
    }

    return updated;
  },

  resetCourseProgress(courseId: number = 1): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_PREFIX}${courseId}`);
      localStorage.removeItem('duo_global_progress');
      window.dispatchEvent(new CustomEvent('duo_progress_updated', {
        detail: { courseId, currentLevel: 1, completedLevels: [], claimedChests: [] }
      }));
    }
  }
};
