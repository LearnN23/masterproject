import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, LayoutDashboard, Mic, Play, Pause, StopCircle, 
  CheckCircle, FileText, Users, Search, ChevronRight, AlertCircle, 
  Settings, LogOut, MessageSquare, Award, BookCheck, Info,
  Headphones, Send, RotateCcw, User, GraduationCap, ArrowRight,
  ShieldCheck, ListChecks, ArrowLeft, ThumbsUp, Lightbulb, UserCheck, CheckSquare,
  BarChart3, FileAudio, ChevronLeft
} from 'lucide-react';

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
  const [role, setRole] = useState(null); 
  const [currentView, setCurrentView] = useState('login');
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null); 

  // Unified Student State including Audio URLs
  const [studentState, setStudentState] = useState({
    id: 'STU-1024',
    name: 'Nadia Hassan',
    consent: { status: false, version: 'v1.0', agreedAt: null, method: null },
    preTestCompleted: false,
    preTestAudioUrl: null, // Stores actual recorded blob URL
    postTestCompleted: false,
    postTestAudioUrl: null, // Stores actual recorded blob URL
    lesson1State: {
      isCompleted: false,
      sectionsCompleted: { situation: false, learn: false, practice: false, review: false, speaking: false },
      reviewScore: null,
      bestReviewScore: null,
      speakingPracticeCompleted: false
    }
  });

  const [instructorFeedback, setInstructorFeedback] = useState(null);

  const navigateTo = (view, data = null) => {
    // Stop any playing speech synthesis when navigating
    window.speechSynthesis.cancel();
    
    if (view === 'pre-test' && !studentState.consent.status) {
      setCurrentView('consent');
      return;
    }
    setCurrentView(view);
    if (data && data.lessonId) setActiveLesson(data.lessonId);
    if (data && data.studentId) setSelectedStudentId(data.studentId);
    window.scrollTo(0,0);
  };

  const handleLogout = () => {
    window.speechSynthesis.cancel();
    setRole(null);
    setCurrentView('login');
  };

  const updateStudentState = (key, value) => {
    setStudentState(prev => ({ ...prev, [key]: value }));
  };

  if (!role && currentView === 'login') {
    return <LoginScreen setRole={(r) => { setRole(r); setCurrentView(r === 'student' ? 'student-dashboard' : 'instructor-dashboard'); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 relative">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-1">
            <Headphones className="w-8 h-8 text-teal-400" />
            <h1 className="text-xl font-bold leading-tight">TechSupport<br/><span className="text-sm font-normal text-blue-300">English EOP</span></h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wider">Research Prototype</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          {role === 'student' ? (
            <>
              <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'student-dashboard'} onClick={() => navigateTo('student-dashboard')} />
              <NavItem icon={Info} label="Orientation" active={currentView === 'orientation'} onClick={() => navigateTo('orientation')} />
              {!studentState.consent.status && <NavItem icon={ShieldCheck} label="Research Consent" active={currentView === 'consent'} onClick={() => navigateTo('consent')} />}
              <NavItem icon={Mic} label="Pre-test" active={currentView === 'pre-test'} onClick={() => navigateTo('pre-test')} locked={!studentState.consent.status} />
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning Modules</div>
              {LESSONS.map(l => (
                <NavItem 
                  key={l.id} 
                  icon={BookOpen} 
                  label={`Lesson ${l.id}`} 
                  active={currentView === 'lesson' && activeLesson === l.id} 
                  onClick={() => navigateTo('lesson', { lessonId: l.id })}
                  locked={l.id > 1 && !studentState.lesson1State.isCompleted} 
                />
              ))}
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments</div>
              <NavItem icon={Mic} label="Post-test" active={currentView === 'post-test'} onClick={() => navigateTo('post-test')} locked={!studentState.lesson1State.isCompleted} />
              <NavItem icon={Award} label="My Results" active={currentView === 'results'} onClick={() => navigateTo('results')} />
              <NavItem icon={MessageSquare} label="Instructor Feedback" active={currentView === 'feedback'} onClick={() => navigateTo('feedback')} />
            </>
          ) : (
            <>
              <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'instructor-dashboard'} onClick={() => navigateTo('instructor-dashboard')} />
              <NavItem icon={Users} label="Students" active={currentView === 'students' || currentView === 'student-progress'} onClick={() => navigateTo('students')} />
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments</div>
              <NavItem icon={BarChart3} label="Pre-test Results" active={currentView === 'pre-test-results'} onClick={() => navigateTo('pre-test-results')} />
              <NavItem icon={BarChart3} label="Post-test Results" active={currentView === 'post-test-results'} onClick={() => navigateTo('post-test-results')} />
              <NavItem icon={Mic} label="Speaking Submissions" active={currentView === 'review-list' || currentView === 'review-detail'} onClick={() => navigateTo('review-list')} />
              <NavItem icon={Award} label="Instructor Results" active={currentView === 'instructor-results'} onClick={() => navigateTo('instructor-results')} />
              
              <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module Admin</div>
              <NavItem icon={BookCheck} label="Module Overview" active={currentView === 'module-overview'} onClick={() => navigateTo('module-overview')} />
              <NavItem icon={FileText} label="Expert Evaluation" active={currentView === 'expert-eval'} onClick={() => navigateTo('expert-eval')} />
              <NavItem icon={Search} label="Research Overview" active={currentView === 'research'} onClick={() => navigateTo('research')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{role === 'student' ? studentState.name : 'Dr. Instructor'}</p>
              <p className="text-xs text-slate-400">{role === 'student' ? 'IT Student' : 'Researcher'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white w-full transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {role === 'student' && currentView === 'student-dashboard' && <StudentDashboard navigateTo={navigateTo} studentState={studentState} />}
          {role === 'student' && currentView === 'orientation' && <OrientationView navigateTo={navigateTo} />}
          {role === 'student' && currentView === 'consent' && <ResearchConsentView navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {role === 'student' && currentView === 'pre-test' && <AssessmentView type="Pre-test" navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {role === 'student' && currentView === 'post-test' && <AssessmentView type="Post-test" navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {role === 'student' && currentView === 'lesson' && activeLesson === 1 && <FullLessonOneView navigateTo={navigateTo} studentState={studentState} updateStudentState={updateStudentState} />}
          {role === 'student' && currentView === 'lesson' && activeLesson !== 1 && <PlaceholderLessonView lessonId={activeLesson} navigateTo={navigateTo} studentState={studentState} />}
          {role === 'student' && currentView === 'results' && <StudentResultsView />}
          {role === 'student' && currentView === 'feedback' && <StudentFeedbackView feedback={instructorFeedback} />}

          {role === 'instructor' && currentView === 'instructor-dashboard' && <InstructorDashboard navigateTo={navigateTo} />}
          {role === 'instructor' && currentView === 'students' && <StudentListView navigateTo={navigateTo} />}
          {role === 'instructor' && currentView === 'student-progress' && <InstructorStudentProgress navigateTo={navigateTo} studentId={selectedStudentId} />}
          {role === 'instructor' && currentView === 'pre-test-results' && <TestResultsView type="Pre-test" navigateTo={navigateTo} />}
          {role === 'instructor' && currentView === 'post-test-results' && <TestResultsView type="Post-test" navigateTo={navigateTo} />}
          {role === 'instructor' && currentView === 'review-list' && <SubmissionReviewList navigateTo={navigateTo} studentState={studentState} />}
          {role === 'instructor' && currentView === 'review-detail' && <SubmissionReviewDetail navigateTo={navigateTo} setInstructorFeedback={setInstructorFeedback} studentState={studentState} />}
          {role === 'instructor' && currentView === 'instructor-results' && <InstructorResultsComparison navigateTo={navigateTo} />}
          {role === 'instructor' && currentView === 'module-overview' && <ModuleOverview />}
          {role === 'instructor' && currentView === 'expert-eval' && <ExpertEvaluation />}
          {role === 'instructor' && currentView === 'research' && <ResearchContext />}
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
      locked ? 'opacity-50 cursor-not-allowed text-slate-500' :
      active ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4" />
      {label}
    </div>
  </button>
);

const LoginScreen = ({ setRole }) => (
  <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-8 text-center text-white">
        <Headphones className="w-12 h-12 text-teal-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">TechSupport English EOP</h1>
        <p className="text-slate-400 text-sm">Master's Thesis Prototype Demonstration</p>
      </div>
      <div className="p-8 space-y-4">
        <p className="text-center text-slate-600 mb-6 text-sm">Please select a role to explore the interactive mock-up.</p>
        <button onClick={() => setRole('student')} className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-lg">Student Portal</p>
              <p className="text-xs text-slate-500 font-medium">Access lessons & assessments</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400 group-hover:text-blue-500" />
        </button>
        <button onClick={() => setRole('instructor')} className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all group shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <BookCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-lg">Instructor Portal</p>
              <p className="text-xs text-slate-500 font-medium">Review submissions & rubrics</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400 group-hover:text-teal-500" />
        </button>
      </div>
    </div>
  </div>
);

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

const StudentDashboard = ({ navigateTo, studentState }) => {
  const l1Done = studentState.lesson1State.isCompleted;
  const progressPercent = l1Done ? 15 : 5;

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, {studentState.name.split(' ')[0]}!</h2>
          <p className="text-slate-600 mt-1 font-medium">Continue your journey in technical support communication.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Overall Progress</p>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="font-bold text-slate-800">{progressPercent}%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-indigo-500 bg-indigo-50/30">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-indigo-600"/> Pre-test Status</h3>
          <p className="text-sm text-slate-600 mt-2 mb-3">
            {studentState.preTestCompleted ? 'Research Assessment completed.' : 'Required before starting lessons.'}
          </p>
          {studentState.preTestCompleted 
            ? <Badge type="success">Completed</Badge> 
            : <button onClick={() => navigateTo('pre-test')} className="text-sm text-indigo-700 font-bold hover:underline flex items-center gap-1">Take Pre-test <ArrowRight className="w-3 h-3"/></button>
          }
        </Card>
        
        <Card className="p-6 border-l-4 border-l-blue-500 shadow-md transform hover:-translate-y-1 transition-all">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600"/> Current Focus</h3>
          <p className="text-sm text-slate-600 mt-2 mb-4 font-medium">
            {l1Done 
              ? 'Ready to begin Lesson 2: Clarifying Technical Problems.' 
              : 'Lesson 1: Responding to Enquiries.'}
          </p>
          <button 
            disabled={!studentState.preTestCompleted}
            onClick={() => navigateTo('lesson', { lessonId: l1Done ? 2 : 1 })} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition w-full disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {l1Done ? 'Start Lesson 2' : (studentState.lesson1State.sectionsCompleted.situation ? 'Continue Lesson 1' : 'Start Lesson 1')}
          </button>
        </Card>

        <Card className="p-6 border-l-4 border-l-slate-300">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Award className="w-5 h-5 text-slate-400"/> Post-test Status</h3>
          <p className="text-sm text-slate-600 mt-2 mb-3">Complete all 8 lessons to unlock.</p>
          <Badge type="default">Locked</Badge>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-500"/> Learning Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LESSONS.map((lesson) => {
            let status = 'locked';
            if (lesson.id === 1) {
              status = studentState.preTestCompleted ? (l1Done ? 'completed' : 'in-progress') : 'locked';
            } else if (lesson.id === 2) {
              status = l1Done ? 'in-progress' : 'locked';
            }

            return (
              <Card key={lesson.id} className={`p-5 transition-all flex flex-col ${status === 'locked' ? 'opacity-60 bg-slate-50 border-slate-200' : 'hover:shadow-md border-blue-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lesson {lesson.id}</span>
                  {status === 'completed' && <CheckCircle className="w-5 h-5 text-teal-500" />}
                  {status === 'in-progress' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse mt-1" />}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2" title={lesson.title}>{lesson.title}</h4>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{lesson.focus}</p>
                <button 
                  disabled={status === 'locked'}
                  onClick={() => navigateTo('lesson', { lessonId: lesson.id })}
                  className={`w-full py-2 text-xs font-bold rounded-lg border transition-all ${
                    status === 'completed' ? 'border-teal-200 text-teal-800 bg-teal-50 hover:bg-teal-100' : 
                    status === 'in-progress' ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 
                    'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
                  }`}
                >
                  {status === 'completed' ? 'Review Lesson' : status === 'in-progress' ? 'Access Lesson' : 'Locked'}
                </button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const FullLessonOneView = ({ navigateTo, studentState, updateStudentState }) => {
  const ls = studentState.lesson1State;
  
  let defaultSection = 'situation';
  if (ls.isCompleted) defaultSection = 'results';
  else if (ls.sectionsCompleted.review) defaultSection = 'speaking';
  else if (ls.sectionsCompleted.practice) defaultSection = 'review';
  else if (ls.sectionsCompleted.learn) defaultSection = 'practice';
  else if (ls.sectionsCompleted.situation) defaultSection = 'learn';

  const [currentSection, setCurrentSection] = useState(defaultSection);
  const [practiceAnswers, setPracticeAnswers] = useState({ q1: null });
  const [practiceFeedback, setPracticeFeedback] = useState({ q1: null });
  const [reviewAnswers, setReviewAnswers] = useState({ q1: null, q2: null, q3: null });
  const [reviewSubmitted, setReviewSubmitted] = useState(ls.reviewScore !== null);
  const [selfAssessment, setSelfAssessment] = useState({ a: false, b: false, c: false });
  const [showHint, setShowHint] = useState(false);

  // Audio Recording State for Lesson 1 Practice
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      window.speechSynthesis.cancel(); // Stop any customer audio playback
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
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
    setRecordingState('idle');
    setRecordingTime(0);
    setSelfAssessment({a: false, b: false, c: false});
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const markSectionComplete = (section) => {
    const newState = { ...studentState.lesson1State };
    newState.sectionsCompleted[section] = true;
    updateStudentState('lesson1State', newState);
  };

  const handleNext = (nextSection) => {
    markSectionComplete(currentSection);
    setCurrentSection(nextSection);
    window.scrollTo(0,0);
  };

  const completeLesson = () => {
    markSectionComplete('speaking');
    const newState = { ...studentState.lesson1State };
    newState.isCompleted = true;
    newState.speakingPracticeCompleted = true;
    updateStudentState('lesson1State', newState);
    setCurrentSection('results');
    window.scrollTo(0,0);
  };

  const renderSituation = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-8 border-t-4 border-t-blue-600 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Workplace Situation</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3 aspect-square max-w-[200px]">
            <IllustrationDeskWorker isFemale={true} />
          </div>
          <div className="w-full md:w-2/3 space-y-4 text-slate-700">
            <p className="text-lg font-medium text-slate-900">Imagine you are working as a Tier 1 Technical Support Agent.</p>
            <p>Your job involves receiving initial inquiries from customers who are experiencing technical issues with your company's software.</p>
            <p>When a customer contacts you via chat or voice, the first few seconds are critical. You must establish a professional tone, show that you care about their problem, and politely ask for more details to diagnose the issue.</p>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-4 shadow-inner">
              <p className="font-bold text-blue-900 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> In this lesson, you will learn to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-blue-800 font-medium">
                <li>Use professional greetings.</li>
                <li>Offer help and show empathy.</li>
                <li>Use polite modal verbs (could, would, may).</li>
                <li>Ask appropriate clarifying questions.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex justify-end">
        <button onClick={() => handleNext('learn')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md">
          Start Learning <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  const renderLearn = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-slate-900">Learn & Examples</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition">
          <h4 className="text-lg font-bold text-slate-900 mb-3">1. Professional Greetings</h4>
          <p className="text-sm text-slate-600 mb-4">Always open with a standard, polite greeting and immediately offer assistance.</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-sm font-medium text-slate-800">
            <p className="flex gap-2"><CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0"/> "Thank you for contacting Technical Support. My name is Nadia."</p>
            <p className="flex gap-2"><CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0"/> "How may I help you today?"</p>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-indigo-500 hover:shadow-md transition">
          <h4 className="text-lg font-bold text-slate-900 mb-3">2. Showing Empathy</h4>
          <p className="text-sm text-slate-600 mb-4">Acknowledge the customer's frustration professionally before jumping into technical steps.</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-sm font-medium text-slate-800">
            <p className="flex gap-2"><CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0"/> "I'm sorry to hear that you are experiencing this issue."</p>
            <p className="flex gap-2"><CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0"/> "Let me help you get this resolved right away."</p>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 border-l-4 border-l-amber-500">
          <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-600"/> Language Focus: Polite Modal Verbs</h4>
          <p className="text-sm text-slate-600 mb-4 font-medium">Use modal verbs (<span className="font-bold text-amber-700">could, would, may</span>) to soften requests. This sounds more professional than using direct imperatives in customer service.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-5 rounded-xl border border-red-100">
              <p className="text-xs font-bold text-red-600 uppercase mb-3 tracking-wider">Too Direct / Impolite</p>
              <p className="text-sm text-slate-800 font-medium">"What is your account number?"</p>
              <p className="text-sm text-slate-800 mt-3 font-medium">"Tell me the error code."</p>
            </div>
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 uppercase mb-3 tracking-wider">Professional & Polite</p>
              <p className="text-sm text-slate-800 font-medium">"<span className="font-bold text-emerald-700 bg-emerald-200/50 px-1 rounded">Could</span> you please provide your account number?"</p>
              <p className="text-sm text-slate-800 mt-3 font-medium">"<span className="font-bold text-emerald-700 bg-emerald-200/50 px-1 rounded">Would</span> you mind reading the error code to me?"</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between mt-8 items-center pt-4 border-t border-slate-200">
        <button onClick={() => setCurrentSection('situation')} className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition"><ArrowLeft className="w-5 h-5"/> Back to Situation</button>
        <button onClick={() => handleNext('practice')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md">
          Go to Practice <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  const renderPractice = () => {
    const handleAnswer = (q, answer, isCorrect, feedback) => {
      setPracticeAnswers(prev => ({ ...prev, [q]: answer }));
      setPracticeFeedback(prev => ({ ...prev, [q]: { isCorrect, text: feedback } }));
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-slate-900">Formative Practice</h3>
          <Badge type="formative">Ungraded Learning</Badge>
        </div>
        <p className="text-slate-600 font-medium">This activity does not affect your research score. It is designed for you to learn and make mistakes safely. Retry as many times as you like.</p>
        
        <Card className="p-6 shadow-sm border-blue-100">
          <div className="bg-slate-100 p-5 rounded-lg border-l-4 border-slate-400 italic text-slate-800 mb-6 font-medium">
            <strong>Customer:</strong> "My software keeps crashing every time I try to save a document. I've lost hours of work!"
          </div>
          <p className="font-bold text-slate-900 mb-4">Q1: Choose the most appropriate and professional response:</p>
          <div className="space-y-3">
            {[
              { id: 'A', text: '"What is the error code? You probably didn\'t update your system."', correct: false, fb: 'Avoid blaming the customer. Show empathy first.' },
              { id: 'B', text: '"Calm down, we will fix it. First, restart your computer."', correct: false, fb: 'Telling a customer to "calm down" can escalate frustration.' },
              { id: 'C', text: '"I apologize for the frustration. Let\'s look into this immediately. Could you tell me which version you are running?"', correct: true, fb: 'Correct! Acknowledges frustration (empathy) and uses a polite clarification question.' }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => handleAnswer('q1', opt.id, opt.correct, opt.fb)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                  practiceAnswers.q1 === opt.id 
                    ? (opt.correct ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-400')
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
          
          {practiceFeedback.q1 && (
            <div className={`mt-5 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${practiceFeedback.q1.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'}`}>
              {practiceFeedback.q1.isCorrect ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
              <div>
                <p className="font-bold text-lg">{practiceFeedback.q1.isCorrect ? 'Excellent!' : 'Let\'s try again.'}</p>
                <p className="mt-1 font-medium">{practiceFeedback.q1.text}</p>
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <button onClick={() => setCurrentSection('learn')} className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2"><ArrowLeft className="w-5 h-5"/> Back</button>
          <button onClick={() => handleNext('review')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md">
            Continue to Lesson Review <ArrowRight className="w-5 h-5"/>
          </button>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    const calculateScore = () => {
      let score = 0;
      if (reviewAnswers.q1 === 'B') score++;
      if (reviewAnswers.q2 === 'C') score++;
      if (reviewAnswers.q3 === 'A') score++;
      return Math.round((score / 3) * 100);
    };

    const handleSubmitReview = () => {
      const score = calculateScore();
      const newState = { ...studentState.lesson1State };
      newState.reviewScore = score;
      if (newState.bestReviewScore === null || score > newState.bestReviewScore) {
        newState.bestReviewScore = score;
      }
      updateStudentState('lesson1State', newState);
      setReviewSubmitted(true);
    };

    return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-slate-900">Lesson Review</h3>
          <Badge type="warning">Completion Required (Ungraded for Research)</Badge>
        </div>
        <p className="text-slate-600 font-medium">Test your knowledge. A perfect score is not required to pass this lesson.</p>

        <Card className="p-6 md:p-8">
          <div className="space-y-8">
            <div>
              <p className="font-bold text-slate-900 mb-3 text-lg">1. Which modal verb is most appropriate for a polite request?</p>
              <div className="flex flex-col gap-3">
                {['A. Must', 'B. Could', 'C. Should'].map(opt => {
                  const val = opt.charAt(0);
                  const isSelected = reviewAnswers.q1 === val;
                  const isCorrect = val === 'B';
                  const showResult = reviewSubmitted;
                  
                  let btnClass = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50';
                  if (isSelected && !showResult) btnClass = 'bg-blue-50 border-blue-500 font-medium';
                  if (showResult && isCorrect) btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  if (showResult && isSelected && !isCorrect) btnClass = 'bg-red-50 border-red-300 text-red-900';

                  return (
                    <button key={val} disabled={reviewSubmitted} onClick={() => setReviewAnswers(prev => ({...prev, q1: val}))} className={`text-left px-5 py-3 rounded-xl border-2 transition-all ${btnClass}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <p className="font-bold text-slate-900 mb-3 text-lg">2. What is the primary purpose of showing empathy in the first response?</p>
              <div className="flex flex-col gap-3">
                {['A. To waste time', 'B. To admit the company made a mistake', 'C. To acknowledge the customer\'s frustration and build rapport'].map(opt => {
                  const val = opt.charAt(0);
                  const isSelected = reviewAnswers.q2 === val;
                  const isCorrect = val === 'C';
                  const showResult = reviewSubmitted;
                  
                  let btnClass = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50';
                  if (isSelected && !showResult) btnClass = 'bg-blue-50 border-blue-500 font-medium';
                  if (showResult && isCorrect) btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  if (showResult && isSelected && !isCorrect) btnClass = 'bg-red-50 border-red-300 text-red-900';

                  return (
                    <button key={val} disabled={reviewSubmitted} onClick={() => setReviewAnswers(prev => ({...prev, q2: val}))} className={`text-left px-5 py-3 rounded-xl border-2 transition-all ${btnClass}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <p className="font-bold text-slate-900 mb-3 text-lg">3. Identify the best opening line for a chat support interaction:</p>
              <div className="flex flex-col gap-3">
                {['A. "Thank you for contacting Technical Support. How may I help you today?"', 'B. "What is wrong with your system?"', 'C. "Please type your error code now."'].map(opt => {
                  const val = opt.charAt(0);
                  const isSelected = reviewAnswers.q3 === val;
                  const isCorrect = val === 'A';
                  const showResult = reviewSubmitted;
                  
                  let btnClass = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50';
                  if (isSelected && !showResult) btnClass = 'bg-blue-50 border-blue-500 font-medium';
                  if (showResult && isCorrect) btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  if (showResult && isSelected && !isCorrect) btnClass = 'bg-red-50 border-red-300 text-red-900';

                  return (
                    <button key={val} disabled={reviewSubmitted} onClick={() => setReviewAnswers(prev => ({...prev, q3: val}))} className={`text-left px-5 py-3 rounded-xl border-2 transition-all ${btnClass}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {!reviewSubmitted ? (
            <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end">
              <button 
                onClick={handleSubmitReview}
                disabled={!reviewAnswers.q1 || !reviewAnswers.q2 || !reviewAnswers.q3}
                className="bg-slate-900 text-white px-10 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md"
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div className="mt-10 p-8 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center animate-fade-in shadow-inner">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Review Completed</p>
              <p className={`text-5xl font-black mb-3 ${studentState.lesson1State.reviewScore >= 60 ? 'text-blue-600' : 'text-amber-500'}`}>
                {studentState.lesson1State.reviewScore}%
              </p>
              <p className="text-slate-700 mb-8 font-medium max-w-md mx-auto">
                {studentState.lesson1State.reviewScore === 100 
                  ? 'Excellent work! You have a solid grasp of these concepts.' 
                  : 'Review completed. Your score has been recorded for feedback. You may proceed regardless of score.'}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={() => { setReviewSubmitted(false); setReviewAnswers({q1:null, q2:null, q3:null}); }} className="px-6 py-3 text-slate-600 hover:text-slate-900 font-bold border-2 border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition">
                  Retake (Voluntary)
                </button>
                <button onClick={() => handleNext('speaking')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center gap-2">
                  Continue to Speaking Challenge <ArrowRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderSpeaking = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Speaking Challenge</h3>
          <p className="text-slate-600 font-medium mt-1">Apply what you learned in a simulated scenario.</p>
        </div>
        <Badge type="formative">Ungraded Practice</Badge>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl flex items-start gap-4 shadow-sm">
        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 font-medium">
          <p className="font-bold text-base mb-2">Instructions:</p>
          <p>Listen to the customer audio. Think about how to greet them, show empathy, and ask a polite clarifying question. Record your response, replay it, and complete the self-assessment. <span className="underline">This is not the formal research Pre-test.</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200 flex flex-col">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
            <Headphones className="w-5 h-5 text-indigo-500"/> Customer Scenario
          </h4>
          
          <CustomerAudioPlayer 
             text="Hi, I'm trying to use the billing portal, but the screen is just blank white."
             estimatedDurationSec={6}
             isFemale={true}
          />

          <p className="text-sm text-slate-700 italic border-l-4 border-indigo-300 pl-4 py-2 mt-5 font-medium bg-slate-50">
            "Hi, I'm trying to use the billing portal, but the screen is just blank white."
          </p>
          
          <div className="mt-auto pt-6 border-t border-slate-100">
            <button onClick={() => setShowHint(!showHint)} className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-2">
              <Lightbulb className="w-5 h-5"/> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-amber-900 border border-amber-200 animate-fade-in font-medium">
                Structure your response: Greeting + Empathy + Polite Question (e.g., "Could you tell me which browser you are using?")
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 border-2 border-slate-200 flex flex-col">
          <h4 className="font-bold text-slate-900 mb-4 text-lg">Your Response</h4>
          
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {recordingState === 'idle' && (
              <div className="text-center animate-fade-in w-full">
                <button 
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto hover:bg-red-200 transition-colors shadow-md mb-4"
                >
                  <Mic className="w-10 h-10" />
                </button>
                <p className="text-sm font-bold text-slate-700">Click to record</p>
              </div>
            )}

            {recordingState === 'recording' && (
              <div className="text-center animate-fade-in w-full">
                <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg mb-4">
                  <StopCircle className="w-10 h-10 cursor-pointer" onClick={stopRecording} />
                </div>
                <p className="text-sm font-black text-red-600 flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span> Recording... {formatTime(recordingTime)}
                </p>
              </div>
            )}

            {recordingState === 'recorded' && (
              <div className="w-full space-y-6 animate-fade-in">
                
                <RecordedAudioPlayer src={audioUrl} colorClass="bg-blue-600" lightColorClass="bg-blue-50" hoverClass="hover:bg-blue-700" textColorClass="text-blue-900" />
                
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                  <p className="font-bold text-slate-800 text-sm mb-3">Self-Assessment Checklist</p>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={selfAssessment.a} onChange={(e) => setSelfAssessment({...selfAssessment, a: e.target.checked})} className="mt-0.5 rounded text-blue-600 w-4 h-4 focus:ring-blue-500" />
                      Did I use a professional greeting?
                    </label>
                    <label className="flex items-start gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={selfAssessment.b} onChange={(e) => setSelfAssessment({...selfAssessment, b: e.target.checked})} className="mt-0.5 rounded text-blue-600 w-4 h-4 focus:ring-blue-500" />
                      Did I show empathy for the issue?
                    </label>
                    <label className="flex items-start gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={selfAssessment.c} onChange={(e) => setSelfAssessment({...selfAssessment, c: e.target.checked})} className="mt-0.5 rounded text-blue-600 w-4 h-4 focus:ring-blue-500" />
                      Did I ask a polite clarifying question?
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={recordAgain} className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1 font-bold transition-colors">
                    <RotateCcw className="w-4 h-4"/> Record Again
                  </button>
                  <button 
                    onClick={completeLesson}
                    disabled={!(selfAssessment.a || selfAssessment.b || selfAssessment.c)}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:bg-slate-300 transition-colors shadow-md"
                  >
                    Complete Practice
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6 mt-12 animate-fade-in">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <ThumbsUp className="w-12 h-12 text-emerald-600" />
      </div>
      <h2 className="text-3xl font-black text-slate-900">Lesson 1 Completed!</h2>
      <p className="text-lg text-slate-600 font-medium">Great job. You have successfully completed all required components for "Responding to Customer Enquiries".</p>
      
      <Card className="p-8 text-left max-w-md mx-auto bg-slate-50 border-slate-200 mt-6 shadow-md">
        <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 text-lg">Completion Summary</h4>
        <ul className="space-y-4 text-sm font-medium text-slate-700">
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> Concept Review Completed</li>
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> Formative Practice Completed</li>
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> Lesson Review Score: <span className="font-black text-slate-900">{studentState.lesson1State.bestReviewScore}%</span></li>
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500"/> Speaking Challenge Completed</li>
        </ul>
      </Card>

      <div className="pt-8">
        <button 
          onClick={() => navigateTo('student-dashboard')}
          className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all text-lg"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  const sections = [
    { id: 'situation', label: 'Workplace' },
    { id: 'learn', label: 'Learn' },
    { id: 'practice', label: 'Practice' },
    { id: 'review', label: 'Review' },
    { id: 'speaking', label: 'Speaking' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {currentSection !== 'results' && (
        <header className="mb-10">
          <Badge type="primary">Lesson 1</Badge>
          <h2 className="text-3xl font-black text-slate-900 mt-3 mb-8">Responding to Customer Enquiries</h2>
          
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-slate-200 -z-10 rounded-full"></div>
            {sections.map((sec, index) => {
              const isPast = studentState.lesson1State.sectionsCompleted[sec.id] || sections.findIndex(s => s.id === currentSection) > index;
              const isCurrent = currentSection === sec.id;
              return (
                <div key={sec.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 shadow-sm transition-all ${isCurrent ? 'bg-blue-600 border-blue-200 text-white transform scale-110' : isPast ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                    {isPast && !isCurrent ? <CheckCircle className="w-5 h-5"/> : index + 1}
                  </div>
                  <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${isCurrent ? 'text-blue-800' : isPast ? 'text-slate-600' : 'text-slate-400'}`}>{sec.label}</span>
                </div>
              )
            })}
          </div>
        </header>
      )}

      {currentSection === 'situation' && renderSituation()}
      {currentSection === 'learn' && renderLearn()}
      {currentSection === 'practice' && renderPractice()}
      {currentSection === 'review' && renderReview()}
      {currentSection === 'speaking' && renderSpeaking()}
      {currentSection === 'results' && renderResults()}
    </div>
  );
};

const AssessmentView = ({ type, navigateTo, studentState, updateStudentState }) => {
  const isCompleted = type === 'Pre-test' ? studentState.preTestCompleted : studentState.postTestCompleted;
  
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      window.speechSynthesis.cancel(); // Stop customer audio playback to avoid overlapping
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
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
    setRecordingState('idle');
    setRecordingTime(0);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 mt-12 animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">{type} Submitted</h2>
        <p className="text-slate-600 font-medium">Your response has been saved securely as part of the formal research data. Your individual result will not affect your university grade.</p>
        <button onClick={() => navigateTo('student-dashboard')} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-md">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (type === 'Pre-test') {
      updateStudentState('preTestAudioUrl', audioUrl);
      updateStudentState('preTestCompleted', true);
    } else {
      updateStudentState('postTestAudioUrl', audioUrl);
      updateStudentState('postTestCompleted', true);
    }
  };

  const customerText = type === 'Pre-test' 
    ? "Hi, I'm trying to access my important files for a meeting, but the system keeps giving me an error 503. I need these files immediately. Please help."
    : "Hello, every time I try to run the weekly sales report, the whole page just freezes and times out with a 408 error. This is urgent.";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <Badge type="research" className="mb-2">Formal Research Assessment</Badge>
          <h2 className="text-3xl font-black text-slate-900">{type}: Technical Support Communication</h2>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl flex items-start gap-4 shadow-sm">
        <AlertCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-900 font-medium">
          <p className="font-bold text-base mb-2">Assessment Instructions:</p>
          <p>Read the support ticket and listen to the customer's audio message. Record your spoken response as if you are the technical support agent handling this issue. <span className="font-bold bg-indigo-200/50 px-1 rounded block mt-2">This is a formal research assessment. No model answers are provided.</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col shadow-md border-slate-200">
          <div className="bg-slate-900 text-slate-300 p-3 font-mono text-xs flex justify-between items-center tracking-widest font-bold">
            <span>CRM SYSTEM - TICKET #{type==='Pre-test' ? 'TS-092' : 'TS-105'}</span>
            <span className="text-emerald-400">OPEN</span>
          </div>
          <div className="p-6 space-y-5 text-sm flex-1 font-medium">
            <div className="grid grid-cols-3 gap-y-3 gap-x-2">
              <span className="text-slate-500 font-bold">Customer:</span>
              <span className="col-span-2 text-slate-900">{type==='Pre-test' ? 'Ahmad Ibrahim (a.ibrahim@email.com)' : 'Sarah Lee (s.lee@email.com)'}</span>
              
              <span className="text-slate-500 font-bold">Product:</span>
              <span className="col-span-2 text-slate-900">{type==='Pre-test' ? 'Cloud Storage Pro' : 'Enterprise CRM Portal'}</span>
              
              <span className="text-slate-500 font-bold">Priority:</span>
              <span className="col-span-2"><Badge type="warning">High</Badge></span>
            </div>
            <div className="border-t border-slate-200 pt-5">
              <span className="text-slate-500 font-bold block mb-2">Issue Description (System Log):</span>
              <p className="text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner">
                {type==='Pre-test' 
                  ? 'User reports inability to access stored files. Error code 503 displayed upon login attempt. Account status is active.' 
                  : 'User states that generating the weekly sales report causes the system to time out. Error code 408.'}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 shadow-md border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Headphones className="w-5 h-5 text-blue-500"/> Customer Audio Message</h3>
            
            <CustomerAudioPlayer 
              text={customerText} 
              estimatedDurationSec={type === 'Pre-test' ? 9 : 10}
              isFemale={type !== 'Pre-test'} 
            />

            <p className="text-sm text-slate-600 mt-4 text-center italic font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{customerText}"
            </p>
          </Card>

          <Card className="p-6 border-2 border-indigo-200 shadow-md flex flex-col">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Your Spoken Response</h3>
            
            {recordingState === 'idle' && (
              <div className="text-center py-6 animate-fade-in w-full">
                <button 
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto hover:bg-red-200 transition-colors shadow-md"
                >
                  <Mic className="w-10 h-10" />
                </button>
                <p className="text-sm font-bold text-slate-700 mt-4">Click to start recording</p>
              </div>
            )}

            {recordingState === 'recording' && (
              <div className="text-center py-6 animate-fade-in w-full">
                <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg">
                  <StopCircle className="w-10 h-10 cursor-pointer" onClick={stopRecording} />
                </div>
                <p className="text-sm font-black text-red-600 mt-4 flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span> Recording... {formatTime(recordingTime)}
                </p>
              </div>
            )}

            {recordingState === 'recorded' && (
              <div className="space-y-5 py-2 animate-fade-in w-full">
                <RecordedAudioPlayer src={audioUrl} />
                
                <div className="flex justify-between items-center pt-2">
                  <button onClick={recordAgain} className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1 font-bold transition-colors">
                    <RotateCcw className="w-4 h-4"/> Record Again
                  </button>
                  <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-all">
                    Submit Recording <Send className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

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

const PlaceholderLessonView = ({ lessonId, navigateTo }) => {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return null;
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-center py-12">
      <Badge type="primary">Lesson {lesson.id}</Badge>
      <h2 className="text-3xl font-black text-slate-900 mt-4">{lesson.title}</h2>
      <p className="text-slate-600 mt-2 font-medium">Focus: {lesson.focus}</p>
      <Card className="p-12 text-center text-slate-500 bg-slate-50 border-dashed mt-8">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <h3 className="text-xl font-bold text-slate-700">Lesson Content Placeholder</h3>
        <p className="mt-3 max-w-md mx-auto font-medium">The detailed content for Lesson {lesson.id} follows the same robust architecture as Lesson 1. It is currently stubbed for this prototype demonstration.</p>
        <button onClick={() => navigateTo('student-dashboard')} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-md">Return to Dashboard</button>
      </Card>
    </div>
  );
};

const InstructorDashboard = ({ navigateTo }) => (
  <div className="space-y-8 animate-fade-in">
    <header className="border-b pb-6">
      <div className="flex items-center gap-3 mb-2">
        <Badge type="primary">Instructor View</Badge>
        <Badge type="warning">Demo Data</Badge>
      </div>
      <h2 className="text-3xl font-black text-slate-900">Module Administration</h2>
      <p className="text-slate-600 mt-2 font-medium">Monitor student progress and evaluate formal research assessments.</p>
    </header>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <Card className="p-5 border-l-4 border-l-blue-500 shadow-sm">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Students</p>
        <p className="text-4xl font-black text-slate-800 mt-2">45</p>
      </Card>
      <Card className="p-5 border-l-4 border-l-indigo-500 shadow-sm">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pre-tests Done</p>
        <p className="text-4xl font-black text-slate-800 mt-2">42</p>
      </Card>
      <Card className="p-5 border-l-4 border-l-teal-500 shadow-sm">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Post-tests Done</p>
        <p className="text-4xl font-black text-slate-800 mt-2">18</p>
      </Card>
      <Card className="p-5 bg-slate-900 text-white shadow-xl cursor-pointer hover:bg-slate-800 transition-colors transform hover:-translate-y-1" onClick={() => navigateTo('review-list')}>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">To Review</p>
        <div className="flex justify-between items-end mt-2">
          <p className="text-4xl font-black text-white">12</p>
          <ChevronRight className="w-6 h-6 text-slate-400 mb-1" />
        </div>
      </Card>
    </div>

    <Card className="overflow-hidden shadow-sm border-slate-200">
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">Student Progress Table <Badge type="warning">Demo Data</Badge></h3>
        <button onClick={() => navigateTo('students')} className="text-sm text-blue-600 font-bold hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4 text-center">Pre-test (25)</th>
              <th className="px-6 py-4 text-center">Post-test (25)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr className="hover:bg-slate-50 transition-colors font-medium">
              <td className="px-6 py-5">
                <div className="text-slate-900 font-bold">Student 001</div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">75%</span>
                </div>
              </td>
              <td className="px-6 py-5 text-center"><span className="text-indigo-700 font-black">14</span></td>
              <td className="px-6 py-5 text-center"><span className="text-slate-400 text-xs">Pending</span></td>
              <td className="px-6 py-5"><Badge type="primary">In Progress</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors font-medium">
              <td className="px-6 py-5">
                <div className="text-slate-900 font-bold">Student 002</div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">100%</span>
                </div>
              </td>
              <td className="px-6 py-5 text-center"><span className="text-indigo-700 font-black">16</span></td>
              <td className="px-6 py-5 text-center"><span className="text-indigo-700 font-black">21</span></td>
              <td className="px-6 py-5"><Badge type="success">Completed</Badge></td>
            </tr>
             <tr className="hover:bg-slate-50 transition-colors font-medium">
              <td className="px-6 py-5">
                <div className="text-slate-900 font-bold">Student 003</div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">60%</span>
                </div>
              </td>
              <td className="px-6 py-5 text-center"><span className="text-indigo-700 font-black">15</span></td>
              <td className="px-6 py-5 text-center"><span className="text-slate-400 text-xs">Pending</span></td>
              <td className="px-6 py-5"><Badge type="primary">In Progress</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

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

const InstructorResultsComparison = () => (
  <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
    <header className="border-b pb-4 text-center">
      <Badge type="warning" className="mb-2">Demo Data — Not Actual Research Results</Badge>
      <h2 className="text-3xl font-black text-slate-900">Instructor Results View</h2>
      <p className="text-slate-600 font-medium mt-1">Comparison of formal Pre-test and Post-test research assessment scores.</p>
    </header>

    <div className="space-y-6 mt-8">
      <Card className="p-8 shadow-md border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Student 001</h3>
            <p className="text-sm text-slate-500 font-medium">Formal Assessment Comparison</p>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score Change</p>
             <Badge type="success" className="text-sm px-3 py-1">+6 Points</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-300"></div>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pre-test</p>
             <p className="text-5xl font-black text-slate-800">14 <span className="text-xl text-slate-400">/ 25</span></p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
             <p className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Post-test</p>
             <p className="text-5xl font-black text-indigo-600">20 <span className="text-xl text-indigo-300">/ 25</span></p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const SubmissionReviewList = ({ navigateTo, studentState }) => {
  // Show dynamic row based on studentState's actual recordings to make the prototype realistic
  const hasPreTest = studentState.preTestCompleted;
  const hasPostTest = studentState.postTestCompleted;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="border-b pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-black text-slate-900">Speaking Submissions Review</h2>
          <Badge type="warning">Demo Data</Badge>
        </div>
        <p className="text-slate-600 font-medium">Evaluate recorded responses for formal Research Assessments.</p>
      </header>
      
      <Card className="overflow-hidden shadow-sm border-slate-200">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Assessment Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium">
              {hasPostTest && (
                <tr className="hover:bg-blue-50/50 transition bg-indigo-50/10">
                    <td className="px-6 py-5 text-slate-900 font-bold">{studentState.name} <span className="text-slate-400 font-normal ml-2 text-xs">({studentState.id})</span></td>
                    <td className="px-6 py-5"><Badge type="research">Post-test</Badge></td>
                    <td className="px-6 py-5"><Badge type="warning">New Submission</Badge></td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => navigateTo('review-detail')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-sm">Review Now</button>
                    </td>
                </tr>
              )}
              {hasPreTest && !hasPostTest && (
                <tr className="hover:bg-blue-50/50 transition bg-indigo-50/10">
                    <td className="px-6 py-5 text-slate-900 font-bold">{studentState.name} <span className="text-slate-400 font-normal ml-2 text-xs">({studentState.id})</span></td>
                    <td className="px-6 py-5"><Badge type="research">Pre-test</Badge></td>
                    <td className="px-6 py-5"><Badge type="warning">New Submission</Badge></td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => navigateTo('review-detail')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-sm">Review Now</button>
                    </td>
                </tr>
              )}
              <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-5">
                    <div className="text-slate-900 font-bold">Student 001</div>
                  </td>
                  <td className="px-6 py-5"><Badge type="research">Post-test</Badge></td>
                  <td className="px-6 py-5"><Badge type="warning">Awaiting Review</Badge></td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => navigateTo('review-detail')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm text-xs">Review</button>
                  </td>
              </tr>
              <tr className="bg-slate-50 opacity-70">
                  <td className="px-6 py-5">
                    <div className="text-slate-900 font-bold">Student 002</div>
                  </td>
                  <td className="px-6 py-5"><Badge type="research">Post-test</Badge></td>
                  <td className="px-6 py-5"><Badge type="success">Reviewed</Badge></td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-500 hover:text-slate-800 font-bold border border-slate-300 px-4 py-2 rounded-lg bg-white text-xs">View</button>
                  </td>
              </tr>
            </tbody>
          </table>
      </Card>
    </div>
  );
};

const SubmissionReviewDetail = ({ navigateTo, setInstructorFeedback, studentState }) => {
  // STRICTLY ADHERES TO THE NEW 25-POINT RUBRIC
  const [scores, setScores] = useState({ task_achievement: 0, interactive_communication: 0, vocabulary: 0, grammar: 0, pronunciation_fluency: 0 });
  const [feedback, setFeedback] = useState({ strengths: '', improvements: '', suggestions: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (critId, val) => {
    setScores(prev => ({ ...prev, [critId]: val }));
  };

  const handleSendFeedback = () => {
    setInstructorFeedback({
      score: totalScore,
      ...feedback
    });
    setFeedbackSent(true);
  };

  if (feedbackSent) {
    return (
       <div className="max-w-2xl mx-auto text-center space-y-6 mt-12 animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Feedback Sent Successfully</h2>
        <p className="text-slate-600 font-medium">The score ({totalScore}/25) and feedback have been recorded and sent to the student's portal.</p>
        <button onClick={() => navigateTo('review-list')} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-md">
          Return to Submissions
        </button>
      </div>
    )
  }

  // Use the actual audio the student recorded in the session if available
  const isPostTest = studentState.postTestCompleted;
  const audioUrl = isPostTest ? studentState.postTestAudioUrl : studentState.preTestAudioUrl;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-12">
      <div className="lg:col-span-1 space-y-6">
        <button onClick={() => navigateTo('review-list')} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-2 font-bold transition">
          <ArrowLeft className="w-4 h-4"/> Back to List
        </button>
        
        <div>
          <h2 className="text-2xl font-black text-slate-900">{studentState.name || 'Student 001'}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Assessment: <Badge type="research" className="ml-1">{isPostTest ? 'Post-test' : 'Pre-test'}</Badge></p>
          <p className="text-xs text-amber-600 font-bold mt-2 bg-amber-50 inline-block px-2 py-1 rounded border border-amber-200">Status: Submitted — Awaiting Review</p>
        </div>

        <Card className="p-5 bg-slate-50 border-slate-200">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Scenario Context</h3>
           <p className="text-sm text-slate-800 font-medium leading-relaxed">
             {isPostTest 
               ? "User states that generating the weekly sales report causes the system to time out. Error code 408." 
               : "Customer cannot log in to account. Error code 503 displayed upon login attempt."}
           </p>
        </Card>

        <Card className="p-6 border-2 border-indigo-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileAudio className="w-5 h-5 text-indigo-500"/> Audio Review</h3>
          
          <div className="-mx-2">
             <RecordedAudioPlayer src={audioUrl} />
          </div>
          
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="p-8 shadow-md border-slate-200">
          <div className="flex justify-between items-end border-b border-slate-200 pb-5 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Formal Speaking Rubric</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Used ONLY for formal Pre-test/Post-test assessment.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Score</p>
              <p className={`text-4xl font-black ${totalScore > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>{totalScore} <span className="text-lg text-slate-400 font-bold">/ 25</span></p>
            </div>
          </div>

          <div className="space-y-6">
             {/* CRITICAL RUBRIC IMPLEMENTATION */}
             {RUBRIC_CRITERIA.map(crit => (
              <div key={crit.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                <div className="mb-4">
                  <h4 className="font-bold text-slate-900 text-base">{crit.label}</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{crit.description}</p>
                </div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => handleScoreChange(crit.id, val)}
                      className={`flex-1 py-3 rounded-lg border-2 font-black text-lg transition-all ${
                        scores[crit.id] === val 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                          : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 shadow-md border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-5">Instructor Feedback</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Strengths</label>
              <textarea 
                value={feedback.strengths} onChange={e => setFeedback({...feedback, strengths: e.target.value})}
                className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:ring-0 focus:border-indigo-500 font-medium" rows="2" placeholder="e.g., Clear pronunciation, good task achievement..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Areas for Improvement</label>
              <textarea 
                 value={feedback.improvements} onChange={e => setFeedback({...feedback, improvements: e.target.value})}
                className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:ring-0 focus:border-indigo-500 font-medium" rows="2" placeholder="e.g., Needs wider range of technical vocabulary..."></textarea>
            </div>
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Suggestions</label>
              <textarea 
                 value={feedback.suggestions} onChange={e => setFeedback({...feedback, suggestions: e.target.value})}
                className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:ring-0 focus:border-indigo-500 font-medium" rows="2" placeholder="e.g., Practice using polite modal verbs when asking for details..."></textarea>
            </div>
            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
              <button className="px-6 py-3 rounded-lg font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition">Save Draft</button>
              <button 
                onClick={handleSendFeedback}
                disabled={totalScore === 0}
                className={`px-8 py-3 rounded-lg font-bold transition shadow-sm flex items-center gap-2 ${totalScore === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                Send Feedback to Student <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

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

const ExpertEvaluation = () => (
  <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
    <header className="border-b pb-4 text-center">
      <Badge type="research" className="mb-2">Research Instrument Mock-up</Badge>
      <h2 className="text-3xl font-black text-slate-900">Expert Evaluation</h2>
      <p className="text-slate-600 font-medium mt-1">Content and language validity evaluation form for subject matter experts.</p>
    </header>
    <Card className="p-8 space-y-6">
      <p className="text-slate-700 font-medium">Please rate the module on a scale from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
      {['Content Quality', 'Language Appropriateness', 'Learning Activities', 'Technical / Interface Quality', 'Overall Appropriateness'].map((cat, idx) => (
        <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <p className="font-bold text-slate-900 mb-4 text-lg">{idx + 1}. {cat}</p>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map(v => (
              <label key={v} className="flex-1 flex flex-col items-center gap-2 cursor-pointer group">
                <input type="radio" name={`eval_${idx}`} className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" /> 
                <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700">{v}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
       <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <label className="font-bold text-slate-900 mb-3 block text-lg">Comments / Suggestions</label>
          <textarea className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:ring-0 focus:border-blue-500 font-medium" rows="4"></textarea>
       </div>
    </Card>
  </div>
);

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