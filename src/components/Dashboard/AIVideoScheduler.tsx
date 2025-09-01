import React, { useState, useEffect } from 'react';
import { Brain, Clock, Calendar, Play, Plus, Trash2, AlertCircle, CheckCircle, Zap, Target, BookOpen, History, VideoIcon, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getVideoDetails } from '../../services/youtubeApi';
import { analyzeVideoContent, generateStudyPlan, estimateCompletionTimeline, VideoAnalysis, StudyPlan } from '../../services/aiService';
import { createStudyReminder } from '../../services/calendarApi';
import { notificationService } from '../../services/notificationService';
import { Video as VideoType, VideoSchedule, DailySchedule } from '../../types';

interface AISchedule extends VideoSchedule {
  analysis: VideoAnalysis;
  studyPlan: StudyPlan;
  calendarEventsCreated: boolean;
  videoParts?: {
    part: number;
    title: string;
    startTime: number;
    endTime: number;
    duration: number;
    keyPoints: string[];
  }[];
}

const AIVideoScheduler: React.FC = () => {
  const { darkMode, addVideoSchedule } = useAppStore();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [targetDays, setTargetDays] = useState(7);
  const [aiSchedule, setAiSchedule] = useState<AISchedule | null>(null);
  const [scheduleHistory, setScheduleHistory] = useState<AISchedule[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [videoParts, setVideoParts] = useState<any[]>([]);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/,
      /(?:youtube\.com\/v\/)([^?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatSecondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const divideVideoIntoParts = (video: VideoType, analysis: VideoAnalysis): any[] => {
    // Divide video into logical parts based on duration and topics
    const totalDuration = video.duration ? parseDurationToSeconds(video.duration) : analysis.estimatedStudyTime * 60;
    const numParts = Math.min(analysis.topics.length + 1, 5); // Max 5 parts
    const partDuration = Math.floor(totalDuration / numParts);

    const parts = [];
    for (let i = 0; i < numParts; i++) {
      const startTime = i * partDuration;
      const endTime = Math.min((i + 1) * partDuration, totalDuration);

      parts.push({
        part: i + 1,
        title: i === 0 ? 'Introduction' :
               i === numParts - 1 ? 'Conclusion & Summary' :
               `Part ${i + 1}: ${analysis.topics[i - 1] || 'Main Content'}`,
        startTime,
        endTime,
        duration: endTime - startTime,
        keyPoints: analysis.keyConcepts.slice(i * 2, (i + 1) * 2)
      });
    }

    return parts;
  };

  const saveScheduleToHistory = (schedule: AISchedule) => {
    const updatedHistory = [schedule, ...scheduleHistory.slice(0, 9)]; // Keep last 10 schedules
    setScheduleHistory(updatedHistory);
    localStorage.setItem('aiVideoSchedules', JSON.stringify(updatedHistory));
  };

  const loadScheduleHistory = () => {
    const saved = localStorage.getItem('aiVideoSchedules');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        setScheduleHistory(history);
      } catch (error) {
        console.error('Failed to load schedule history:', error);
      }
    }
  };

  // Load history on component mount
  useEffect(() => {
    loadScheduleHistory();
  }, []);

  const analyzeVideo = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const video = await getVideoDetails(videoId);
      if (!video) {
        throw new Error('Could not fetch video details');
      }

      setCurrentVideo(video);

      // Analyze video content with AI
      const videoAnalysis = await analyzeVideoContent(video);
      setAnalysis(videoAnalysis);

      // Divide video into parts for detailed study plan
      const parts = divideVideoIntoParts(video, videoAnalysis);
      setVideoParts(parts);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePlan = async () => {
    if (!currentVideo || !analysis) return;

    setIsGeneratingPlan(true);
    setError(null);

    try {
      const plan = await generateStudyPlan(currentVideo, analysis, targetDays);
      setStudyPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate study plan');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const createSchedule = async () => {
    if (!currentVideo || !analysis || !studyPlan) return;

    setIsCreatingSchedule(true);
    setError(null);

    try {
      // Create daily schedule based on study plan
      const schedule: DailySchedule[] = [];
      const today = new Date();

      for (let i = 0; i < studyPlan.totalDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayPlan = studyPlan.dailyGoals[i];
        const recommendedTime = studyPlan.recommendedSchedule[i];

        schedule.push({
          day: i + 1,
          date: date.toISOString().split('T')[0],
          watchTime: dayPlan.estimatedTime * 60, // Convert minutes to seconds
          startTime: recommendedTime.startTime,
          completed: false
        });
      }

      const videoSchedule: VideoSchedule = {
        id: Date.now().toString(),
        videoId: currentVideo.id,
        video: currentVideo,
        targetDays: studyPlan.totalDays,
        totalDuration: analysis.estimatedStudyTime * 60, // Convert to seconds
        dailyWatchTime: Math.ceil((analysis.estimatedStudyTime * 60) / studyPlan.totalDays),
        schedule,
        createdAt: new Date().toISOString()
      };

      const aiScheduleData: AISchedule = {
        ...videoSchedule,
        analysis,
        studyPlan,
        calendarEventsCreated: false,
        videoParts
      };

      setAiSchedule(aiScheduleData);
      addVideoSchedule(videoSchedule);
      saveScheduleToHistory(aiScheduleData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create schedule');
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  const scheduleCalendarEvents = async () => {
    if (!aiSchedule) return;

    try {
      for (const day of aiSchedule.schedule) {
        if (day.startTime) {
          const eventDate = new Date(day.date + 'T' + day.startTime);
          const title = `Study: ${aiSchedule.video.title} - Day ${day.day}`;
          const description = `Daily study session for "${aiSchedule.video.title}". Focus: ${aiSchedule.studyPlan.dailyGoals[day.day - 1].focus}`;

          await createStudyReminder(title, description, eventDate, day.watchTime / 60);
        }
      }

      setAiSchedule({
        ...aiSchedule,
        calendarEventsCreated: true
      });

      // Show success notification
      notificationService.showReminderNotification(
        'Calendar events created successfully!',
        'Your study schedule has been added to your calendar with reminders.'
      );

    } catch (err) {
      setError('Failed to create calendar events. Please check your Google Calendar permissions.');
    }
  };

  const resetScheduler = () => {
    setYoutubeUrl('');
    setCurrentVideo(null);
    setAnalysis(null);
    setStudyPlan(null);
    setAiSchedule(null);
    setError(null);
  };

  return (
    <div className={`h-full p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            AI Video Scheduler
          </h1>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <History className="h-5 w-5 mr-2" />
            {showHistory ? 'Hide History' : 'View History'}
          </button>
        </div>

        {/* Schedule History */}
        {showHistory && (
          <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <History className="h-5 w-5 mr-2" />
              Schedule History
            </h2>

            {scheduleHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No schedules created yet. Create your first AI-powered study schedule!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduleHistory.map((schedule, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setAiSchedule(schedule);
                      setCurrentVideo(schedule.video);
                      setAnalysis(schedule.analysis);
                      setStudyPlan(schedule.studyPlan);
                      setVideoParts(schedule.videoParts || []);
                      setShowHistory(false);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{schedule.video.title}</h3>
                        <p className="text-xs text-gray-500">{schedule.video.channelTitle}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        schedule.analysis.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                        schedule.analysis.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {schedule.analysis.complexity}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div>Duration: {formatSecondsToTime(schedule.totalDuration)}</div>
                      <div>Days: {schedule.targetDays}</div>
                      <div>Created: {new Date(schedule.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {schedule.analysis.topics.slice(0, 2).map((topic, idx) => (
                        <span
                          key={idx}
                          className={`px-1 py-0.5 rounded text-xs ${
                            darkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                      {schedule.analysis.topics.length > 2 && (
                        <span className="text-xs text-gray-500">+{schedule.analysis.topics.length - 2}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Video Input and Analysis */}
        <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Play className="h-5 w-5 mr-2" />
            Step 1: Analyze Video Content
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full p-3 rounded border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Completion Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className={`w-full p-3 rounded border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
            </div>
          </div>

          <button
            onClick={analyzeVideo}
            disabled={isAnalyzing || !youtubeUrl}
            className={`px-6 py-3 rounded-lg font-semibold transition mr-4 ${
              isAnalyzing || !youtubeUrl
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white flex items-center`}
          >
            <Brain className="h-5 w-5 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Step 2: AI Analysis Results */}
        {currentVideo && analysis && (
          <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Step 2: AI Analysis Results
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Video Preview */}
              <div className="lg:col-span-1">
                <h4 className="font-medium mb-3">Video Preview:</h4>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.id}`}
                    title={currentVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{currentVideo.title}</h3>
                <p className="text-xs text-gray-500">{currentVideo.channelTitle}</p>
              </div>

              {/* Analysis Results */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Analysis Summary:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Complexity:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          analysis.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                          analysis.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysis.complexity}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-medium mr-2">Difficulty:</span>
                        <span>{analysis.difficultyScore}/10</span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-medium mr-2">Est. Study Time:</span>
                        <span>{analysis.estimatedStudyTime} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Topics Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topics.map((topic, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-sm ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <h4 className="font-medium mb-2">Key Concepts:</h4>
                <ul className="text-sm space-y-1 mb-4">
                  {analysis.keyConcepts.slice(0, 4).map((concept, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      {concept}
                    </li>
                  ))}
                </ul>

                {/* Video Parts */}
                {videoParts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Video Parts Breakdown:</h4>
                    <div className="space-y-2">
                      {videoParts.map((part, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{part.title}</span>
                            <span className="text-xs text-gray-500">
                              {formatSecondsToTime(part.startTime)} - {formatSecondsToTime(part.endTime)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Duration: {formatSecondsToTime(part.duration)}
                          </div>
                          {part.keyPoints.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-medium mb-1">Key Points:</div>
                              <ul className="text-xs space-y-1">
                                {part.keyPoints.map((point: string, idx: number) => (
                                  <li key={idx} className="flex items-center">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={generatePlan}
              disabled={isGeneratingPlan}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isGeneratingPlan
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white flex items-center`}
            >
              <Target className="h-5 w-5 mr-2" />
              {isGeneratingPlan ? 'Generating Plan...' : 'Generate Study Plan'}
            </button>
          </div>
        )}

        {/* Step 3: Study Plan */}
        {studyPlan && (
          <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Step 3: Personalized Study Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{studyPlan.totalDays}</div>
                <div className="text-sm text-gray-500">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.ceil(analysis!.estimatedStudyTime / studyPlan.totalDays)} min
                </div>
                <div className="text-sm text-gray-500">Daily Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis!.difficultyScore}/10</div>
                <div className="text-sm text-gray-500">Difficulty Level</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Daily Goals Preview:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlan.dailyGoals.slice(0, 4).map((goal, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">Day {goal.day}: {goal.focus}</div>
                    <div className="text-sm text-gray-500">{goal.estimatedTime} minutes</div>
                  </div>
                ))}
                {studyPlan.dailyGoals.length > 4 && (
                  <div className="p-3 text-center text-gray-500">
                    +{studyPlan.dailyGoals.length - 4} more days...
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={createSchedule}
              disabled={isCreatingSchedule}
              className={`px-6 py-3 rounded-lg font-semibold transition mr-4 ${
                isCreatingSchedule
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white flex items-center`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              {isCreatingSchedule ? 'Creating Schedule...' : 'Create Schedule'}
            </button>
          </div>
        )}

        {/* Step 4: Final Schedule and Calendar Integration */}
        {aiSchedule && (
          <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Step 4: Your AI-Generated Study Schedule
            </h2>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">{aiSchedule.video.title}</h3>
                <p className="text-gray-500">
                  {formatSecondsToTime(aiSchedule.totalDuration)} total study time • {aiSchedule.targetDays} days
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  AI-Optimized Plan
                </span>
                {aiSchedule.calendarEventsCreated && (
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Calendar Synced
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {aiSchedule.schedule.slice(0, 6).map((day, index) => (
                <div
                  key={day.day}
                  className={`p-4 rounded-lg border ${
                    day.completed
                      ? 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Day {day.day}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      day.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {day.completed ? '✓' : '○'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(day.date).toLocaleDateString()}
                  </p>

                  <p className="font-mono text-lg mb-2">
                    {formatSecondsToTime(day.watchTime)}
                  </p>

                  <div className="text-sm">
                    <div className="font-medium mb-1">Focus:</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {aiSchedule.studyPlan.dailyGoals[index].focus}
                    </div>
                  </div>

                  {day.startTime && (
                    <div className="mt-2 text-xs text-gray-500">
                      Scheduled: {day.startTime}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!aiSchedule.calendarEventsCreated ? (
              <button
                onClick={scheduleCalendarEvents}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition flex items-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Add to Calendar with Reminders
              </button>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-medium">Calendar events created successfully!</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your study schedule has been added to Google Calendar with notifications.
                </p>
              </div>
            )}

            <div className="mt-6 flex space-x-4">
              <button
                onClick={resetScheduler}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
              >
                Create New Schedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVideoScheduler;
