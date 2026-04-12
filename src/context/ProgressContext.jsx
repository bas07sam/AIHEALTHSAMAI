import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sections } from '../data/courseData';

const ProgressContext = createContext();

const STORAGE_KEY = 'healthcare-ai-course-progress';

const defaultProgress = {
  sections: {},
  tools: {},
  activities: {},
  toolQuizzes: {},
  moduleQuizzes: {},   // { 'section-1': { completed: true, score: 80, passed: true, completedAt: '...' }, ... }
  finalExam: null,
  currentSlides: {},
  watchedVideos: {},   // { 'section-1:intro': true, 'section-1:conclusion': true, ... }
  viewedSlides: {},    // { 'section-1': [0,1,2,...], ... } — set of viewed slide indices per section
  started: false,
  completedAt: null
};

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const startCourse = useCallback(() => {
    setProgress(prev => ({ ...prev, started: true }));
  }, []);

  const updateSlide = useCallback((sectionId, slideIndex) => {
    setProgress(prev => ({
      ...prev,
      currentSlides: { ...prev.currentSlides, [sectionId]: slideIndex }
    }));
  }, []);

  // Mark a video as watched: videoKey = 'section-1:intro' or 'section-1:conclusion'
  const completeVideo = useCallback((sectionId, videoType) => {
    const key = `${sectionId}:${videoType}`;
    setProgress(prev => ({
      ...prev,
      watchedVideos: { ...prev.watchedVideos, [key]: true }
    }));
  }, []);

  const isVideoWatched = useCallback((sectionId, videoType) => {
    return progress.watchedVideos?.[`${sectionId}:${videoType}`] || false;
  }, [progress]);

  // Mark a single slide as viewed
  const markSlideViewed = useCallback((sectionId, slideIndex) => {
    setProgress(prev => {
      const existing = prev.viewedSlides?.[sectionId] || [];
      if (existing.includes(slideIndex)) return prev;
      return {
        ...prev,
        viewedSlides: {
          ...prev.viewedSlides,
          [sectionId]: [...existing, slideIndex]
        }
      };
    });
  }, []);

  const areSlidesCompleted = useCallback((sectionId, totalSlides) => {
    const viewed = progress.viewedSlides?.[sectionId] || [];
    return totalSlides > 0 && viewed.length >= totalSlides;
  }, [progress]);

  const completeSection = useCallback((sectionId) => {
    setProgress(prev => ({
      ...prev,
      sections: { ...prev.sections, [sectionId]: { completed: true, completedAt: new Date().toISOString() } }
    }));
  }, []);

  const completeActivity = useCallback((activityId, score) => {
    setProgress(prev => ({
      ...prev,
      activities: { ...prev.activities, [activityId]: { completed: true, score, completedAt: new Date().toISOString() } }
    }));
  }, []);

  const completeTool = useCallback((toolId) => {
    setProgress(prev => ({
      ...prev,
      tools: { ...prev.tools, [toolId]: { completed: true, completedAt: new Date().toISOString() } }
    }));
  }, []);

  const completeToolQuiz = useCallback((toolId, score) => {
    setProgress(prev => ({
      ...prev,
      toolQuizzes: { ...prev.toolQuizzes, [toolId]: { completed: true, score, completedAt: new Date().toISOString() } }
    }));
  }, []);

  // Module quiz — end-of-module assessment (80% to pass)
  const completeModuleQuiz = useCallback((sectionId, score) => {
    const passed = score >= 80;
    setProgress(prev => ({
      ...prev,
      moduleQuizzes: { ...prev.moduleQuizzes, [sectionId]: { completed: true, score, passed, completedAt: new Date().toISOString() } }
    }));
  }, []);

  const isModuleQuizPassed = useCallback((sectionId) => {
    return progress.moduleQuizzes?.[sectionId]?.passed || false;
  }, [progress]);

  const isModuleQuizCompleted = useCallback((sectionId) => {
    return progress.moduleQuizzes?.[sectionId]?.completed || false;
  }, [progress]);

  const submitFinalExam = useCallback((score, total, passed, detailedResults) => {
    setProgress(prev => ({
      ...prev,
      finalExam: {
        score, total, passed,
        percentage: Math.round((score / total) * 100),
        completedAt: new Date().toISOString(),
        detailedResults: detailedResults || null
      },
      completedAt: passed ? new Date().toISOString() : prev.completedAt
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getOverallProgress = useCallback(() => {
    // Granular overall progress:
    // For each module: intro video + slides + conclusion video + each activity + each tool quiz
    // Plus the final exam
    let total = 0;
    let done = 0;

    sections.forEach(section => {
      // Intro video
      total++;
      if (progress.watchedVideos?.[`${section.id}:intro`]) done++;

      // Slides
      total++;
      const viewed = progress.viewedSlides?.[section.id] || [];
      if (section.totalSlides > 0 && viewed.length >= section.totalSlides) done++;

      // Conclusion video
      total++;
      if (progress.watchedVideos?.[`${section.id}:conclusion`]) done++;

      // Each activity
      section.activities.forEach(a => {
        total++;
        if (progress.activities[a.id]?.completed) done++;
      });

      // Module quiz
      total++;
      if (progress.moduleQuizzes?.[section.id]?.passed) done++;

      // Each tool quiz
      if (section.toolIds?.length) {
        section.toolIds.forEach(toolId => {
          total++;
          if (progress.toolQuizzes[toolId]?.completed) done++;
        });
      }
    });

    // Final exam
    total++;
    if (progress.finalExam?.passed) done++;

    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [progress]);

  const isSectionCompleted = useCallback((sectionId) => {
    return progress.sections[sectionId]?.completed || false;
  }, [progress]);

  const isToolCompleted = useCallback((toolId) => {
    return progress.tools[toolId]?.completed || false;
  }, [progress]);

  const isActivityCompleted = useCallback((activityId) => {
    return progress.activities[activityId]?.completed || false;
  }, [progress]);

  return (
    <ProgressContext.Provider value={{
      progress,
      startCourse,
      updateSlide,
      completeSection,
      completeActivity,
      completeTool,
      completeToolQuiz,
      completeVideo,
      isVideoWatched,
      markSlideViewed,
      areSlidesCompleted,
      completeModuleQuiz,
      isModuleQuizPassed,
      isModuleQuizCompleted,
      submitFinalExam,
      resetProgress,
      getOverallProgress,
      isSectionCompleted,
      isToolCompleted,
      isActivityCompleted
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
