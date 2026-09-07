'use client';

export interface CourseProgress {
  courseId: number;
  currentLevel: number; // 1-indexed: 1 = Unit 1 Node 1, 2 = Unit 1 Node 2, etc.
  completedLevels: number[]; // list of completed level numbers [1, 2, ...]
  claimedChests: number[]; // list of claimed chest level numbers [4, 9, 16, 24]
}

const STORAGE_PREFIX = 'duo_progress_course_';
const SANITIZATION_KEY = 'duo_progress_isolated_v4';

export const progressManager = {
  /**
   * One-time sanitization on client load:
   * Cleans up legacy cross-course broadcasts and global contamination so that
   * every language course maintains its own independent progression.
   */
  sanitizeOnce(): void {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(SANITIZATION_KEY)) return;

      // 1. Remove legacy non-course-scoped global flags
      localStorage.removeItem('duo_user_progress');
      localStorage.removeItem('duo_global_progress');
      for (let i = 1; i <= 24; i++) {
        localStorage.removeItem(`duo_completed_level_${i}`);
      }

      // 2. Check Japanese (course 6) - user completed Level 1, so keep Level 2 ready
      const jpKey = `${STORAGE_PREFIX}6`;
      const jpRaw = localStorage.getItem(jpKey);
      let jpCompleted = [1];
      let jpLevel = 2;

      if (jpRaw) {
        try {
          const parsed = JSON.parse(jpRaw);
          // If Japanese had infected 5 levels from the seed, clamp to level 2 with level 1 completed
          if (parsed && Array.isArray(parsed.completedLevels)) {
            if (parsed.completedLevels.length > 2) {
              jpCompleted = [1];
              jpLevel = 2;
            } else if (parsed.completedLevels.length > 0) {
              jpCompleted = parsed.completedLevels.map(Number);
              jpLevel = Math.max(1, Number(parsed.currentLevel) || 2);
            }
          }
        } catch {}
      }

      // 3. Clear all other contaminated course keys so every new language starts completely fresh at Level 1
      const otherCourseIds = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];
      for (const cid of otherCourseIds) {
        localStorage.removeItem(`${STORAGE_PREFIX}${cid}`);
      }

      // 4. Set clean Japanese state
      localStorage.setItem(
        jpKey,
        JSON.stringify({
          courseId: 6,
          currentLevel: jpLevel,
          completedLevels: jpCompleted,
          claimedChests: [],
        })
      );

      localStorage.setItem(SANITIZATION_KEY, 'true');
    } catch (e) {
      console.warn('Sanitization failed:', e);
    }
  },

  getCourseProgress(courseId: number = 6): CourseProgress {
    if (typeof window === 'undefined') {
      return {
        courseId,
        currentLevel: 1,
        completedLevels: [],
        claimedChests: [],
      };
    }

    this.sanitizeOnce();

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${courseId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            courseId,
            currentLevel: Math.max(1, Number(parsed.currentLevel) || 1),
            completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels.map(Number) : [],
            claimedChests: Array.isArray(parsed.claimedChests) ? parsed.claimedChests.map(Number) : [],
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse course progress:', e);
    }

    // Completely new course - starts clean at Level 1 with 0 completed levels!
    return {
      courseId,
      currentLevel: 1,
      completedLevels: [],
      claimedChests: [],
    };
  },

  completeLevel(courseId: number = 6, levelNum: number): CourseProgress {
    if (typeof window === 'undefined') {
      return { courseId, currentLevel: levelNum + 1, completedLevels: [levelNum], claimedChests: [] };
    }

    const current = this.getCourseProgress(courseId);
    const completedSet = new Set(current.completedLevels);

    // Mark this level and all prior lesson levels in this course as completed
    for (let i = 1; i <= levelNum; i++) {
      if (![4, 9, 16, 21].includes(i) || i === levelNum) {
        completedSet.add(i);
      }
    }

    // Advance currentLevel for this course to at least levelNum + 1
    const nextLevel = Math.max(current.currentLevel, levelNum + 1);

    const updated: CourseProgress = {
      courseId,
      currentLevel: nextLevel,
      completedLevels: Array.from(completedSet).sort((a, b) => a - b),
      claimedChests: current.claimedChests,
    };

    try {
      // Save strictly to this specific course only
      localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save level progress:', e);
    }

    return updated;
  },

  claimChest(courseId: number = 6, chestLevelNum: number): CourseProgress {
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
      localStorage.setItem('duo_active_course_id', courseId.toString());
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to save chest claim:', e);
    }

    return updated;
  },

  jumpToUnit(courseId: number = 6, targetLevel: number): CourseProgress {
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
      localStorage.setItem('duo_active_course_id', courseId.toString());
      window.dispatchEvent(new CustomEvent('duo_progress_updated', { detail: updated }));
    } catch (e) {
      console.error('Failed to jump to unit:', e);
    }

    return updated;
  },

  resetCourseProgress(courseId: number = 6): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_PREFIX}${courseId}`);
      window.dispatchEvent(new CustomEvent('duo_progress_updated', {
        detail: { courseId, currentLevel: 1, completedLevels: [], claimedChests: [] }
      }));
    }
  }
};
