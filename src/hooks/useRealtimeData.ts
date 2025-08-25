import { useEffect } from 'react';
import { realtimeService } from '../services/realtimeService';
import { useAppStore } from '../store/useAppStore';

export const useRealtimeData = () => {
  const { 
    setRealTimeProgress, 
    setRealTimeStatistics, 
    setRealTimeLearningPath 
  } = useAppStore();

  useEffect(() => {
    // For demo purposes, we'll use a mock user ID
    const userId = 'demo-user';
    
    // Subscribe to learning path updates
    const unsubscribeLearningPath = realtimeService.subscribeToLearningPath(
      userId,
      (data) => setRealTimeLearningPath(data)
    );

    // Subscribe to progress updates
    const unsubscribeProgress = realtimeService.subscribeToProgress(
      userId,
      (data) => setRealTimeProgress(data)
    );

    // Subscribe to statistics updates
    const unsubscribeStatistics = realtimeService.subscribeToStatistics(
      userId,
      (data) => setRealTimeStatistics(data)
    );

    // Cleanup function
    return () => {
      unsubscribeLearningPath();
      unsubscribeProgress();
      unsubscribeStatistics();
    };
  }, [setRealTimeLearningPath, setRealTimeProgress, setRealTimeStatistics]);
};
