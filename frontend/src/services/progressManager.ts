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
      // 1. Gather all possible storage keys
      const keysToCheck = [
        'duo_user_progress',
        'duo_global_progress',
        `${STORAGE_PREFIX}${courseId}`,
        ...[1, 2, 6, 8, 3, 4, 5, 7, 9, 10, 11].map((id) => `${STORAGE_PREFIX}${id}`),
      ];

      let maxLevel = 1;
      const allCompleted = new Set<number>();
      const allChests = new Set<number>();

      // Check all course and global storage keys
      for (const key of keysToCheck) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed && typeof parsed === 'object') {
              if (parsed.currentLevel && Number(parsed.currentLevel) > maxLevel) {
                maxLevel = Number(parsed.currentLevel);
              }
              if (Array.isArray(parsed.completedLevels)) {
                parsed.completedLevels.forEach((lvl: number) => allCompleted.add(Number(lvl)));
              }
              if (Array.isArray(parsed.claimedChests)) {
                parsed.claimedChests.forEach((ch: number) => allChests.add(Number(ch)));
              }
            }
          } catch {
            // ignore JSON parse error
          }
        }
      }

      // Check level-specific discrete flags (duo_completed_level_1, etc.)
      for (let i = 1; i <= 24; i++) {
        if (localStorage.getItem(`duo_completed_level_${i}`) === 'true') {
          allCompleted.add(i);
          if (i >= maxLevel) {
            maxLevel = i + 1;
          }
        }
      }

      // If any progress was found across any key or flag
      if (maxLevel > 1 || allCompleted.size > 0) {
        // Guarantee all lesson levels below maxLevel are marked completed
        for (let i = 1; i < maxLevel; i++) {
          if (![4, 9, 16, 21].includes(i)) {
            allCompleted.add(i);
          }
        }

        const consolidated: CourseProgress = {
          courseId,
          currentLevel: maxLevel,
          completedLevels: Array.from(allCompleted).sort((a, b) => a - b),
          claimedChests: Array.from(allChests).sort((a, b) => a - b),
        };

        // Cache consolidated progress to current course, global, and unified keys
        localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(consolidated));
        localStorage.setItem('duo_user_progress', JSON.stringify(consolidated));
        localStorage.setItem('duo_global_progress', JSON.stringify(consolidated));

        return consolidated;
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

    // Set individual level completion flag
    try {
      localStorage.setItem(`duo_completed_level_${levelNum}`, 'true');
    } catch {}

    // Advance currentLevel to at least levelNum + 1
    const nextLevel = Math.max(current.currentLevel, levelNum + 1);

    const updated: CourseProgress = {
      courseId,
      currentLevel: nextLevel,
      completedLevels: Array.from(completedSet).sort((a, b) => a - b),
      claimedChests: current.claimedChests,
    };

    try {
      // 1. Save to primary keys
      localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, JSON.stringify(updated));
      localStorage.setItem('duo_user_progress', JSON.stringify(updated));
      localStorage.setItem('duo_global_progress', JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());

      // 2. Broadcast to all common course IDs so no course ever remains stuck
      const allCourseIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      for (const cid of allCourseIds) {
        localStorage.setItem(`${STORAGE_PREFIX}${cid}`, JSON.stringify({ ...updated, courseId: cid }));
      }

      // 3. Dispatch global progress update event
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
      localStorage.setItem('duo_user_progress', JSON.stringify(updated));
      localStorage.setItem('duo_global_progress', JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());

      const allCourseIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      for (const cid of allCourseIds) {
        localStorage.setItem(`${STORAGE_PREFIX}${cid}`, JSON.stringify({ ...updated, courseId: cid }));
      }

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
      localStorage.setItem('duo_user_progress', JSON.stringify(updated));
      localStorage.setItem('duo_global_progress', JSON.stringify(updated));
      localStorage.setItem('duo_active_course_id', courseId.toString());

      const allCourseIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      for (const cid of allCourseIds) {
        localStorage.setItem(`${STORAGE_PREFIX}${cid}`, JSON.stringify({ ...updated, courseId: cid }));
      }

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
