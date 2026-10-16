import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Mic, Play, Pause, StopCircle, CheckCircle, 
  RotateCcw, ArrowRight, ArrowLeft, Sparkles, 
  Lightbulb, AlertCircle, Award, Volume2, Check, Lock, FileAudio
} from 'lucide-react';
import { LESSONS_DATA } from '../data/lessonsData';
import LessonSlideViewer from './LessonSlideViewer';

// Shared UI components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-teal-50 text-teal-700 border-teal-200',
    formative: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[type] || styles.default} ${className}`}>
      {children}
    </span>
  );
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Interactive Dialogue Audio Player for Authentic WAV Recordings
const DialogueAudioPlayer = ({ audioUrl, title }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      window.speechSynthesis?.cancel();
      audioRef.current.play().catch(err => {
        console.warn('Dialogue audio playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-indigo-500/30 my-4 space-y-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause Dialogue' : 'Play Dialogue Audio'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded border border-blue-400/30">
                Workplace Dialogue Audio
              </span>
              {isPlaying && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-teal-400 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" /> Playing Dialogue Audio...
                </span>
              )}
            </div>
            <h5 className="font-bold text-sm text-white mt-0.5">
              {title || 'Listen to Authentic Workplace Dialogue'}
            </h5>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-indigo-200 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <span>{formatTime(currentTime)}</span>
          <span className="text-slate-500">/</span>
          <span>{formatTime(duration)}</span>
          <button
            type="button"
            onClick={restartAudio}
            className="p-1 rounded-md text-indigo-300 hover:text-white hover:bg-white/10 transition ml-1"
            title="Replay from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress scrubber bar */}
      <div className="space-y-1">
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 -mt-2 bg-transparent opacity-0 cursor-pointer block"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>0:00</span>
          <span className="text-slate-500">Click Play to listen & follow dialogue lines below</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default function InteractiveLessonView({ 
  lessonId = 1, 
  navigateTo, 
  studentState, 
  updateStudentState, 
  isBypass = false,
  mode = null,
  initialSection = null
}) {
  const lesson = LESSONS_DATA[lessonId] || LESSONS_DATA[1];
  
  const currentLessonProgress = studentState?.lessonsProgress?.[lessonId] || {
    isCompleted: false,
    sectionsCompleted: { situation: false, slides: false, learn: false, practice: false, review: false, speaking: false },
    reviewScore: null,
    bestReviewScore: null,
    speakingPracticeCompleted: false
  };

  const isCompleted = !!currentLessonProgress.isCompleted;
  const isReviewMode = isCompleted || mode === 'review';

  // Determine starting section based on saved progress and review mode
  const getStartingSection = () => {
    if (initialSection) return initialSection;
    if (isReviewMode) return 'situation';
    if (currentLessonProgress.sectionsCompleted?.review) return 'speaking';
    if (currentLessonProgress.sectionsCompleted?.practice) return 'review';
    if (currentLessonProgress.sectionsCompleted?.learn) return 'practice';
    if (currentLessonProgress.sectionsCompleted?.slides) return 'learn';
    if (currentLessonProgress.sectionsCompleted?.situation) return 'slides';
    return 'situation';
  };

  const [currentSection, setCurrentSection] = useState(getStartingSection);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceFeedback, setPracticeFeedback] = useState({});
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(currentLessonProgress.reviewScore !== null);
  const [selfAssessment, setSelfAssessment] = useState({ a: false, b: false, c: false });
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio prompt TTS player state
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);
  const [promptProgress, setPromptProgress] = useState(0);
  const [promptTime, setPromptTime] = useState(0);
  const promptTimerRef = useRef(null);

  // Audio Recording State for Student Response
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch student's existing submitted audio recording if already completed
  useEffect(() => {
    let isMounted = true;
    const fetchExistingSubmission = async () => {
      try {
        const res = await fetch('/api/submissions');
        const data = await res.json();
        const pCode = studentState?.id || studentState?.userId;
        const dbUserId = studentState?.userId;
        const unitId = lesson.unitId || `lesson_${lessonId}`;

        if (Array.isArray(data) && (pCode || dbUserId)) {
          const match = data.find(s => 
            s.unit_id === unitId && 
            ((pCode && (s.participant_code === pCode || s.blind_mask_code === pCode || s.user_id === pCode)) ||
             (dbUserId && s.user_id === dbUserId))
          );
          if (match && isMounted) {
            setExistingSubmission(match);
          }
        }
      } catch (e) {
        console.warn('Could not load existing submission:', e);
      }
    };

    if (isCompleted || isReviewMode) {
      fetchExistingSubmission();
    }
    return () => { isMounted = false; };
  }, [lessonId, studentState?.id, studentState?.userId, isCompleted, isReviewMode]);

  // Reset states when switching between lessons
  useEffect(() => {
    window.speechSynthesis.cancel();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingState('idle');
    setRecordingTime(0);
    setPracticeAnswers({});
    setPracticeFeedback({});
    setReviewAnswers({});
    setReviewSubmitted(currentLessonProgress.reviewScore !== null);
    setSelfAssessment({ a: false, b: false, c: false });
    setShowHint(false);
    setIsPlayingPrompt(false);
    setPromptProgress(0);
    setPromptTime(0);

    let def = initialSection;
    if (!def) {
      if (isReviewMode) def = 'situation';
      else if (currentLessonProgress.sectionsCompleted?.review) def = 'speaking';
      else if (currentLessonProgress.sectionsCompleted?.practice) def = 'review';
      else if (currentLessonProgress.sectionsCompleted?.learn) def = 'practice';
      else if (currentLessonProgress.sectionsCompleted?.slides) def = 'learn';
      else if (currentLessonProgress.sectionsCompleted?.situation) def = 'slides';
      else def = 'situation';
    }
    setCurrentSection(def);

    return () => {
      window.speechSynthesis.cancel();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      clearInterval(promptTimerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [lessonId, initialSection, mode]);

  // Audio prompt TTS player
  const togglePlayPrompt = () => {
    if (isPlayingPrompt) {
      window.speechSynthesis.cancel();
      setIsPlayingPrompt(false);
      clearInterval(promptTimerRef.current);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lesson.speaking.audioPrompt);
      const voices = window.speechSynthesis.getVoices();
      const engVoices = voices.filter(v => v.lang.startsWith('en-'));
      if (engVoices.length > 0) {
        utterance.voice = engVoices[0];
      }
      utterance.rate = 0.95;

      const estimatedDuration = Math.max(lesson.speaking.audioPrompt.split(' ').length * 0.45, 6);

      utterance.onstart = () => {
        setIsPlayingPrompt(true);
        setPromptTime(0);
        setPromptProgress(0);
        clearInterval(promptTimerRef.current);
        promptTimerRef.current = setInterval(() => {
          setPromptTime(prev => {
            const next = prev + 0.1;
            setPromptProgress(Math.min((next / estimatedDuration) * 100, 100));
            return next;
          });
        }, 100);
      };

      utterance.onend = () => {
        setIsPlayingPrompt(false);
        clearInterval(promptTimerRef.current);
        setPromptProgress(100);
        setPromptTime(estimatedDuration);
      };

      utterance.onerror = () => {
        setIsPlayingPrompt(false);
        clearInterval(promptTimerRef.current);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Microphone recording
  const startRecording = async () => {
    try {
      window.speechSynthesis.cancel();
      setIsPlayingPrompt(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      alert("Microphone access is required to record your response. Please allow microphone access in your browser settings and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(timerRef.current);
      setRecordingState('recorded');
    }
  };

  const recordAgain = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingState('idle');
    setRecordingTime(0);
    setSelfAssessment({ a: false, b: false, c: false });
  };

  const markSectionComplete = (section) => {
    const updatedLessons = { ...(studentState.lessonsProgress || {}) };
    const curr = { ...(updatedLessons[lessonId] || { sectionsCompleted: {} }) };
    curr.sectionsCompleted = { ...curr.sectionsCompleted, [section]: true };
    if (isCompleted) {
      curr.isCompleted = true;
    }
    updatedLessons[lessonId] = curr;
    
    updateStudentState('lessonsProgress', updatedLessons);
    if (lessonId === 1) {
      updateStudentState('lesson1State', curr);
    }
  };

  const handleNext = (nextSection) => {
    markSectionComplete(currentSection);
    setCurrentSection(nextSection);
    window.scrollTo(0, 0);
  };

  const completeLesson = async () => {
    if (isCompleted) {
      setCurrentSection('results');
      window.scrollTo(0, 0);
      return;
    }
    setIsSubmitting(true);
    markSectionComplete('speaking');
    
    const updatedLessons = { ...(studentState.lessonsProgress || {}) };
    const curr = { ...(updatedLessons[lessonId] || { sectionsCompleted: {} }) };
    curr.isCompleted = true;
    curr.speakingPracticeCompleted = true;
    curr.sectionsCompleted.speaking = true;
    updatedLessons[lessonId] = curr;
    
    updateStudentState('lessonsProgress', updatedLessons);
    if (lessonId === 1) {
      updateStudentState('lesson1State', curr);
    }

    // Audio upload to backend
    const uId = studentState?.userId || studentState?.id;
    const pCode = studentState?.id || studentState?.userId;

    if (audioBlob) {
      try {
        const formData = new FormData();
        if (uId) formData.append('userId', uId);
        if (pCode) formData.append('participant_id', pCode);
        formData.append('unit_id', lesson.unitId || `lesson_${lessonId}`);
        formData.append('duration_seconds', recordingTime || 15);
        formData.append('audio_file', audioBlob, `${pCode || uId}_lesson${lessonId}_speaking.webm`);
        formData.append('self_assessment', JSON.stringify(selfAssessment));
        await fetch('/api/submissions', { method: 'POST', body: formData });
      } catch (e) {
        console.warn('Backend lesson audio upload:', e);
      }
    }

    // Persistent progress update to SQLite
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uId || pCode,
          unitId: lesson.unitId || `lesson_${lessonId}`,
          status: 'completed',
          sectionsCompleted: curr.sectionsCompleted,
          reviewScore: curr.reviewScore
        })
      });
    } catch (e) {
      console.warn('Backend progress update:', e);
    }

    setIsSubmitting(false);
    setCurrentSection('results');
    window.scrollTo(0, 0);
  };

  // Section 1: Situation
  const renderSituation = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-8 border-t-4 border-t-blue-600 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Workplace Situation</h3>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            {lesson.company}
          </span>
        </div>

        <div className="space-y-4 text-slate-700">
          <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Role: {lesson.situation.role}
          </p>
          <p className="font-medium text-slate-800">{lesson.situation.intro}</p>
          <p className="leading-relaxed">{lesson.situation.scenario}</p>

          <div className="bg-blue-50/70 p-5 rounded-xl border border-blue-100 mt-4">
            <p className="font-bold text-blue-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600"/> In this lesson, you will learn to:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-blue-800 font-medium">
              {lesson.situation.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* Workplace Mistake vs Professional Contrast */}
          {lesson.situation.workplaceMistake && (
            <div className="pt-4 mt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Workplace Contrast Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <p className="text-xs font-bold text-red-700 uppercase mb-1">
                    {lesson.situation.workplaceMistake.bad.title}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 italic mb-2">
                    {lesson.situation.workplaceMistake.bad.quote}
                  </p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {lesson.situation.workplaceMistake.bad.bullets.map((b, idx) => (
                      <li key={idx}>x {b}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-800 uppercase mb-1">
                    {lesson.situation.workplaceMistake.good.title}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 italic mb-2">
                    {lesson.situation.workplaceMistake.good.quote}
                  </p>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    {lesson.situation.workplaceMistake.good.bullets.map((b, idx) => (
                      <li key={idx}>✓ {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <button 
          onClick={() => handleNext('slides')} 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
        >
          View Lesson Slides <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  // Section 2: Slides
  const renderSlides = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Curriculum Slides & Visual Guide</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">Interactive widescreen deck for workplace objectives, model dialogues, and rubrics.</p>
        </div>
        <Badge type="primary">Step 2 of 6</Badge>
      </div>

      <LessonSlideViewer lessonId={lessonId} />

      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <button 
          onClick={() => setCurrentSection('situation')} 
          className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-5 h-5"/> Back to Situation
        </button>
        <button 
          onClick={() => handleNext('learn')} 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
        >
          Continue to Language Focus <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  // Section 3: Learn
  const renderLearn = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Learn & Language Focus</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">Study target occupational vocabulary, grammar rules, and authentic model dialogues.</p>
        </div>
        <Badge type="primary">Step 3 of 6</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lesson.learn.cards.map((c, i) => (
          <Card key={i} className={`p-6 border-l-4 border-l-${c.color}-500 hover:shadow-md transition`}>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{c.title}</h4>
            <p className="text-sm text-slate-600 mb-4">{c.description}</p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-sm font-medium text-slate-800">
              {c.examples.map((ex, idx) => (
                <p key={idx} className="flex gap-2">
                  <CheckCircle className={`w-4 h-4 text-${c.color}-500 mt-0.5 shrink-0`}/> {ex}
                </p>
              ))}
            </div>
          </Card>
        ))}

        {/* Language Focus Box */}
        <Card className="p-6 md:col-span-2 border-l-4 border-l-amber-500 bg-amber-50/20">
          <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600"/> Language Focus: {lesson.learn.languageFocus.title}
          </h4>
          <p className="text-sm text-slate-700 mb-4 font-medium leading-relaxed">
            {lesson.learn.languageFocus.explanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase mb-2 tracking-wider">Avoid / Ineffective</p>
              <ul className="text-sm text-slate-800 space-y-2 font-medium">
                {lesson.learn.languageFocus.badExamples.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <p className="text-xs font-bold text-emerald-700 uppercase mb-2 tracking-wider">Professional & Effective</p>
              <ul className="text-sm text-slate-800 space-y-2 font-medium">
                {lesson.learn.languageFocus.goodExamples.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Model Dialogue */}
        {lesson.learn.modelDialogue && (
          <Card className="p-6 md:col-span-2 border-l-4 border-l-indigo-500 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b pb-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{lesson.learn.modelDialogue.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{lesson.learn.modelDialogue.context}</p>
              </div>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                Workplace Dialogue
              </span>
            </div>

            {/* Audio Dialogue Player */}
            <DialogueAudioPlayer 
              audioUrl={lesson.learn.modelDialogue.audioUrl || `/audio_dialogue/lesson_${lessonId}_dialogue.wav`}
              title={`Audio Dialogue: ${lesson.learn.modelDialogue.title}`}
            />

            <div className="space-y-3 my-4">
              {lesson.learn.modelDialogue.lines.map((l, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${l.speaker.startsWith('Agent') ? 'bg-blue-50/60 border-blue-200 ml-4' : 'bg-slate-50 border-slate-200 mr-4'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${l.speaker.startsWith('Agent') ? 'text-blue-800' : 'text-slate-700'}`}>
                      {l.speaker}
                    </span>
                    {l.purpose && (
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded text-slate-500 font-mono border border-slate-200">
                        {l.purpose}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-900 font-medium">"{l.text}"</p>
                </div>
              ))}
            </div>

            {lesson.learn.modelDialogue.keyTakeaways && (
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Key Analytical Takeaways:</p>
                {lesson.learn.modelDialogue.keyTakeaways.map((t, idx) => (
                  <p key={idx}>• {t}</p>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="flex justify-between mt-8 items-center pt-4 border-t border-slate-200">
        <button 
          onClick={() => setCurrentSection('slides')} 
          className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-5 h-5"/> Back to Slides
        </button>
        <button 
          onClick={() => handleNext('practice')} 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
        >
          Go to Practice <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  // Section 4: Formative Practice
  const renderPractice = () => {
    const handleAnswer = (qId, option) => {
      setPracticeAnswers(prev => ({ ...prev, [qId]: option.id }));
      setPracticeFeedback(prev => ({ 
        ...prev, 
        [qId]: { isCorrect: option.isCorrect, text: option.feedback } 
      }));
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{lesson.practice.title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{lesson.practice.subtitle}</p>
          </div>
          <Badge type="formative">Ungraded Learning</Badge>
        </div>
        <p className="text-slate-600 font-medium">{lesson.practice.description}</p>

        {lesson.practice.questions.map((q, idx) => (
          <Card key={q.id || idx} className="p-6 shadow-sm border-blue-100">
            <p className="font-bold text-slate-900 text-base mb-4 leading-relaxed">
              {idx + 1}. {q.prompt}
            </p>

            <div className="space-y-3">
              {q.options.map(opt => {
                const isSelected = practiceAnswers[q.id] === opt.id;
                let optClass = "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-800";
                if (isSelected) {
                  optClass = opt.isCorrect 
                    ? "border-teal-500 bg-teal-50 text-teal-900 font-bold" 
                    : "border-red-400 bg-red-50 text-red-900";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-sm transition-all flex items-start gap-3 ${optClass}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      {opt.id}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {practiceFeedback[q.id] && (
              <div className={`mt-4 p-4 rounded-xl border text-sm font-medium animate-fade-in ${practiceFeedback[q.id].isCorrect ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  {practiceFeedback[q.id].isCorrect ? <CheckCircle className="w-4 h-4 text-teal-600"/> : <AlertCircle className="w-4 h-4 text-red-600"/>}
                  {practiceFeedback[q.id].isCorrect ? 'Well Done!' : 'Try Again:'}
                </p>
                <p>{practiceFeedback[q.id].text}</p>
              </div>
            )}
          </Card>
        ))}

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <button 
            onClick={() => setCurrentSection('learn')} 
            className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-5 h-5"/> Back to Learn
          </button>
          <button 
            onClick={() => handleNext('review')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
          >
            Go to Review Quiz <ArrowRight className="w-5 h-5"/>
          </button>
        </div>
      </div>
    );
  };

  // Section 4: Lesson Review Quiz
  const renderReview = () => {
    const handleSelectOption = (qId, optionId) => {
      if (reviewSubmitted) return;
      setReviewAnswers(prev => ({ ...prev, [qId]: optionId }));
    };

    const submitReview = () => {
      let correctCount = 0;
      lesson.review.questions.forEach(q => {
        const selectedId = reviewAnswers[q.id];
        const correctOpt = q.options.find(o => o.isCorrect);
        if (correctOpt && selectedId === correctOpt.id) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / lesson.review.questions.length) * 100);
      
      const updatedLessons = { ...(studentState.lessonsProgress || {}) };
      const curr = { ...(updatedLessons[lessonId] || { sectionsCompleted: {} }) };
      if (isCompleted) {
        curr.isCompleted = true;
        curr.reviewScore = Math.max(curr.reviewScore || 0, score);
      } else {
        curr.reviewScore = score;
      }
      if (curr.bestReviewScore === null || score > curr.bestReviewScore) {
        curr.bestReviewScore = score;
      }
      curr.sectionsCompleted.review = true;
      updatedLessons[lessonId] = curr;
      
      updateStudentState('lessonsProgress', updatedLessons);
      if (lessonId === 1) {
        updateStudentState('lesson1State', curr);
      }
      setReviewSubmitted(true);
    };

    const retakeReview = () => {
      setReviewAnswers({});
      setReviewSubmitted(false);
    };

    const allAnswered = lesson.review.questions.every(q => reviewAnswers[q.id] !== undefined);
    const scoreVal = currentLessonProgress.reviewScore ?? 0;
    const isPassing = scoreVal >= 60;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{lesson.review.title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Knowledge Check (3 Questions • Passing score: 60%)</p>
          </div>
          <Badge type="formative">Knowledge Check</Badge>
        </div>

        {reviewSubmitted && (
          <div className={`p-6 rounded-xl border text-center ${isPassing ? 'bg-teal-50 border-teal-200' : 'bg-amber-50 border-amber-200'}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Score</p>
            <p className={`text-4xl font-black ${isPassing ? 'text-teal-700' : 'text-amber-700'}`}>
              {scoreVal}%
            </p>
            <p className="text-sm font-medium mt-2 text-slate-700">
              {isPassing 
                ? 'Great mastery! You have met the review passing criteria.' 
                : 'Formative check completed. You may review the explanations below or retake the quiz.'}
            </p>
            {!isPassing && (
              <button 
                onClick={retakeReview} 
                className="mt-3 text-xs bg-white text-slate-700 px-4 py-1.5 rounded-lg border border-slate-300 font-bold hover:bg-slate-100 transition shadow-sm"
              >
                Retake Quiz
              </button>
            )}
          </div>
        )}

        {lesson.review.questions.map((q, idx) => (
          <Card key={q.id || idx} className="p-6">
            <p className="font-bold text-slate-900 text-sm mb-3">
              {idx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map(opt => {
                const isSelected = reviewAnswers[q.id] === opt.id;
                let optClass = "border-slate-200 hover:border-blue-400";
                if (reviewSubmitted) {
                  if (opt.isCorrect) optClass = "border-teal-500 bg-teal-50 text-teal-900 font-bold";
                  else if (isSelected && !opt.isCorrect) optClass = "border-red-400 bg-red-50 text-red-900";
                } else if (isSelected) {
                  optClass = "border-blue-600 bg-blue-50 text-blue-900 font-bold";
                }

                return (
                  <button
                    key={opt.id}
                    disabled={reviewSubmitted}
                    onClick={() => handleSelectOption(q.id, opt.id)}
                    className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${optClass}`}
                  >
                    <span>{opt.id}) {opt.text}</span>
                    {reviewSubmitted && opt.isCorrect && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>
            {reviewSubmitted && q.explanation && (
              <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-200 font-medium">
                💡 <span className="font-bold">Explanation:</span> {q.explanation}
              </p>
            )}
          </Card>
        ))}

        {!reviewSubmitted ? (
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button 
              onClick={() => setCurrentSection('practice')} 
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5"/> Back to Practice
            </button>
            <button 
              disabled={!allAnswered}
              onClick={submitReview}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition-all"
            >
              Submit Review Quiz
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button 
              onClick={() => setCurrentSection('practice')} 
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5"/> Back to Practice
            </button>
            <button 
              onClick={() => handleNext('speaking')} 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
            >
              Proceed to Speaking Challenge <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Section 5: Speaking Challenge
  const renderSpeaking = () => {
    const isReadyToComplete = recordingState === 'recorded' && Object.values(selfAssessment).filter(Boolean).length >= 2;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{lesson.speaking.title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{lesson.speaking.workplace}</p>
          </div>
          <Badge type="primary">Spoken Interaction</Badge>
        </div>

        {/* Review Mode Banner */}
        {isCompleted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 flex items-start gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-sm text-emerald-900">Speaking Activity Completed (Review Mode)</h5>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Submission Finalized
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Your spoken response for Lesson {lesson.id} has already been recorded and submitted for instructor evaluation. Audio resubmission is disabled. You can review the customer audio prompt, scaffolding formulas, and model dialogues below.
              </p>
            </div>
          </div>
        )}

        {/* Customer Call Card */}
        <Card className="p-6 bg-slate-900 text-white border-none shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-sm font-bold text-slate-300">Inbound Call: {lesson.speaking.customerName}</p>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              Duration Target: {lesson.speaking.timeLimit}s
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Customer Audio Prompt:</p>
            <p className="text-base text-white font-medium italic bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              "{lesson.speaking.audioPrompt}"
            </p>

            {/* In-Browser SpeechSynthesis Audio Player */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex items-center gap-4">
              <button
                onClick={togglePlayPrompt}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md transition"
              >
                {isPlayingPrompt ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 ml-0.5"/>}
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold flex items-center gap-1 text-teal-300">
                    <Volume2 className="w-3.5 h-3.5"/> {isPlayingPrompt ? 'Playing Customer Voice...' : 'Play Customer Prompt'}
                  </span>
                  <span>{formatTime(promptTime)}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 transition-all duration-100" style={{ width: `${promptProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Task Objective */}
        <Card className="p-6 border-l-4 border-l-blue-600">
          <h4 className="font-bold text-slate-900 text-sm mb-2">Your Task:</h4>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{lesson.speaking.taskGoal}</p>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {showHint ? 'Hide Response Scaffolding' : 'Show Scaffolding & Sentence Starters'}
            </button>

            {showHint && (
              <div className="mt-3 p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900 animate-fade-in">
                <p className="font-bold uppercase tracking-wider text-[10px] text-amber-700">Recommended Sentence Formulas:</p>
                {lesson.speaking.hints.map((h, i) => (
                  <p key={i}>• {h}</p>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Microphone Audio Recorder / Submission Preserved Card */}
        {isCompleted ? (
          <Card className="p-6 text-center bg-slate-50 border border-slate-200">
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Spoken response submitted
              </div>

              {existingSubmission?.audio_url ? (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <FileAudio className="w-3.5 h-3.5 text-indigo-600" />
                    My Recorded Response ({existingSubmission.duration_seconds || 15}s)
                  </span>
                  <audio controls src={existingSubmission.audio_url} className="w-full h-8" />
                </div>
              ) : audioUrl ? (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <FileAudio className="w-3.5 h-3.5 text-indigo-600" />
                    Session Audio Recording
                  </span>
                  <audio controls src={audioUrl} className="w-full h-8" />
                </div>
              ) : (
                <div className="p-3 bg-slate-100 rounded-xl text-slate-500 text-xs font-medium italic">
                  Spoken recording preserved on research evaluation server.
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  <strong>Single-Take Protocol:</strong> Audio re-recording and resubmission are blocked to preserve evaluation integrity.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-300">
            <p className="text-sm font-bold text-slate-800 mb-1">Record Your Spoken Response</p>
            <p className="text-xs text-slate-500 mb-6">Press Record, speak into your microphone, and press Stop when finished.</p>

            {recordingState === 'idle' && (
              <div>
                <button 
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition shadow-lg mx-auto"
                >
                  <Mic className="w-8 h-8" />
                </button>
                <p className="text-xs font-bold text-slate-600 mt-3">Click to Start Recording</p>
              </div>
            )}

            {recordingState === 'recording' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-red-600 animate-ping"></span>
                  <span className="text-2xl font-black font-mono text-red-600">{formatTime(recordingTime)}</span>
                </div>
                <p className="text-xs font-bold text-slate-600">Recording live... Speak clearly.</p>
                <button 
                  onClick={stopRecording}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 mx-auto shadow-md"
                >
                  <StopCircle className="w-5 h-5 text-red-400" /> Stop Recording
                </button>
              </div>
            )}

            {recordingState === 'recorded' && (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" /> Recording captured ({formatTime(recordingTime)})
                </div>

                {audioUrl && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <audio controls src={audioUrl} className="w-full h-8" />
                  </div>
                )}

                <button 
                  onClick={recordAgain}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-record Response
                </button>
              </div>
            )}
          </Card>
        )}

        {/* Self-Assessment Checklist */}
        <Card className="p-6 border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600"/> Self-Assessment Checklist
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            {isCompleted ? 'Criteria evaluated for this speaking challenge:' : 'Check the criteria you achieved in your recording before submitting:'}
          </p>
          <div className="space-y-2.5">
            {lesson.speaking.checklist.map((item, idx) => {
              const key = idx === 0 ? 'a' : idx === 1 ? 'b' : 'c';
              return (
                <label key={idx} className={`flex items-start gap-3 text-xs ${isCompleted ? 'cursor-default text-slate-800' : 'cursor-pointer text-slate-700'}`}>
                  <input 
                    type="checkbox"
                    checked={isCompleted ? true : selfAssessment[key]}
                    disabled={isCompleted}
                    onChange={(e) => setSelfAssessment(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-80"
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
        </Card>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <button 
            onClick={() => setCurrentSection('review')} 
            className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-5 h-5"/> Back to Review
          </button>
          {isCompleted ? (
            <button 
              onClick={() => {
                setCurrentSection('results');
                window.scrollTo(0, 0);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
            >
              View Lesson Results <ArrowRight className="w-5 h-5"/>
            </button>
          ) : (
            <button 
              disabled={!isReadyToComplete || isSubmitting}
              onClick={completeLesson}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Complete Lesson & Save Recording'} <CheckCircle className="w-5 h-5"/>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Section 6: Results
  const renderResults = () => {
    const hasNextLesson = lessonId < 8;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-center py-6">
        <Card className="p-8 border-t-4 border-t-teal-500 shadow-lg">
          <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-teal-100 shadow-inner">
            <Sparkles className="w-10 h-10" />
          </div>
          <Badge type="success" className="mb-2">Module Completed</Badge>
          <h3 className="text-3xl font-black text-slate-900 mt-2">Lesson {lessonId} Mastery!</h3>
          <p className="text-base text-slate-600 font-medium mt-2">{lesson.title}</p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6 text-left space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Milestones Achieved:</p>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500"/> Lesson Review Score:
              </span>
              <span className="font-black text-slate-900">{currentLessonProgress.reviewScore || 100}%</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500"/> Speaking Simulation:
              </span>
              <span className="font-bold text-teal-700">Recorded & Submitted</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500"/> Unit Status:
              </span>
              <span className="font-bold text-slate-900">100% Complete</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                setCurrentSection('situation');
                window.scrollTo(0, 0);
              }}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Lesson & Slides</span>
            </button>
            <button 
              onClick={() => navigateTo('student-dashboard')}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition"
            >
              Return to Dashboard
            </button>
            {hasNextLesson ? (
              <button 
                onClick={() => navigateTo('lesson', { lessonId: lessonId + 1 })}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md"
              >
                Continue to Lesson {lessonId + 1} <ArrowRight className="w-4 h-4"/>
              </button>
            ) : (
              <button 
                onClick={() => navigateTo('post-test')}
                className="bg-teal-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Post-test <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const sections = [
    { id: 'situation', label: 'Situation' },
    { id: 'slides', label: 'Slides' },
    { id: 'learn', label: 'Learn' },
    { id: 'practice', label: 'Practice' },
    { id: 'review', label: 'Review' },
    { id: 'speaking', label: 'Speaking' },
    { id: 'results', label: 'Results' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Section Progress */}
      <header className="border-b pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge type="primary">Lesson {lesson.id}</Badge>
            <span className="text-xs text-slate-400 font-medium">({lesson.duration})</span>
            {isCompleted && (
              <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed • Review Mode
              </span>
            )}
          </div>
          {isBypass && (
            <span className="text-[10px] bg-amber-400/20 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-300">
              Bypass Active
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{lesson.title}</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Focus: {lesson.focus}</p>

        {/* Section Breadcrumbs */}
        <div className="flex items-center justify-between mt-6 max-w-xl mx-auto">
          {sections.map((sec, index) => {
            const isPast = currentLessonProgress.sectionsCompleted?.[sec.id] || sections.findIndex(s => s.id === currentSection) > index;
            const isCurrent = currentSection === sec.id;
            const isClickable = isBypass || isReviewMode || isPast || isCurrent;

            return (
              <button
                key={sec.id}
                type="button"
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    window.speechSynthesis.cancel();
                    setCurrentSection(sec.id);
                    window.scrollTo(0, 0);
                  }
                }}
                className={`flex flex-col items-center group focus:outline-none transition-transform ${
                  !isClickable ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:scale-105'
                }`}
                title={isClickable ? `Jump to ${sec.label}` : 'Complete previous sections to unlock'}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isCurrent 
                    ? 'bg-blue-600 border-blue-200 text-white shadow-md ring-2 ring-blue-400/30' 
                    : isPast 
                    ? 'bg-teal-500 border-teal-500 text-white group-hover:bg-teal-600' 
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  {isPast && !isCurrent ? <Check className="w-4 h-4"/> : index + 1}
                </div>
                <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider transition-colors ${
                  isCurrent ? 'text-blue-700' : isPast ? 'text-slate-600 group-hover:text-slate-900' : 'text-slate-400'
                }`}>
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {currentSection === 'situation' && renderSituation()}
      {currentSection === 'slides' && renderSlides()}
      {currentSection === 'learn' && renderLearn()}
      {currentSection === 'practice' && renderPractice()}
      {currentSection === 'review' && renderReview()}
      {currentSection === 'speaking' && renderSpeaking()}
      {currentSection === 'results' && renderResults()}
    </div>
  );
}
