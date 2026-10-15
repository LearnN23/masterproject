import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, LayoutDashboard, Mic, Play, Pause, StopCircle, 
  CheckCircle, FileText, Users, Search, ChevronRight, AlertCircle, 
  Settings, LogOut, MessageSquare, Award, BookCheck, Info,
  Headphones, Send, RotateCcw, User, GraduationCap, ArrowRight,
  ShieldCheck, ListChecks, ArrowLeft, ThumbsUp, Lightbulb, UserCheck, CheckSquare,
  BarChart3, FileAudio, ChevronLeft, Download, Sparkles
} from 'lucide-react';
import InteractiveLessonView from './components/InteractiveLessonView';
import AssessmentView from './components/AssessmentView';
import DataExport from './components/DataExport';
import StudentDashboard from './components/StudentDashboard';
import RaterDashboard from './components/RaterDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import AdminDashboard from './components/AdminDashboard';
import ExpertDashboard from './components/ExpertDashboard';
import { 
  SubmissionReviewList, 
  SubmissionReviewDetail, 
  InstructorResultsComparison, 
  ExpertEvaluationView 
} from './components/InstructorEvaluationSuite';
import { RUBRIC_CRITERIA_25, getCefrRating } from './data/assessmentsData';

// --- UTILITY COMPONENTS FOR AUDIO ---

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Player for Customer Audio using SpeechSynthesis for reliable prototype playback
const CustomerAudioPlayer = ({ text, estimatedDurationSec = 10, isFemale = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      clearInterval(timerRef.current);
    } else {
      window.speechSynthesis.cancel(); // Clear any existing
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to select a decent English voice
      const voices = window.speechSynthesis.getVoices();
      const engVoices = voices.filter(v => v.lang.startsWith('en-'));
      if (engVoices.length > 0) {
        // Try to match gender roughly if possible, otherwise use default
        utterance.voice = engVoices.find(v => isFemale ? v.name.includes('Female') : v.name.includes('Male')) || engVoices[0];
      }
      utterance.rate = 0.95; // Slightly slower for clarity

      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentTime(0);
        setProgress(0);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const next = prev + 0.1;
            setProgress(Math.min((next / estimatedDurationSec) * 100, 100));
            return next;
          });
        }, 100);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        setProgress(100);
        setCurrentTime(estimatedDurationSec);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        clearInterval(timerRef.current);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const replay = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    clearInterval(timerRef.current);
    setCurrentTime(0);
    setProgress(0);
    setTimeout(togglePlay, 100);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-100 rounded-xl p-4 flex items-center gap-4 border border-slate-200">
      <button 
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-md transition-colors shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>
      <div className="flex-1">
        <div className="h-2 bg-slate-300 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
          <span>{formatTime(currentTime)}</span>
          <button onClick={replay} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3 h-3"/> Replay
          </button>
          <span>{formatTime(estimatedDurationSec)}</span>
        </div>
      </div>
    </div>
  );
};

// Player for Student Recorded Audio Blob
const RecordedAudioPlayer = ({ src, colorClass = "bg-indigo-600", lightColorClass = "bg-indigo-50", hoverClass = "hover:bg-indigo-700", textColorClass = "text-indigo-900" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const replay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  if (!src) return <div className="text-sm text-slate-500 italic p-4">Audio recording not found.</div>;

  return (
    <div className={`${lightColorClass} border border-slate-200 rounded-xl p-4 flex flex-col gap-3 w-full`}>
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata} 
        onEnded={() => setIsPlaying(false)}
        className="hidden" 
      />
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full ${colorClass} text-white flex items-center justify-center ${hoverClass} shadow-md transition-colors shrink-0`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
        <div className="flex-1">
          <div className="h-2 bg-slate-300 rounded-full overflow-hidden relative">
             <div className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-100 ease-linear`} style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
            <span>{formatTime(currentTime)}</span>
            <button onClick={replay} className={`hover:${textColorClass} flex items-center gap-1 transition-colors`}>
              <RotateCcw className="w-3 h-3"/> Replay
            </button>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DATA CONSTANTS ---

const MOCK_STUDENTS = [
  { id: 'STU-001', name: 'Nadia Hassan', progress: 12, preTest: 14, postTest: null, status: 'Learning', reviewStatus: 'To Review' },
  { id: 'STU-002', name: 'Kittipong Srikul', progress: 100, preTest: 16, postTest: 21, status: 'Completed', reviewStatus: 'Reviewed' },
  { id: 'STU-003', name: 'Aisha Rahman', progress: 25, preTest: 12, postTest: null, status: 'Learning', reviewStatus: 'Pending' },
  { id: 'STU-004', name: 'Chaiwat Prom', progress: 0, preTest: null, postTest: null, status: 'Not Started', reviewStatus: 'N/A' },
];

const LESSONS = [
  { id: 1, title: 'Responding to Customer Enquiries', focus: 'Greetings, offering help, empathy, modal verbs' },
  { id: 2, title: 'Identifying and Clarifying Technical Problems', focus: 'Clarification questions, identifying issues' },
  { id: 3, title: 'Explaining Troubleshooting Procedures', focus: 'Sequencing, step-by-step instructions' },
  { id: 4, title: 'Handling Customer Complaints', focus: 'Apologizing, acknowledging concerns' },
  { id: 5, title: 'Providing Clear Instructions', focus: 'Imperatives, checking understanding' },
  { id: 6, title: 'Escalating Unresolved Issues', focus: 'Professional escalation, next steps' },
  { id: 7, title: 'Support Tickets and Technical Documentation', focus: 'Concise notes, CRM documentation' },
  { id: 8, title: 'Complete Online Customer Support Interaction', focus: 'Integrated simulation' },
];

// NEW FINAL 25-POINT SPEAKING RUBRIC
const RUBRIC_CRITERIA = [
  { id: 'task_achievement', label: '1. Task Achievement', description: 'Effectively completes the required customer-support task and addresses the technical problem.' },
  { id: 'interactive_communication', label: '2. Interactive Communication', description: 'Responds appropriately, maintains interaction, clarifies information when necessary.' },
  { id: 'vocabulary', label: '3. Vocabulary', description: 'Use of appropriate occupational, technical-support, and customer-service vocabulary.' },
  { id: 'grammar', label: '4. Grammar', description: 'Accuracy and appropriateness of grammatical structures used during the speaking task.' },
  { id: 'pronunciation_fluency', label: '5. Pronunciation & Fluency', description: 'Pronunciation, intelligibility, speech flow, and fluency during the speaking task.' },
];

const IllustrationDeskWorker = ({ isFemale = false, isMuslim = false }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#f0f9ff" rx="16" />
    <rect x="20" y="120" width="160" height="80" fill="#cbd5e1" />
    <rect x="60" y="60" width="80" height="50" fill="#334155" rx="4" />
    <rect x="95" y="110" width="10" height="10" fill="#475569" />
    {isMuslim ? (
      <g>
        <path d="M65,120 Q100,60 135,120 Z" fill="#0f172a" />
        <circle cx="100" cy="70" r="18" fill="#0f172a" />
        <path d="M70,120 Q50,150 40,180 L160,180 Q150,150 130,120 Z" fill="#1e3a8a" />
        <path d="M65,115 Q100,160 135,115 Z" fill="#0f172a" />
      </g>
    ) : isFemale ? (
      <g>
        <path d="M80,85 Q100,110 120,85 Q125,60 100,50 Q75,60 80,85 Z" fill="#451a03" />
        <circle cx="100" cy="70" r="16" fill="#d4a373" />
        <path d="M70,120 Q60,150 50,180 L150,180 Q140,150 130,120 Z" fill="#0ea5e9" />
        <path d="M85,120 L115,120 L100,135 Z" fill="#bae6fd" />
      </g>
    ) : (
      <g>
        <path d="M85,75 Q100,45 115,75 Z" fill="#1f2937" />
        <circle cx="100" cy="70" r="15" fill="#fbcfe8" />
        <path d="M75,120 Q60,150 50,180 L150,180 Q140,150 125,120 Z" fill="#e2e8f0" />
        <path d="M75,120 L100,105 L125,120 Z" fill="#cbd5e1" /> 
      </g>
    )}
    <path d="M85,70 C80,80 75,90 85,95" fill="none" stroke="#64748b" strokeWidth="3" />
  </svg>
);

const Badge = ({ children, type = 'default', className = '' }) => {
  const colors = {
    default: 'bg-slate-100 text-slate-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-teal-100 text-teal-800',
    warning: 'bg-amber-100 text-amber-800',
    research: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    formative: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-block ${colors[type]} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // { id, username, name, role, cohort_group, participant_code }
  const [activeRoleView, setActiveRoleView] = useState('student'); // 'student' or 'instructor'
  const [currentView, setCurrentView] = useState('login');
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null); 

  // Unified Student State with 8-Lesson Progress
  const [studentState, setStudentState] = useState({
    id: 'STU-1024',
    name: 'Nadia Hassan',
    consent: { status: false, version: 'v1.0', agreedAt: null, method: null },
    preTestCompleted: false,
    preTestAudioUrl: null, // Stores actual recorded blob URL
    postTestCompleted: false,
    postTestAudioUrl: null, // Stores actual recorded blob URL
    lessonsProgress: {
      1: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      2: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      3: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      4: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      5: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      6: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      7: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
      8: { isCompleted: false, sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false }, reviewScore: null, bestReviewScore: null, speakingPracticeCompleted: false },
    },
    lesson1State: {
      isCompleted: false,
      sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false },
      reviewScore: null,
      bestReviewScore: null,
      speakingPracticeCompleted: false
    }
  });

  const [instructorFeedback, setInstructorFeedback] = useState(null);

  // Determine if current user bypasses all sequential gates (Tester, Expert/Professor, Admin)
  const isBypass = currentUser && (
    currentUser.role === 'tester' || 
    currentUser.role === 'expert' || 
    currentUser.role === 'admin' ||
    currentUser.cohort_group === 'Group_Pilot_Experts' ||
    currentUser.cohort_group === 'Group_Pilot'
  );

  // Sequential gate verification for lessons 1 to 8
  const isLessonLocked = (lessonNum) => {
    if (isBypass) return false;
    if (!studentState.preTestCompleted) return true;
    if (lessonNum === 1) return false;
    const prev = studentState.lessonsProgress?.[lessonNum - 1];
    return !prev?.isCompleted;
  };

  // Sequential gate verification for Post-test
  const isPostTestLocked = () => {
    if (isBypass) return false;
    const l8 = studentState.lessonsProgress?.[8];
    return !l8?.isCompleted;
  };

  const navigateTo = (view, data = null) => {
    // Stop any playing speech synthesis when navigating
    window.speechSynthesis.cancel();
    
    // In student mode, enforce consent lock unless bypass is active
    if (view === 'pre-test' && !studentState.consent.status && !isBypass) {
      setCurrentView('consent');
      return;
    }
    setCurrentView(view);
    if (data && data.lessonId) setActiveLesson(data.lessonId);
    if (data && data.studentId) setSelectedStudentId(data.studentId);
    if (data && data.submission) setSelectedSubmission(data.submission);
    window.scrollTo(0,0);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'student' || user.role === 'tester') {
      setActiveRoleView('student');
      setCurrentView('student-dashboard');
      setStudentState(prev => ({
        ...prev,
        id: user.participant_code || 'STU-1024',
        name: user.name || 'Nadia Hassan'
      }));
    } else if (user.role === 'instructor') {
      setActiveRoleView('instructor');
      setCurrentView('instructor-dashboard');
    } else if (user.role === 'rater' || user.role.startsWith('rater')) {
      setActiveRoleView('rater');
      setCurrentView('rater-dashboard');
    } else if (user.role === 'admin') {
      setActiveRoleView('admin');
      setCurrentView('admin-dashboard');
    } else if (user.role === 'expert') {
      setActiveRoleView('expert');
      setCurrentView('expert-dashboard');
      setStudentState(prev => ({
        ...prev,
        id: user.participant_code || 'EXPERT-01',
        name: user.name || 'Prof. Evaluation Expert'
      }));
    } else {
      setActiveRoleView('student');
      setCurrentView('student-dashboard');
    }
  };

  const handleSelectRoleWalkthrough = (targetRole) => {
    if (targetRole === 'student') {
      setActiveRoleView('student');
      setCurrentView('student-dashboard');
    } else if (targetRole === 'instructor') {
      setActiveRoleView('instructor');
      setCurrentView('instructor-dashboard');
    } else if (targetRole === 'rater') {
      setActiveRoleView('rater');
      setCurrentView('rater-dashboard');
    } else if (targetRole === 'admin') {
      setActiveRoleView('admin');
      setCurrentView('admin-dashboard');
    } else if (targetRole === 'expert') {
      setActiveRoleView('expert');
      setCurrentView('expert-dashboard');
    }
  };

  const handleLogout = () => {
    window.speechSynthesis.cancel();
    setCurrentUser(null);
    setActiveRoleView('student');
    setCurrentView('login');
  };

  const updateStudentState = (key, value) => {
    setStudentState(prev => ({ ...prev, [key]: value }));
  };

  if (!currentUser && currentView === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 relative">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 text-white mb-1">
            <Headphones className="w-8 h-8 text-teal-400" />
            <h1 className="text-xl font-bold leading-tight">TechSupport<br/><span className="text-sm font-normal text-blue-300">English EOP</span></h1>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Research Platform</span>
            {isBypass && (
              <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                Bypass Active
              </span>
            )}
          </div>
        </div>

        {/* Role Indicator / Switcher for Expert */}
        {currentUser?.role === 'expert' && (
          <div className="mx-4 mb-3 p-2.5 bg-purple-950/80 rounded-xl border border-purple-500/40 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 mb-1.5 px-0.5">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Committee Mode</span>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-bold">Unlocked</span>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg text-center">
              <button 
                onClick={() => handleSelectRoleWalkthrough('expert')}
                className={`py-1 text-[11px] font-bold rounded transition-all ${activeRoleView === 'expert' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Expert Hub
              </button>
              <button 
                onClick={() => handleSelectRoleWalkthrough('student')}
                className={`py-1 text-[11px] font-bold rounded transition-all ${activeRoleView === 'student' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Student View
              </button>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          {activeRoleView === 'student' && (
            <>
              <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'student-dashboard'} onClick={() => navigateTo('student-dashboard')} />
              <NavItem icon={Info} label="Orientation" active={currentView === 'orientation'} onClick={() => navigateTo('orientation')} />
              {(!studentState.consent.status || isBypass) && (
                <NavItem icon={ShieldCheck} label="Research Consent" active={currentView === 'consent'} onClick={() => navigateTo('consent')} />
              )}
              <NavItem 
                icon={Mic} 
                label="Pre-test" 
                active={currentView === 'pre-test'} 
                onClick={() => navigateTo('pre-test')} 
                locked={!isBypass && !studentState.consent.status} 
              />
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Learning Modules</span>
                {isBypass && <span className="text-[9px] text-teal-400 font-bold bg-teal-400/10 px-1.5 py-0.5 rounded">All Unlocked</span>}
              </div>
              {LESSONS.map(l => (
                <NavItem 
                  key={l.id} 
                  icon={BookOpen} 
                  label={`Lesson ${l.id}`} 
                  active={currentView === 'lesson' && activeLesson === l.id} 
                  onClick={() => navigateTo('lesson', { lessonId: l.id })}
                  locked={isLessonLocked(l.id)} 
                />
              ))}
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments</div>
              <NavItem 
                icon={Mic} 
                label="Post-test" 
                active={currentView === 'post-test'} 
                onClick={() => navigateTo('post-test')} 
                locked={isPostTestLocked()} 
              />
              <NavItem icon={Award} label="My Results & Grades" active={currentView === 'student-dashboard'} onClick={() => navigateTo('student-dashboard')} />
            </>
          )}

          {activeRoleView === 'instructor' && (
            <>
              <NavItem icon={LayoutDashboard} label="Instructor Dashboard" active={currentView === 'instructor-dashboard'} onClick={() => navigateTo('instructor-dashboard')} />
              <NavItem icon={Mic} label="Audio Grading Queue" active={currentView === 'instructor-dashboard'} onClick={() => navigateTo('instructor-dashboard')} />
              <NavItem icon={Users} label="Student Roster" active={currentView === 'students' || currentView === 'student-progress'} onClick={() => navigateTo('students')} />
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Research Analytics</div>
              <NavItem icon={BarChart3} label="Pre-test Results" active={currentView === 'pre-test-results'} onClick={() => navigateTo('pre-test-results')} />
              <NavItem icon={BarChart3} label="Post-test Results" active={currentView === 'post-test-results'} onClick={() => navigateTo('post-test-results')} />
              <NavItem icon={Award} label="Calibration Matrix" active={currentView === 'instructor-results'} onClick={() => navigateTo('instructor-results')} />
              <NavItem icon={Download} label="Research Data & SPSS" active={currentView === 'data-export'} onClick={() => navigateTo('data-export')} />
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Curriculum</div>
              <NavItem icon={BookCheck} label="Module Overview" active={currentView === 'module-overview'} onClick={() => navigateTo('module-overview')} />
              <NavItem icon={FileText} label="Expert Evaluation" active={currentView === 'expert-eval'} onClick={() => navigateTo('expert-eval')} />
              <NavItem icon={Search} label="Research Context" active={currentView === 'research'} onClick={() => navigateTo('research')} />
            </>
          )}

          {activeRoleView === 'rater' && (
            <>
              <NavItem icon={LayoutDashboard} label="Rater Dashboard" active={currentView === 'rater-dashboard'} onClick={() => navigateTo('rater-dashboard')} />
              <NavItem icon={Mic} label="Audio Review Queue" active={currentView === 'rater-dashboard'} onClick={() => navigateTo('rater-dashboard')} />
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Research Reference</div>
              <NavItem icon={BookCheck} label="Module Overview" active={currentView === 'module-overview'} onClick={() => navigateTo('module-overview')} />
              <NavItem icon={Search} label="Research Context" active={currentView === 'research'} onClick={() => navigateTo('research')} />
              <NavItem icon={Download} label="Export SPSS CSV" active={false} onClick={() => window.open('/api/export/spss', '_blank')} />
            </>
          )}

          {activeRoleView === 'admin' && (
            <>
              <NavItem icon={LayoutDashboard} label="Admin Console" active={currentView === 'admin-dashboard'} onClick={() => navigateTo('admin-dashboard')} />
              <NavItem icon={Users} label="User Management" active={currentView === 'admin-dashboard'} onClick={() => navigateTo('admin-dashboard')} />
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data & Exports</div>
              <NavItem icon={Download} label="Research Data & SPSS" active={currentView === 'data-export'} onClick={() => navigateTo('data-export')} />
              <NavItem icon={Download} label="Export SPSS CSV" active={false} onClick={() => window.open('/api/export/spss', '_blank')} />
              <NavItem icon={Search} label="Research Context" active={currentView === 'research'} onClick={() => navigateTo('research')} />
            </>
          )}

          {activeRoleView === 'expert' && (
            <>
              <NavItem icon={Sparkles} label="Expert Hub" active={currentView === 'expert-dashboard'} onClick={() => navigateTo('expert-dashboard')} />
              <div className="pt-4 pb-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">Role Walkthroughs</div>
              <NavItem icon={GraduationCap} label="Student (Zero Locks)" active={false} onClick={() => handleSelectRoleWalkthrough('student')} />
              <NavItem icon={Award} label="Instructor Grading" active={false} onClick={() => handleSelectRoleWalkthrough('instructor')} />
              <NavItem icon={Mic} label="Rater Calibration" active={false} onClick={() => handleSelectRoleWalkthrough('rater')} />
              <NavItem icon={ShieldCheck} label="Admin Console" active={false} onClick={() => handleSelectRoleWalkthrough('admin')} />
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Curriculum & Data</div>
              <NavItem icon={BookCheck} label="Module Overview" active={currentView === 'module-overview'} onClick={() => navigateTo('module-overview')} />
              <NavItem icon={Download} label="Export SPSS CSV" active={false} onClick={() => window.open('/api/export/spss', '_blank')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-teal-300 font-bold shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-900/60 text-blue-300 rounded uppercase tracking-wider">
                  {currentUser?.role || 'Guest'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentUser?.participant_code || ''}
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-400 w-full transition-colors pt-2 border-t border-slate-800">
            <LogOut className="w-3.5 h-3.5" /> Logout / Switch Account
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Top Floating Banner for Expert Committee Walkthrough */}
          {currentUser?.role === 'expert' && (
            <div className="mb-6 p-3 bg-purple-900/90 text-white rounded-xl shadow-md border border-purple-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Committee Walkthrough: Currently viewing as <span className="uppercase text-amber-300 font-black">{activeRoleView}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button 
                  onClick={() => handleSelectRoleWalkthrough('expert')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeRoleView === 'expert' ? 'bg-amber-400 text-slate-950' : 'bg-purple-800 text-purple-200 hover:text-white'}`}
                >
                  Expert Hub
                </button>
                <button 
                  onClick={() => handleSelectRoleWalkthrough('student')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeRoleView === 'student' ? 'bg-blue-600 text-white' : 'bg-purple-800 text-purple-200 hover:text-white'}`}
                >
                  Student (Bypass)
                </button>
                <button 
                  onClick={() => handleSelectRoleWalkthrough('instructor')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeRoleView === 'instructor' ? 'bg-indigo-600 text-white' : 'bg-purple-800 text-purple-200 hover:text-white'}`}
                >
                  Instructor
                </button>
                <button 
                  onClick={() => handleSelectRoleWalkthrough('rater')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeRoleView === 'rater' ? 'bg-teal-600 text-white' : 'bg-purple-800 text-purple-200 hover:text-white'}`}
                >
                  Rater
                </button>
                <button 
                  onClick={() => handleSelectRoleWalkthrough('admin')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeRoleView === 'admin' ? 'bg-rose-600 text-white' : 'bg-purple-800 text-purple-200 hover:text-white'}`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          {/* Dashboards */}
          {currentView === 'student-dashboard' && <StudentDashboard navigateTo={navigateTo} studentState={studentState} isBypass={isBypass} />}
          {currentView === 'instructor-dashboard' && <InstructorDashboard currentUser={currentUser} navigateTo={navigateTo} />}
          {currentView === 'rater-dashboard' && <RaterDashboard currentUser={currentUser} />}
          {currentView === 'admin-dashboard' && <AdminDashboard currentUser={currentUser} />}
          {currentView === 'expert-dashboard' && <ExpertDashboard currentUser={currentUser} onSelectRoleWalkthrough={handleSelectRoleWalkthrough} navigateTo={navigateTo} />}

          {/* Core Learning Views */}
          {currentView === 'orientation' && <OrientationView navigateTo={navigateTo} />}
          {currentView === 'consent' && <ResearchConsentView navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {currentView === 'pre-test' && <AssessmentView type="Pre-test" navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {currentView === 'post-test' && <AssessmentView type="Post-test" navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {currentView === 'lesson' && (
            <InteractiveLessonView 
              lessonId={activeLesson || 1} 
              navigateTo={navigateTo} 
              studentState={studentState} 
              updateStudentState={updateStudentState} 
              isBypass={isBypass} 
            />
          )}
          {currentView === 'results' && <StudentResultsView />}
          {currentView === 'feedback' && <StudentFeedbackView feedback={instructorFeedback} />}

          {/* Instructor Sub-views */}
          {currentView === 'students' && <StudentListView navigateTo={navigateTo} />}
          {currentView === 'student-progress' && <InstructorStudentProgress navigateTo={navigateTo} studentId={selectedStudentId} />}
          {currentView === 'pre-test-results' && <TestResultsView type="Pre-test" navigateTo={navigateTo} />}
          {currentView === 'post-test-results' && <TestResultsView type="Post-test" navigateTo={navigateTo} />}
          {currentView === 'review-list' && (
            <SubmissionReviewList 
              navigateTo={navigateTo} 
              onSelectSubmission={setSelectedSubmission} 
              studentState={studentState} 
            />
          )}
          {currentView === 'review-detail' && (
            <SubmissionReviewDetail 
              submission={selectedSubmission} 
              navigateTo={navigateTo} 
              studentState={studentState} 
            />
          )}
          {currentView === 'instructor-results' && <InstructorResultsComparison />}
          {currentView === 'data-export' && <DataExport />}
          {currentView === 'module-overview' && <ModuleOverview />}
          {currentView === 'expert-eval' && <ExpertEvaluationView />}
          {currentView === 'research' && <ResearchContext />}
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ icon: Icon, label, active, onClick, locked }) => (
  <button 
    onClick={onClick}
    disabled={locked}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
      locked ? 'opacity-40 cursor-not-allowed text-slate-500' :
      active ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    {locked && <span className="text-[10px] uppercase font-bold text-slate-500">Locked</span>}
  </button>
);

const LoginScreen = ({ onLogin }) => {
  const primaryRoles = [
    {
      id: 'usr_student_nadia',
      username: 'student',
      name: 'Nadia Hassan',
      participant_code: 'STU-1024',
      role: 'student',
      cohort_group: 'Group_Main_Study',
      title: 'Student (Main Study Cohort)',
      badge: 'Sequential Lock Active',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Strict progression: Consent ➔ Pre-test ➔ Lesson 1 before unlocking Lesson 2. Sees authoritative instructor grades only.',
      icon: GraduationCap,
      color: 'bg-blue-600'
    },
    {
      id: 'usr_instructor',
      username: 'instructor',
      name: 'Dr. Arisara (Lead Instructor)',
      participant_code: 'INST-01',
      role: 'instructor',
      cohort_group: 'Group_Evaluators',
      title: 'Course Instructor (Lead Evaluator)',
      badge: 'Authoritative Scoring',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Grade student spoken recordings using the 25-point analytic rubric. Scores are published to student dashboards and calibrated with raters.',
      icon: Award,
      color: 'bg-indigo-600'
    },
    {
      id: 'usr_rater_1',
      username: 'rater',
      name: 'Dr. Researcher (Rater 1)',
      participant_code: 'RATER-1',
      role: 'rater',
      cohort_group: 'Group_Evaluators',
      title: 'Independent Rater (Pilot Phase)',
      badge: 'Blind Calibration Queue',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      description: 'Blind evaluation queue active during the pilot and calibration phase. Scores saved internally for inter-rater reliability (ICC).',
      icon: Mic,
      color: 'bg-teal-600'
    },
    {
      id: 'usr_expert_prof',
      username: 'expert',
      name: 'Prof. Evaluation Expert',
      participant_code: 'EXPERT-01',
      role: 'expert',
      cohort_group: 'Group_Pilot_Experts',
      title: 'Professor / Thesis Committee',
      badge: 'Full Walkthrough + Switcher',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Unrestricted inspection. Experience the platform as Student, Instructor, Rater, or Admin, and complete the expert validation instrument.',
      icon: Sparkles,
      color: 'bg-purple-600'
    },
    {
      id: 'usr_admin',
      username: 'admin',
      name: 'TECHQUEST Lead Admin',
      participant_code: 'ADMIN-01',
      role: 'admin',
      cohort_group: 'Group_Staff',
      title: 'System Administrator',
      badge: 'User Management & SPSS',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      description: 'Manage participant accounts (create/delete), monitor SQLite engine health, and download the official SPSS dataset.',
      icon: ShieldCheck,
      color: 'bg-rose-600'
    }
  ];

  const secondaryRoles = [
    { id: 'usr_tester_qa', username: 'tester', name: 'Functional QA Tester', participant_code: 'TEST-001', role: 'tester', cohort_group: 'Group_Pilot', label: 'QA Tester (Zero Lock Bypass)' },
    { id: 'usr_rater_2', username: 'rater2', name: 'Dr. External Expert (Rater 2)', participant_code: 'RATER-2', role: 'rater_2', cohort_group: 'Group_Evaluators', label: 'Rater 2 (Blind Reliability)' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-center text-white relative">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-slate-700">
            <Headphones className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-black mb-1">TECHQUEST EOP Platform</h1>
          <p className="text-blue-300 text-sm font-medium">English for Occupational Purposes | Master's Thesis Research</p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">Select User Persona:</h2>
            <div className="space-y-3">
              {primaryRoles.map(u => {
                const IconComponent = u.icon;
                return (
                  <button 
                    key={u.id}
                    onClick={() => onLogin(u)}
                    className="w-full flex items-start justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl ${u.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-base">{u.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.badgeColor}`}>
                            {u.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">{u.description}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">Identity: <span className="font-bold text-slate-600">{u.name}</span> ({u.participant_code})</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 mt-3 shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">Testing & Pilot Reliability Roles:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {secondaryRoles.map(r => (
                <button
                  key={r.id}
                  onClick={() => onLogin(r)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">{r.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{r.participant_code}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrientationView = ({ navigateTo }) => (
  <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
    <div className="text-center space-y-4">
      <Badge type="primary" className="mb-2">Orientation</Badge>
      <h2 className="text-3xl font-bold text-slate-900">Welcome to TechSupport English EOP</h2>
      <p className="text-lg text-slate-600">This module prepares IT students for online technical support and customer service communication in international environments like Malaysia.</p>
    </div>

    <Card className="p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/3 aspect-square max-w-[220px]">
          <IllustrationDeskWorker isMuslim={true} />
        </div>
        <div className="w-full md:w-2/3 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Module Learning Flow:</h3>
          <ol className="list-decimal pl-5 space-y-3 text-slate-700 text-sm font-medium">
            <li><span className="font-bold text-indigo-700">Research Consent:</span> Required before starting to permit data collection.</li>
            <li><span className="font-bold text-indigo-700">Pre-test:</span> A formal research assessment of your speaking skills.</li>
            <li><span className="font-bold text-blue-700">8 Formative Lessons:</span> Interactive lessons. Progression is based on <span className="underline">completion</span>, not a minimum score. Practice safely!</li>
            <li><span className="font-bold text-indigo-700">Post-test:</span> Final formal research assessment.</li>
            <li><span className="font-bold text-teal-700">Instructor Feedback:</span> Review your results and expert feedback.</li>
          </ol>
        </div>
      </div>
    </Card>

    <div className="text-center">
      <button onClick={() => navigateTo('consent')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
        Continue to Research Consent
      </button>
    </div>
  </div>
);

const ResearchConsentView = ({ navigateTo, studentState, updateStudentState }) => {
  const [isChecked, setIsChecked] = useState(studentState.consent?.status || false);

  const handleAgree = () => {
    updateStudentState('consent', {
      status: true,
      version: 'v1.0',
      agreedAt: new Date().toISOString(),
      method: 'I_AGREE_BUTTON',
      pretest_access_granted: true
    });
    navigateTo('pre-test');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <ShieldCheck className="w-14 h-14 text-indigo-600 mx-auto" />
        <h2 className="text-3xl font-bold text-slate-900">Research Participation Consent</h2>
        <p className="text-slate-600 font-medium">Please read and agree to the following before accessing the Pre-test.</p>
      </div>

      <Card className="p-8 space-y-6 border-indigo-100 shadow-md">
        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-indigo-500"/> Use of Research Data</h3>
            <p className="pl-7 text-slate-600">Your Pre-test and Post-test results will be collected and used as research data to evaluate the effectiveness of this web-based English for Occupational Purposes (EOP) learning module.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><UserCheck className="w-5 h-5 text-indigo-500"/> Privacy and Confidentiality</h3>
            <p className="pl-7 text-slate-600">Your results will be recorded using a research code or identifier and will be reported without publicly identifying you by name.</p>
          </div>
          
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-2"><Award className="w-5 h-5 text-blue-600"/> No Effect on University Grades</h3>
            <p className="pl-7 font-medium text-blue-800">
              Participation and Pre-test/Post-test scores will NOT affect your university grades, academic evaluation, or academic standing. A low score on these assessments has no academic penalty.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><CheckSquare className="w-5 h-5 text-indigo-500"/> Voluntary Participation</h3>
            <p className="pl-7 text-slate-600">Participation in this research data collection is completely voluntary according to the approved research procedures.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mt-8">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className={`font-medium transition-colors ${isChecked ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
              I have read and understood the information above, and I voluntarily agree to participate in this research.
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            disabled={!isChecked}
            onClick={handleAgree}
            className={`px-8 py-3 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2 ${
              isChecked 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            I Agree and Continue <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </Card>
    </div>
  );
};

// StudentDashboard is imported from ./components/StudentDashboard

const FullLessonOneView = (props) => (
  <InteractiveLessonView lessonId={1} {...props} />
);

// AssessmentView delegated to ./components/AssessmentView

const StudentResultsView = () => (
  <div className="p-8 text-center animate-fade-in">
    <h2 className="text-3xl font-black mb-6 text-slate-900">My Results</h2>
    <Card className="max-w-md mx-auto p-8 text-left shadow-md">
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-900 mb-8 font-medium leading-relaxed">
        <ShieldCheck className="w-5 h-5 inline mr-2 text-indigo-600 align-text-bottom"/> These scores represent formal research assessment data and do not impact your university grades.
      </div>
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <span className="text-slate-600 font-bold">Pre-test Score:</span>
        <span className="text-2xl font-black text-indigo-600">14 <span className="text-sm text-slate-400 font-medium">/ 25</span></span>
      </div>
      <div className="flex justify-between items-center mt-5">
        <span className="text-slate-600 font-bold">Post-test Score:</span>
        <span className="font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full text-sm">Pending Review</span>
      </div>
    </Card>
  </div>
);

const StudentFeedbackView = ({ feedback }) => (
  <div className="p-8 text-center animate-fade-in">
    <h2 className="text-3xl font-black mb-6 text-slate-900">Instructor Feedback</h2>
    
    {feedback ? (
      <Card className="max-w-2xl mx-auto p-8 text-left shadow-md">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
          <div>
            <Badge type="success">Feedback Received</Badge>
            <h3 className="text-xl font-bold text-slate-900 mt-2">Formal Assessment Score</h3>
          </div>
          <div className="text-right">
             <p className="text-3xl font-black text-indigo-600">{feedback.score} <span className="text-lg text-slate-400">/ 25</span></p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Strengths</h4>
            <p className="text-sm text-emerald-800 font-medium whitespace-pre-wrap">{feedback.strengths}</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Areas for Improvement</h4>
            <p className="text-sm text-amber-800 font-medium whitespace-pre-wrap">{feedback.improvements}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Suggestions</h4>
            <p className="text-sm text-blue-800 font-medium whitespace-pre-wrap">{feedback.suggestions}</p>
          </div>
        </div>
      </Card>
    ) : (
      <Card className="max-w-md mx-auto p-10 bg-slate-50 border-dashed border-2 border-slate-300">
        <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4"/>
        <p className="text-slate-500 font-medium">No new feedback available. Complete an assessment to receive feedback from your instructor.</p>
      </Card>
    )}
  </div>
);

const PlaceholderLessonView = (props) => (
  <InteractiveLessonView lessonId={props.lessonId} {...props} />
);

// InstructorDashboard is imported from ./components/InstructorDashboard

const StudentListView = ({ navigateTo }) => (
  <div className="space-y-6 animate-fade-in">
    <header className="border-b pb-4">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl font-black text-slate-900">Student List</h2>
        <Badge type="warning">Demo Data</Badge>
      </div>
      <p className="text-slate-600 font-medium mt-1">Enrolled Thai IT undergraduate research participants.</p>
    </header>
    <Card className="overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Student ID & Name</th>
            <th className="px-6 py-4">Overall Progress</th>
            <th className="px-6 py-4 text-center">Pre-test</th>
            <th className="px-6 py-4 text-center">Post-test</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white font-medium">
          {MOCK_STUDENTS.map(s => (
            <tr key={s.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">{s.name}</p>
                <p className="text-xs text-slate-500">{s.id}</p>
              </td>
              <td className="px-6 py-4">
                 <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.progress === 100 ? 'bg-teal-500' : 'bg-blue-500'}`} style={{ width: `${s.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{s.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center font-bold text-indigo-600">{s.preTest ? `${s.preTest}/25` : '-'}</td>
              <td className="px-6 py-4 text-center font-bold text-indigo-600">{s.postTest ? `${s.postTest}/25` : '-'}</td>
              <td className="px-6 py-4"><Badge type={s.status === 'Completed' ? 'success' : 'primary'}>{s.status}</Badge></td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => navigateTo('student-progress', { studentId: s.id })} className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const InstructorStudentProgress = ({ navigateTo, studentId }) => {
  const student = MOCK_STUDENTS.find(s => s.id === (studentId || 'STU-001'));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="border-b pb-4">
        <button onClick={() => navigateTo('students')} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-4 font-bold transition">
          <ChevronLeft className="w-4 h-4"/> Back to Students
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">{student?.name || 'Student Name'}</h2>
            <p className="text-slate-500 font-medium">{student?.id || 'STU-000'}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 md:col-span-2 shadow-sm border-slate-200">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-500"/> Module Progress</h3>
           <div className="space-y-3">
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
               <span className="text-sm font-bold text-slate-700">Lesson 1: Responding to Enquiries</span>
               <Badge type="success">Completed</Badge>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
               <span className="text-sm font-bold text-slate-700">Lesson 2: Clarifying Technical Problems</span>
               <Badge type="success">Completed</Badge>
             </div>
             <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
               <span className="text-sm font-bold text-blue-900">Lesson 3: Explaining Troubleshooting Procedures</span>
               <Badge type="primary">In Progress</Badge>
             </div>
             {[4,5,6,7,8].map(num => (
                <div key={num} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 opacity-60">
                 <span className="text-sm font-bold text-slate-500">Lesson {num}</span>
                 <Badge type="default">Locked</Badge>
               </div>
             ))}
           </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-500"/> Formal Assessments</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pre-test Status</p>
                {student?.preTest ? (
                   <p className="text-xl font-black text-indigo-600">{student.preTest} <span className="text-sm text-slate-400 font-medium">/ 25</span></p>
                ) : (
                  <Badge type="warning">Pending</Badge>
                )}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Post-test Status</p>
                {student?.postTest ? (
                   <p className="text-xl font-black text-indigo-600">{student.postTest} <span className="text-sm text-slate-400 font-medium">/ 25</span></p>
                ) : (
                  <Badge type="warning">Pending</Badge>
                )}
              </div>
            </div>
          </Card>
          
          <Card className="p-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Mic className="w-5 h-5 text-teal-500"/> Speaking Submissions</h3>
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-600">Pre-test Recording</span>
                 <Badge type="success">Reviewed</Badge>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-600">Post-test Recording</span>
                 <Badge type="warning">Awaiting</Badge>
               </div>
            </div>
             <button onClick={() => navigateTo('review-list')} className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition">Go to Reviews</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TestResultsView = ({ type, navigateTo }) => (
  <div className="space-y-6 animate-fade-in">
    <header className="border-b pb-4">
      <div className="flex items-center gap-3 mb-2">
        <Badge type="research">Research Assessment</Badge>
        <Badge type="warning">Demo Data</Badge>
      </div>
      <h2 className="text-3xl font-black text-slate-900">{type} Results</h2>
      <p className="text-slate-600 font-medium mt-1">Formal 25-point speaking rubric scores for research analysis.</p>
    </header>

    <Card className="overflow-hidden shadow-sm border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-4 py-4 text-center">Task Achievement<br/><span className="text-slate-300 font-normal">(5)</span></th>
              <th className="px-4 py-4 text-center">Interactive Comm.<br/><span className="text-slate-300 font-normal">(5)</span></th>
              <th className="px-4 py-4 text-center">Vocabulary<br/><span className="text-slate-300 font-normal">(5)</span></th>
              <th className="px-4 py-4 text-center">Grammar<br/><span className="text-slate-300 font-normal">(5)</span></th>
              <th className="px-4 py-4 text-center">Pronunciation & Fluency<br/><span className="text-slate-300 font-normal">(5)</span></th>
              <th className="px-6 py-4 text-center border-l border-slate-200 bg-indigo-50/30 text-indigo-900">Total Score<br/><span className="text-indigo-300 font-normal">(25)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-medium">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-slate-900">Student 001</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">2</td>
              <td className="px-6 py-4 text-center font-black text-indigo-600 border-l border-slate-200 bg-indigo-50/10">14</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-slate-900">Student 002</td>
              <td className="px-4 py-4 text-center">4</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-4 py-4 text-center">3</td>
              <td className="px-6 py-4 text-center font-black text-indigo-600 border-l border-slate-200 bg-indigo-50/10">16</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// Instructor review components delegated to ./components/InstructorEvaluationSuite

const ModuleOverview = () => (
  <div className="space-y-6 animate-fade-in pb-12">
    <header className="border-b pb-4">
      <h2 className="text-3xl font-black text-slate-900">Module Overview</h2>
      <p className="text-slate-600 font-medium mt-1">Curriculum structure for all 8 EOP lessons.</p>
    </header>
    <Card className="overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Lesson</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Communication Skill</th>
            <th className="px-6 py-4">Language Focus</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white font-medium">
           <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-blue-600">Lesson 1</td>
              <td className="px-6 py-4 font-bold text-slate-900">Responding to Customer Enquiries</td>
              <td className="px-6 py-4 text-slate-600 text-xs">Customer enquiry</td>
              <td className="px-6 py-4 text-slate-600 text-xs">Greetings, empathy, questions</td>
              <td className="px-6 py-4"><Badge type="success">Completed</Badge></td>
            </tr>
             <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-blue-600">Lesson 2</td>
              <td className="px-6 py-4 font-bold text-slate-900">Identifying and Clarifying Technical Problems</td>
              <td className="px-6 py-4 text-slate-600 text-xs">Problem clarification</td>
              <td className="px-6 py-4 text-slate-600 text-xs">Questions, modal verbs</td>
              <td className="px-6 py-4"><Badge type="primary">In Progress</Badge></td>
            </tr>
             <tr className="hover:bg-slate-50 opacity-60">
              <td className="px-6 py-4 font-bold text-slate-500">Lesson 3</td>
              <td className="px-6 py-4 font-bold text-slate-700">Explaining Troubleshooting Procedures</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Troubleshooting</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Sequencing, instructions</td>
              <td className="px-6 py-4"><Badge type="default">Locked</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 opacity-60">
              <td className="px-6 py-4 font-bold text-slate-500">Lesson 4</td>
              <td className="px-6 py-4 font-bold text-slate-700">Handling Customer Complaints</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Complaints</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Empathy, apology</td>
              <td className="px-6 py-4"><Badge type="default">Locked</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 opacity-60">
              <td className="px-6 py-4 font-bold text-slate-500">Lesson 5</td>
              <td className="px-6 py-4 font-bold text-slate-700">Providing Clear Instructions</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Instructions</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Imperatives, modal verbs</td>
              <td className="px-6 py-4"><Badge type="default">Locked</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 opacity-60">
              <td className="px-6 py-4 font-bold text-slate-500">Lesson 6</td>
              <td className="px-6 py-4 font-bold text-slate-700">Escalating Unresolved Issues</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Escalation</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Professional escalation</td>
              <td className="px-6 py-4"><Badge type="default">Locked</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 opacity-60">
              <td className="px-6 py-4 font-bold text-slate-500">Lesson 7</td>
              <td className="px-6 py-4 font-bold text-slate-700">Support Tickets and Technical Documentation</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Documentation</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Technical vocabulary</td>
              <td className="px-6 py-4"><Badge type="default">Locked</Badge></td>
            </tr>
             <tr className="hover:bg-slate-50 opacity-60">
              <td className="px-6 py-4 font-bold text-slate-500">Lesson 8</td>
              <td className="px-6 py-4 font-bold text-slate-700">Complete Online Customer Support Interaction</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Integrated communication</td>
              <td className="px-6 py-4 text-slate-500 text-xs">Integrated skills</td>
              <td className="px-6 py-4"><Badge type="default">Locked</Badge></td>
            </tr>
        </tbody>
      </table>
    </Card>
  </div>
);

// ExpertEvaluation delegated to ExpertEvaluationView in ./components/InstructorEvaluationSuite

const ResearchContext = () => (
  <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pb-12">
    <header className="border-b pb-4 text-center">
      <Badge type="research" className="mb-2">Thesis Research Design</Badge>
      <h2 className="text-3xl font-black text-slate-900">How This Module Supports the Research</h2>
    </header>
    <Card className="p-8 space-y-6 text-slate-700 font-medium leading-relaxed">
      <p>This prototype implements a web-based English for Occupational Purposes (EOP) learning module designed for Thai undergraduate IT students preparing for employment in Malaysia.</p>
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 space-y-3 text-blue-900">
        <p className="font-bold">Research Flow:</p>
        <p>Needs Analysis → Job Ad Analysis → Occupational Communication Needs → EOP Content Development → Web-Based EOP Module → Expert Evaluation → Pre-test → 8-Lesson Intervention → Post-test → Student Perceptions.</p>
      </div>
    </Card>
  </div>
);