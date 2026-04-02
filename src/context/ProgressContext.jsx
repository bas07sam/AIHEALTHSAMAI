import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProgressContext = createContext();

const STORAGE_KEY = 'healthcare-ai-course-progress';

const defaultProgress = {
  sections: {},
  tools: {},
  activities: {},
  toolQuizzes: {},
  finalExam: null,
  currentSlides: {},
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

  const submitFinalExam = useCallback((score, total, passed) => {
    setProgress(prev => ({
      ...prev,
      finalExam: { score, total, passed, percentage: Math.round((score / total) * 100), completedAt: new Date().toISOString() },
      completedAt: passed ? new Date().toISOString() : prev.completedAt
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getOverallProgress = useCallback(() => {
    const sectionCount = 5;
    const toolCount = 6;
    const activityCount = 10;
    const completedSections = Object.keys(progress.sections).filter(k => progress.sections[k]?.completed).length;
    const completedTools = Object.keys(progress.tools).filter(k => progress.tools[k]?.completed).length;
    const completedActivities = Object.keys(progress.activities).filter(k => progress.activities[k]?.completed).length;
    const examDone = progress.finalExam?.passed ? 1 : 0;
    const total = sectionCount + toolCount + activityCount + 1;
    const done = completedSections + completedTools + completedActivities + examDone;
    return Math.round((done / total) * 100);
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
