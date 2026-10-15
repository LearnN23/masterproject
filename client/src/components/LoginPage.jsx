import React, { useState } from 'react';
import { 
  Headphones, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Award, 
  Mic, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  FileSpreadsheet, 
  Info,
  Check
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'quick-test'

  // Pre-configured role accounts for fast testing
  const ROLE_PRESETS = [
    {
      role: 'student',
      title: 'Experimental Student',
      tag: 'Group_Main_Study',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: GraduationCap,
      color: 'bg-blue-600',
      username: 'student01',
      password: 'Student@2026#01',
      participantCode: 'STU-1001',
      name: 'Somchai Prasert',
      description: 'Sequential gates: Consent ➔ Pre-test ➔ Lessons 1–8 ➔ Post-test. Authoritative instructor grades.'
    },
    {
      role: 'instructor',
      title: 'Course Instructor',
      tag: 'Lead Evaluator',
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Award,
      color: 'bg-indigo-600',
      username: 'instructor01',
      password: 'Instructor@2026#1',
      participantCode: 'INST-01',
      name: 'Dr. Arisara Chantarat',
      description: 'Audio submission grading queue, 25-point analytic rubric, student roster, score delivery.'
    },
    {
      role: 'rater',
      title: 'Independent Rater',
      tag: 'Blind Calibration',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Mic,
      color: 'bg-teal-600',
      username: 'rater01',
      password: 'Rater@2026#1',
      participantCode: 'RATER-01',
      name: 'Dr. Kanya Charoenwong',
      description: 'Blind queue without student names for inter-rater reliability (ICC) analysis.'
    },
    {
      role: 'admin',
      title: 'System Administrator',
      tag: 'Admin & SPSS',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: ShieldCheck,
      color: 'bg-rose-600',
      username: 'admin01',
      password: 'Admin@2026#1',
      participantCode: 'ADMIN-01',
      name: 'TECHQUEST Lead Admin',
      description: 'User management (create/delete), SQLite engine health telemetry, 1-click credentials & SPSS export.'
    },
    {
      role: 'expert',
      title: 'Expert Committee',
      tag: 'Thesis Validation',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Sparkles,
      color: 'bg-purple-600',
      username: 'expert',
      password: 'Expert@2026#1',
      participantCode: 'EXPERT-01',
      name: 'Prof. Evaluation Committee',
      description: 'Master\'s thesis validation questionnaire (5 dimensions) + 1-click persona switcher.'
    },
    {
      role: 'tester',
      title: 'QA Tester',
      tag: 'Zero-Lock Bypass',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: RefreshCw,
      color: 'bg-amber-600',
      username: 'tester',
      password: 'Tester@2026#1',
      participantCode: 'TEST-001',
      name: 'Functional QA Tester',
      description: 'Bypasses all sequential gates and consent locks for rapid curriculum quality assurance.'
    }
  ];

  const executeLogin = async (loginUsername, loginPassword) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      if (rememberMe) {
        localStorage.setItem('techquest_user', JSON.stringify(data.user));
        if (data.progress) {
          localStorage.setItem('techquest_progress', JSON.stringify(data.progress));
        }
      } else {
        sessionStorage.setItem('techquest_user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.user, data.progress);
    } catch (err) {
      setError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username or participant code.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    executeLogin(username, password);
  };

  const handleSelectPreset = (preset, autoSignIn = false) => {
    setUsername(preset.username);
    setPassword(preset.password);
    setError(null);
    if (autoSignIn) {
      executeLogin(preset.username, preset.password);
    } else {
      setActiveTab('form');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Visual Context */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-white">TECHQUEST</h1>
                <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">EOP Voice Platform</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold leading-tight text-slate-100">
                English for IT Support Professionals
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Task-Based Language Teaching (TBLT) research platform featuring 8 IT support workplace simulation modules, 25-point analytic speaking rubrics, and multi-persona evaluation workflows.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>SQLite WAL Engine Authenticated</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Dual-Rater Blind Scoring & SPSS Export</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>32 Pre-Ready Research Accounts</span>
            </div>

            <div className="pt-2">
              <a
                href="/api/export/credentials"
                download="techquest_users_credentials.csv"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 hover:text-white transition-colors bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" /> Download Credentials CSV
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form & Role Tester */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/50">
          <div>
            {/* Header / Tabs */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black text-slate-900">Platform Sign In</h2>
                <p className="text-xs text-slate-500">Sign in with your database username and password</p>
              </div>

              <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'form' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Manual Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quick-test')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === 'quick-test' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Quick Role Tester
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="text-xs font-medium">
                  <p className="font-bold text-rose-800">Authentication Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* TAB 1: MANUAL SIGN IN FORM */}
            {activeTab === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Username or Participant Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. student01, instructor01, admin01, expert"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      autoComplete="username"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts either standard username or participant code (e.g. <span className="font-mono">STU-1001</span>, <span className="font-mono">INST-01</span>).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-medium text-slate-600">Remember session across refresh</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setActiveTab('quick-test')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Need test credentials?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying with Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: QUICK ROLE TESTER FOR EFFORTLESS MULTI-ROLE TESTING */}
            {activeTab === 'quick-test' && (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-900">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Fast Role Testing:</span> Click <strong>"Instant Sign In"</strong> to authenticate against the live SQLite database immediately, or <strong>"Fill Form"</strong> to populate credentials.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                  {ROLE_PRESETS.map((preset) => {
                    const IconComp = preset.icon;
                    return (
                      <div
                        key={preset.role}
                        className="bg-white border border-slate-200 rounded-xl p-3 hover:border-indigo-400 hover:shadow-sm transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg ${preset.color} text-white flex items-center justify-center shrink-0`}>
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-xs text-slate-900 leading-tight">{preset.title}</h3>
                                <p className="text-[10px] text-slate-500 font-mono">{preset.participantCode}</p>
                              </div>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${preset.tagColor}`}>
                              {preset.tag}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[10px] font-mono text-slate-600 mb-2 space-y-0.5">
                            <div><span className="text-slate-400">User:</span> <strong>{preset.username}</strong></div>
                            <div><span className="text-slate-400">Pass:</span> <strong>{preset.password}</strong></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleSelectPreset(preset, false)}
                            className="py-1 px-2 text-[10px] font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                          >
                            Fill Form
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectPreset(preset, true)}
                            disabled={loading}
                            className="py-1 px-2 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors text-center flex items-center justify-center gap-1 shadow-sm"
                          >
                            Instant Sign In <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>TECHQUEST Research • Master's Thesis</span>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'form' ? 'quick-test' : 'form')}
              className="text-indigo-600 font-bold hover:underline"
            >
              {activeTab === 'form' ? 'Show All 6 Test Roles' : 'Back to Manual Form'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
