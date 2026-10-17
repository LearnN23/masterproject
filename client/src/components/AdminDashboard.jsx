import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, UserPlus, Trash2, ShieldCheck, Download, Search, 
  Filter, CheckCircle2, AlertTriangle, RefreshCw, Database,
  FileSpreadsheet, Server, Award, Sparkles, Check, X,
  GraduationCap, Mic, HardDrive, KeyRound, Info, Edit3,
  Lock, Unlock, ChevronRight, Eye, CheckCircle, ListChecks,
  Scale, TrendingUp, BarChart3, Play, Pause, FileText, ArrowRight, Archive,
  RotateCcw
} from 'lucide-react';
import ScoreCalibrationStudio from './ScoreCalibrationStudio';
import DataExport from './DataExport';

// ============================================================================
// CANONICAL ROLES & COHORT ARCHITECTURE
// Grounded in Master's Thesis Research Design
// ============================================================================

export const ROLE_DEFINITIONS = {
  student: {
    id: 'student',
    label: 'Student',
    title: 'Research Student',
    tag: 'Learner',
    icon: GraduationCap,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    activeColor: 'border-blue-600 bg-blue-50/70 text-blue-900',
    defaultCohort: 'Group_Main_Study',
    codePrefix: 'STU-',
    summary: 'Learner enrolled in the curriculum. Receives authoritative instructor grades.',
    permissions: 'Sequential module locking (Consent ➔ Pre-test ➔ Lessons 1-8 ➔ Post-test), audio submission upload.'
  },
  instructor: {
    id: 'instructor',
    label: 'Instructor',
    title: 'Lead Course Instructor',
    tag: 'Lead Evaluator',
    icon: Award,
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    activeColor: 'border-indigo-600 bg-indigo-50/70 text-indigo-900',
    defaultCohort: 'Group_Staff',
    codePrefix: 'INST-',
    summary: 'Lead instructor grading oral responses with the official 25-point analytic rubric.',
    permissions: 'Authoritative audio grading queue, multi-task switcher, student roster, CEFR assignment, published student feedback.'
  },
  rater: {
    id: 'rater',
    label: 'Rater / Evaluator',
    title: 'Independent Blind Rater',
    tag: 'Calibration',
    icon: Mic,
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    activeColor: 'border-teal-600 bg-teal-50/70 text-teal-900',
    defaultCohort: 'Group_Evaluators',
    codePrefix: 'RATER-',
    summary: 'Independent evaluator scoring audio responses blindly for inter-rater reliability (ICC).',
    permissions: 'Blind audio queue (masked candidate codes), 25-point rubric scoring, calibration discrepancy alerts.'
  },
  expert: {
    id: 'expert',
    label: 'Committee Expert',
    title: 'Thesis Committee Expert',
    tag: 'Thesis Validation',
    icon: Sparkles,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    activeColor: 'border-purple-600 bg-purple-50/70 text-purple-900',
    defaultCohort: 'Group_Pilot_Experts',
    codePrefix: 'EXPERT-',
    summary: 'Master\'s thesis committee expert validating instructional design and TBLT construct validity.',
    permissions: 'Full unlocked walkthrough across all units, 5-dimension thesis validation form, 1-click persona switcher.'
  },
  tester: {
    id: 'tester',
    label: 'QA Tester',
    title: 'Functional QA Tester',
    tag: 'Quality Assurance',
    icon: RefreshCw,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    activeColor: 'border-amber-600 bg-amber-50/70 text-amber-900',
    defaultCohort: 'Group_Pilot',
    codePrefix: 'TEST-',
    summary: 'Unrestricted testing account to inspect and verify curriculum flow with zero lockouts.',
    permissions: 'Zero-lockout bypass across all 8 lessons, pre-test, post-test, quiz checks, and audio uploads.'
  },
  admin: {
    id: 'admin',
    label: 'Administrator',
    title: 'System Administrator',
    tag: 'Platform Admin',
    icon: ShieldCheck,
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    activeColor: 'border-rose-600 bg-rose-50/70 text-rose-900',
    defaultCohort: 'Group_Staff',
    codePrefix: 'ADMIN-',
    summary: 'Platform administrator overseeing participant rosters, database storage, and exports.',
    permissions: 'Create/edit/delete research users, inspect SQLite telemetry, download credentials CSV and SPSS dataset.'
  }
};

export const COHORT_DEFINITIONS = {
  Group_Main_Study: {
    id: 'Group_Main_Study',
    label: 'Main Study (Sequential Gating)',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Strict sequential gating: Consent ➔ Pre-test ➔ Lessons 1-8 ➔ Post-test.'
  },
  Group_Pilot: {
    id: 'Group_Pilot',
    label: 'Pilot / QA Testing (Unlocked)',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Bypass active: Zero activity completion lockouts for pilot and QA inspection.'
  },
  Group_Pilot_Experts: {
    id: 'Group_Pilot_Experts',
    label: 'Committee Experts',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Expert committee walkthrough and thesis validation questionnaire.'
  },
  Group_Evaluators: {
    id: 'Group_Evaluators',
    label: 'Independent Evaluators',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Blind raters for inter-rater reliability calibration (ICC).'
  },
  Group_Staff: {
    id: 'Group_Staff',
    label: 'Staff / Instructors & Admin',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Course instructors and system administrative personnel.'
  }
};

// Auto-generation helpers
const suggestNextCode = (role, currentUsers = []) => {
  if (role === 'student') {
    let maxNum = 1020;
    currentUsers.forEach(u => {
      const match = u.participant_code?.match(/STU-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `STU-${maxNum + 1}`;
  } else if (role === 'instructor') {
    let maxNum = 4;
    currentUsers.forEach(u => {
      const match = u.participant_code?.match(/INST-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `INST-${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'rater') {
    let maxNum = 4;
    currentUsers.forEach(u => {
      const match = u.participant_code?.match(/RATER-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `RATER-${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'admin') {
    let maxNum = 2;
    currentUsers.forEach(u => {
      const match = u.participant_code?.match(/ADMIN-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `ADMIN-${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'expert') {
    let maxNum = 1;
    currentUsers.forEach(u => {
      const match = u.participant_code?.match(/EXPERT-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `EXPERT-${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'tester') {
    let maxNum = 1;
    currentUsers.forEach(u => {
      const match = u.participant_code?.match(/TEST-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `TEST-${next < 10 ? '00' : next < 100 ? '0' : ''}${next}`;
  }
  return `P-${Math.floor(100 + Math.random() * 900)}`;
};

const suggestNextUsername = (role, currentUsers = []) => {
  if (role === 'student') {
    let maxNum = 20;
    currentUsers.forEach(u => {
      const match = u.username?.match(/^student(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `student${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'instructor') {
    let maxNum = 4;
    currentUsers.forEach(u => {
      const match = u.username?.match(/^instructor(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `instructor${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'rater') {
    let maxNum = 4;
    currentUsers.forEach(u => {
      const match = u.username?.match(/^rater(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `rater${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'admin') {
    let maxNum = 2;
    currentUsers.forEach(u => {
      const match = u.username?.match(/^admin(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `admin${next < 10 ? '0' : ''}${next}`;
  } else if (role === 'expert') {
    return `expert02`;
  } else if (role === 'tester') {
    return `tester02`;
  }
  return `user_${Date.now().toString(36).substring(4)}`;
};

const suggestDefaultPassword = (role) => {
  if (role === 'student') return 'Student@2026#01';
  if (role === 'instructor') return 'Instructor@2026#1';
  if (role === 'rater') return 'Rater@2026#1';
  if (role === 'admin') return 'Admin@2026#1';
  if (role === 'expert') return 'Expert@2026#1';
  if (role === 'tester') return 'Tester@2026#1';
  return 'Pass@2026#1';
};

export default function AdminDashboard({ currentUser, initialTab = 'cohort', navigateTo }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [cohortData, setCohortData] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // User Roster Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');

  // Cohort Matrix Filter State
  const [cohortSearch, setCohortSearch] = useState('');
  const [cohortFilterGroup, setCohortFilterGroup] = useState('all');
  const [cohortStatusFilter, setCohortStatusFilter] = useState('all');

  // Audio Playback in Cohort Matrix
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Audio Handler
  const handleToggleAudio = (url) => {
    if (!url) return;
    if (playingAudioUrl === url) {
      audioPlayerRef.current?.pause();
      setPlayingAudioUrl(null);
    } else {
      setPlayingAudioUrl(url);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play().catch(e => console.warn('Audio playback error:', e));
      }
    }
  };

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    participant_code: '',
    role: 'student',
    cohort_group: 'Group_Main_Study',
    password: 'Student@2026#01'
  });

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    username: '',
    participant_code: '',
    role: 'student',
    cohort_group: 'Group_Main_Study',
    password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Reset / Refresh Data Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetScope, setResetScope] = useState('all'); // 'all' | 'tests_only' | 'lessons_only' | 'single_user'
  const [selectedStudentForReset, setSelectedStudentForReset] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [includeConsentReset, setIncludeConsentReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleOpenResetModal = (scope = 'all', studentId = '', studentName = '') => {
    setResetScope(scope);
    if (studentId) {
      setSelectedStudentForReset(studentId);
      setSelectedStudentName(studentName || '');
    } else {
      const firstStudent = users.find(u => u.role === 'student');
      setSelectedStudentForReset(firstStudent?.id || '');
      setSelectedStudentName(firstStudent?.name || '');
    }
    setIncludeConsentReset(false);
    setShowResetModal(true);
  };

  const handleExecuteReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: resetScope,
          userId: resetScope === 'single_user' ? selectedStudentForReset : null,
          includeConsent: includeConsentReset
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset data');
      }

      // Clear client localStorage cache for clean state
      try {
        if (resetScope === 'all') {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('techquest_progress')) {
              localStorage.removeItem(key);
            }
          });
        } else if (resetScope === 'single_user' && selectedStudentForReset) {
          localStorage.removeItem(`techquest_progress_${selectedStudentForReset}`);
        }
      } catch (_) {}

      setFeedbackMsg({
        type: 'success',
        text: `Data Reset Complete! Wiped ${data.deletedSubmissions || 0} oral submissions, ${data.deletedEvaluations || 0} rater evaluations, ${data.deletedProgressRecords || 0} progress records, and ${data.deletedFiles || 0} audio recordings.`
      });

      setShowResetModal(false);
      await fetchData();
    } catch (err) {
      console.error('Reset execution error:', err);
      setFeedbackMsg({
        type: 'error',
        text: `Reset Failed: ${err.message}`
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Load Users, System Stats, Cohort Progress, Submissions
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, cohortRes, subsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/stats'),
        fetch('/api/cohort-overview'),
        fetch('/api/submissions')
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      const cohortOverview = await cohortRes.json();
      const subsData = await subsRes.json();
      setUsers(usersData || []);
      setStats(statsData || null);
      setCohortData(cohortOverview || []);
      setSubmissions(subsData || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setFeedbackMsg({ text: 'Error loading admin data from server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Add User Modal with pre-configured defaults
  const handleOpenAddModal = () => {
    const defaultRole = 'student';
    const nextCode = suggestNextCode(defaultRole, users);
    const nextUsername = suggestNextUsername(defaultRole, users);
    const defaultPass = suggestDefaultPassword(defaultRole);

    setNewUser({
      name: '',
      username: nextUsername,
      participant_code: nextCode,
      role: defaultRole,
      cohort_group: ROLE_DEFINITIONS[defaultRole].defaultCohort,
      password: defaultPass
    });
    setShowAddModal(true);
  };

  // When admin selects a role in the Add Modal, auto-bind everything
  const handleRoleSelectInAddModal = (roleKey) => {
    const roleDef = ROLE_DEFINITIONS[roleKey];
    if (!roleDef) return;

    const nextCode = suggestNextCode(roleKey, users);
    const nextUsername = suggestNextUsername(roleKey, users);
    const defaultPass = suggestDefaultPassword(roleKey);

    setNewUser(prev => ({
      ...prev,
      role: roleKey,
      cohort_group: roleDef.defaultCohort,
      participant_code: nextCode,
      username: prev.name.trim() ? prev.username : nextUsername,
      password: defaultPass
    }));
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.name.trim() || !newUser.participant_code.trim()) {
      setFeedbackMsg({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create user');
      }
      setFeedbackMsg({ text: `User "${newUser.name}" (${newUser.participant_code}) created successfully!`, type: 'success' });
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 5000);
    }
  };

  // Open Edit User Modal
  const handleStartEdit = (u) => {
    setEditingUser(u);
    setEditFormData({
      name: u.name || '',
      username: u.username || '',
      participant_code: u.participant_code || '',
      role: u.role || 'student',
      cohort_group: u.cohort_group || 'Group_Main_Study',
      password: ''
    });
  };

  // Save Edit User
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      const payload = {
        name: editFormData.name.trim(),
        username: editFormData.username.trim(),
        participant_code: editFormData.participant_code.trim(),
        role: editFormData.role,
        cohort_group: editFormData.cohort_group
      };
      if (editFormData.password.trim()) {
        payload.password = editFormData.password.trim();
      }

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update user');
      }
      setFeedbackMsg({ text: `User "${payload.name}" updated successfully!`, type: 'success' });
      setEditingUser(null);
      fetchData();
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 5000);
    }
  };

  // Delete User
  const handleDeleteUser = async (id, userName) => {
    if (id === currentUser?.id) {
      alert("You cannot delete the active logged-in administrator account.");
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to delete user');
      }
      setFeedbackMsg({ text: `User "${userName}" deleted.`, type: 'success' });
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 5000);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.participant_code && u.participant_code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter || (roleFilter === 'rater' && u.role.startsWith('rater'));
    const matchesCohort = cohortFilter === 'all' || u.cohort_group === cohortFilter;

    return matchesSearch && matchesRole && matchesCohort;
  });

  // Role counters
  const studentCount = users.filter(u => u.role === 'student').length;
  const instructorCount = users.filter(u => u.role === 'instructor').length;
  const raterCount = users.filter(u => u.role === 'rater' || u.role.startsWith('rater')).length;
  const expertCount = users.filter(u => u.role === 'expert').length;
  const testerCount = users.filter(u => u.role === 'tester').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const getRoleBadge = (role) => {
    const def = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS[role?.startsWith('rater') ? 'rater' : ''];
    if (def) {
      const Icon = def.icon;
      return (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 w-max ${def.badgeClass}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{def.label}</span>
        </span>
      );
    }
    return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-100 text-slate-700">{role}</span>;
  };

  const getCohortBadge = (cohort) => {
    const def = COHORT_DEFINITIONS[cohort];
    if (def) {
      return (
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${def.badgeClass}`} title={def.description}>
          {def.label}
        </span>
      );
    }
    return <span className="text-[11px] text-slate-600">{cohort}</span>;
  };

  const activeRoleDef = ROLE_DEFINITIONS[newUser.role] || ROLE_DEFINITIONS.student;

  // Cohort Metrics & Aggregations
  const totalStudents = cohortData.length;
  const consentedCount = cohortData.filter(s => s.hasConsent).length;
  const preDualScoredCount = cohortData.filter(s => s.preTest?.isDualScored).length;
  const postDualScoredCount = cohortData.filter(s => s.postTest?.isDualScored).length;
  const lessonsCompletedCount = cohortData.filter(s => s.lessons?.allCompleted).length;
  const totalDiscrepancies = cohortData.filter(s => s.preTest?.isDiscrepant || s.postTest?.isDiscrepant).length;

  const filteredCohort = cohortData.filter(s => {
    if (cohortSearch.trim()) {
      const q = cohortSearch.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchCode = s.participant_code?.toLowerCase().includes(q);
      const matchUser = s.username?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchUser) return false;
    }
    if (cohortFilterGroup !== 'all' && s.cohort_group !== cohortFilterGroup) {
      return false;
    }
    if (cohortStatusFilter === 'needs_dual_grading') {
      const preNeeds = s.preTest?.hasSubmission && !s.preTest?.isDualScored;
      const postNeeds = s.postTest?.hasSubmission && !s.postTest?.isDualScored;
      if (!preNeeds && !postNeeds) return false;
    } else if (cohortStatusFilter === 'discrepancies') {
      if (!s.preTest?.isDiscrepant && !s.postTest?.isDiscrepant) return false;
    } else if (cohortStatusFilter === 'completed') {
      if (!s.postTest?.isDualScored) return false;
    }
    return true;
  });

  const renderCohortTracker = () => (
    <div className="space-y-6">
      {/* Cohort Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Research Participants</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{totalStudents}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            <span className="font-bold text-emerald-600">{consentedCount}</span> ethics consent signed
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pre-Test Dual Graded</p>
              <p className="text-3xl font-black text-indigo-600 mt-2">{preDualScoredCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Diagnostic Form A (Baseline)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Post-Test Dual Graded</p>
              <p className="text-3xl font-black text-emerald-600 mt-2">{postDualScoredCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Outcome Form B (Post-Intervention)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discrepancy Alerts</p>
              <p className="text-3xl font-black text-rose-600 mt-2">{totalDiscrepancies}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Score Diff ≥ 5 pts (Calibration Needed)
          </p>
        </div>
      </div>

      {/* Cohort Progress & Dual Scoring Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-600" /> Master Cohort Pacing & Dual-Scoring Matrix ({filteredCohort.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Strict blind separation enforced: only Researcher/Admin sees side-by-side instructor & rater scores
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search participant..."
                value={cohortSearch}
                onChange={(e) => setCohortSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <select
              value={cohortFilterGroup}
              onChange={(e) => setCohortFilterGroup(e.target.value)}
              className="text-xs font-bold py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Cohort Groups</option>
              <option value="Group_Main_Study">Main Study (Sequential)</option>
              <option value="Group_Pilot">Pilot / QA (Bypass)</option>
            </select>

            <select
              value={cohortStatusFilter}
              onChange={(e) => setCohortStatusFilter(e.target.value)}
              className="text-xs font-bold py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="needs_dual_grading">Needs Dual Grading</option>
              <option value="discrepancies">Discrepancy Alerts (≥5 pts)</option>
              <option value="completed">Completed & Dual Scored</option>
            </select>

            <button
              onClick={fetchData}
              title="Refresh Cohort Data"
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Participant</th>
                <th className="px-3 py-3.5 text-center">Consent</th>
                <th className="px-4 py-3.5">Pre-Test (Diagnostic Form A)</th>
                <th className="px-4 py-3.5">Lessons 1–8 Progress</th>
                <th className="px-4 py-3.5">Post-Test (Outcome Form B)</th>
                <th className="px-3 py-3.5">Overall Stage</th>
                <th className="px-3 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCohort.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No participants match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCohort.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Participant Info */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {item.participant_code}
                          </span>
                          <span className="font-bold text-slate-800">{item.name}</span>
                        </div>
                        <div>
                          {getCohortBadge(item.cohort_group)}
                        </div>
                      </div>
                    </td>

                    {/* Ethics Consent */}
                    <td className="px-3 py-3.5 text-center">
                      {item.hasConsent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Signed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Pre-Test (Form A) */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {item.preTest.hasSubmission ? (
                            <>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                Audio Ready
                              </span>
                              {item.preTest.audioUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAudio(item.preTest.audioUrl)}
                                  className={`p-1 rounded-full text-xs transition ${
                                    playingAudioUrl === item.preTest.audioUrl 
                                      ? 'bg-rose-600 text-white animate-pulse' 
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="Play Pre-test Recording"
                                >
                                  {playingAudioUrl === item.preTest.audioUrl ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No audio</span>
                          )}
                        </div>

                        {item.preTest.hasSubmission && (
                          <div className="text-[11px] space-y-0.5 font-mono">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-500">Instructor:</span>
                              <span className={item.preTest.instructorScore !== null ? "font-bold text-slate-900" : "text-amber-600 italic"}>
                                {item.preTest.instructorScore !== null ? `${item.preTest.instructorScore}/20` : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-500">Rater:</span>
                              <span className={item.preTest.raterScore !== null ? "font-bold text-teal-700" : "text-amber-600 italic"}>
                                {item.preTest.raterScore !== null ? `${item.preTest.raterScore}/20` : 'Pending'}
                              </span>
                            </div>
                            {item.preTest.isDualScored && (
                              <div className="pt-0.5 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-slate-400 text-[10px]">Diff:</span>
                                {item.preTest.isDiscrepant ? (
                                  <span className="text-rose-600 font-black flex items-center gap-0.5 text-[10px] bg-rose-50 px-1 rounded">
                                    <AlertTriangle className="w-2.5 h-2.5" /> {item.preTest.diff} pts
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1 rounded">
                                    ±{item.preTest.diff} pts
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Lessons 1–8 Progress */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">{item.lessons.completedCount} of 8</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round((item.lessons.completedCount / 8) * 100)}%
                          </span>
                        </div>
                        <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.lessons.allCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${(item.lessons.completedCount / 8) * 100}%` }}
                          />
                        </div>
                        {item.lessons.allCompleted && (
                          <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Curriculum Complete
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Post-Test (Form B) */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {item.postTest.hasSubmission ? (
                            <>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Audio Ready
                              </span>
                              {item.postTest.audioUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAudio(item.postTest.audioUrl)}
                                  className={`p-1 rounded-full text-xs transition ${
                                    playingAudioUrl === item.postTest.audioUrl 
                                      ? 'bg-rose-600 text-white animate-pulse' 
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="Play Post-test Recording"
                                >
                                  {playingAudioUrl === item.postTest.audioUrl ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No audio</span>
                          )}
                        </div>

                        {item.postTest.hasSubmission && (
                          <div className="text-[11px] space-y-0.5 font-mono">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-500">Instructor:</span>
                              <span className={item.postTest.instructorScore !== null ? "font-bold text-slate-900" : "text-amber-600 italic"}>
                                {item.postTest.instructorScore !== null ? `${item.postTest.instructorScore}/20` : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-500">Rater:</span>
                              <span className={item.postTest.raterScore !== null ? "font-bold text-teal-700" : "text-amber-600 italic"}>
                                {item.postTest.raterScore !== null ? `${item.postTest.raterScore}/20` : 'Pending'}
                              </span>
                            </div>
                            {item.postTest.isDualScored && (
                              <div className="pt-0.5 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-slate-400 text-[10px]">Diff:</span>
                                {item.postTest.isDiscrepant ? (
                                  <span className="text-rose-600 font-black flex items-center gap-0.5 text-[10px] bg-rose-50 px-1 rounded">
                                    <AlertTriangle className="w-2.5 h-2.5" /> {item.postTest.diff} pts
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1 rounded">
                                    ±{item.postTest.diff} pts
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Overall Stage */}
                    <td className="px-3 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border whitespace-nowrap block text-center ${
                        item.overallStage.includes('Complete') 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : item.overallStage.includes('Lessons') 
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                            : item.overallStage.includes('Pre-test') 
                              ? 'bg-purple-50 text-purple-800 border-purple-200' 
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.overallStage}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveTab('calibration')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                          title="Open in Calibration Studio"
                        >
                          <Award className="w-3 h-3" />
                          <span>Calibrate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenResetModal('single_user', item.id, item.name)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                          title={`Reset test recordings & progress for ${item.name}`}
                        >
                          <RotateCcw className="w-3 h-3 text-rose-600" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceView = () => {
    const totalSubs = submissions.length;
    const preSubs = submissions.filter(s => s.assessment_type === 'pre_test').length;
    const postSubs = submissions.filter(s => s.assessment_type === 'post_test').length;
    const formativeSubs = submissions.filter(s => s.assessment_type === 'formative_speaking').length;
    const totalEvals = stats?.totalEvaluations || 0;

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Top Overview Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" /> System Maintenance Console
                </span>
                <span className="text-xs text-slate-400 font-mono">SQLite WAL Engine</span>
              </div>
              <h3 className="text-xl font-black text-white">Data Clean Up & Test Data Refresh</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Refresh test records, audio submissions, dual-rater score matrices, and student lesson progress after testing cycles. User logins and staff roles remain permanently preserved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenResetModal('all')}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg transition transform hover:scale-105 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Full System Clean Up</span>
            </button>
          </div>

          {/* Telemetry Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Oral Test Recordings</span>
              <span className="text-xl font-black text-white mt-0.5 block">{totalSubs}</span>
              <span className="text-[10px] text-indigo-300 font-mono mt-0.5 block">
                {preSubs} Pre / {postSubs} Post / {formativeSubs} Loop
              </span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rater Evaluations</span>
              <span className="text-xl font-black text-white mt-0.5 block">{totalEvals}</span>
              <span className="text-[10px] text-teal-300 font-mono mt-0.5 block">20 & 25-pt Rubric Grades</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Participants</span>
              <span className="text-xl font-black text-white mt-0.5 block">{cohortData.length}</span>
              <span className="text-[10px] text-emerald-300 font-mono mt-0.5 block">Main Study & Pilot</span>
            </div>
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Curricula</span>
              <span className="text-xl font-black text-white mt-0.5 block">
                {cohortData.filter(s => s.lessons?.allCompleted).length}
              </span>
              <span className="text-[10px] text-amber-300 font-mono mt-0.5 block">All 8 Lessons Done</span>
            </div>
          </div>
        </div>

        {/* Clean Up Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tests Only */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Reset Oral Tests & Scores</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Deletes Pre-test & Post-test oral recordings, rater scores, and marks test sections as not started.
                </p>
              </div>
              <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 text-[11px] text-purple-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5 text-purple-600" /> Preserves Lessons 1–8 Progress
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5 text-purple-600" /> Preserves Review Quiz Scores
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenResetModal('tests_only')}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Oral Tests Only</span>
            </button>
          </div>

          {/* Card 2: Lessons Only */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Reset Lesson Modules 1–8</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Locks Lessons 2–8, clears review quiz scores, completed sub-sections, loop tasks, and gamification badges.
                </p>
              </div>
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5 text-amber-600" /> Preserves Pre-test & Post-test Audio
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5 text-amber-600" /> Preserves Rater Evaluation Grades
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenResetModal('lessons_only')}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Modules 1–8 Only</span>
            </button>
          </div>

          {/* Card 3: Complete Factory Reset */}
          <div className="bg-gradient-to-b from-rose-50/50 to-white p-6 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-rose-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-rose-950">Factory Reset Clean Slate</h4>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">All Data</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Wipes ALL test recordings, rater evaluations, lesson progress, quiz scores, and badges for a brand-new testing batch.
                </p>
              </div>
              <div className="bg-rose-100/60 p-3 rounded-xl border border-rose-200 text-[11px] text-rose-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-700" /> Keeps All 33 User Accounts & Passwords
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-700" /> Ready for New Testing Cohort Immediately
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenResetModal('all')}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Full System Clean Up</span>
            </button>
          </div>
        </div>

        {/* Section 4: Single Participant Reset Console */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-base font-black text-slate-900">Individual Participant Reset Console</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Reset submissions and progress for a single student who needs to retake a test or redo a module
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
              Selective Reset
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={selectedStudentForReset}
              onChange={(e) => {
                setSelectedStudentForReset(e.target.value);
                const s = users.find(u => u.id === e.target.value);
                setSelectedStudentName(s?.name || '');
              }}
              className="w-full sm:flex-1 text-xs font-bold py-2.5 px-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {users.filter(u => u.role === 'student').map(s => (
                <option key={s.id} value={s.id}>
                  {s.participant_code} — {s.name} ({s.cohort_group})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handleOpenResetModal('single_user', selectedStudentForReset, selectedStudentName)}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Selected Student</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hidden Audio Player for Cohort Matrix */}
      <audio ref={audioPlayerRef} onEnded={() => setPlayingAudioUrl(null)} className="hidden" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full border border-rose-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Researcher & Thesis Console
              </span>
              <span className="text-xs text-slate-400 font-mono">Quasi-Experimental Study</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Researcher Hub & Thesis Analysis</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-medium">
              Oversee the full quasi-experimental research study: track participant progression across all units, calibrate dual-rater scores with strict blind isolation, and export SPSS statistical datasets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="/api/export/credentials" 
              download="techquest_users_credentials.csv"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <KeyRound className="w-4 h-4" /> Download Credentials (.csv)
            </a>
            <a 
              href="/api/export/spss" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Export SPSS (.csv)
            </a>
            <a 
              href="/api/backup/download" 
              download="TECHQUEST_Research_Backup.zip"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              title="Download complete snapshot: SQLite DB + Audio recordings + Audio Manifest + SPSS dataset in a single ZIP"
            >
              <Archive className="w-4 h-4" /> Full Backup (.zip)
            </a>
            <button
              type="button"
              onClick={() => handleOpenResetModal('all')}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition-all border border-rose-500/40 cursor-pointer"
              title="Clean up test submissions, rater evaluations, and student progress"
            >
              <RotateCcw className="w-4 h-4 text-rose-200" /> Clean Up / Reset Data
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                handleOpenAddModal();
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMsg.text && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-bold ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            {feedbackMsg.text}
          </div>
          <button onClick={() => setFeedbackMsg({ text: '', type: '' })} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto shadow-inner">
        <button
          onClick={() => setActiveTab('cohort')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'cohort'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 ring-2 ring-indigo-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Cohort Progress Tracker</span>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-black">
            {cohortData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('calibration')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'calibration'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 ring-2 ring-indigo-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Dual-Rater Calibration Matrix</span>
          {totalDiscrepancies > 0 && (
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" /> {totalDiscrepancies} Alert{totalDiscrepancies > 1 ? 's' : ''}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'export'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 ring-2 ring-indigo-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Research Data & SPSS</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 ring-2 ring-indigo-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Participant Accounts & System</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-black">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'maintenance'
              ? 'bg-white text-rose-700 shadow-sm border border-slate-200 ring-2 ring-rose-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Database className="w-4 h-4 text-rose-600" />
          <span>Data Clean Up & Maintenance</span>
        </button>
      </div>

      {/* Tab 1: Cohort Progress Tracker */}
      {activeTab === 'cohort' && renderCohortTracker()}

      {/* Tab 2: Dual-Rater Calibration Matrix */}
      {activeTab === 'calibration' && (
        <ScoreCalibrationStudio 
          currentUser={currentUser} 
          submissions={submissions} 
          onRefresh={fetchData} 
        />
      )}

      {/* Tab 3: Research Data & SPSS Export */}
      {activeTab === 'export' && <DataExport />}

      {/* Tab 4: Participant Accounts & System */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats?.totalUsers ?? users.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">32 Cohort Participants + System</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students Enrolled</p>
              <p className="text-3xl font-black text-indigo-600 mt-2">{studentCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Main Study & Pilot Students</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instructors & Raters</p>
              <p className="text-3xl font-black text-teal-600 mt-2">{instructorCount + raterCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">{instructorCount} Lead, {raterCount} Dual Raters</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audio Submissions</p>
              <p className="text-3xl font-black text-amber-600 mt-2">{stats?.totalSubmissions ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Preserved single-take recordings</p>
        </div>
      </div>

      {/* Roster & User Management Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Research User Roster ({filteredUsers.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Filter by role, cohort group, or search by participant code</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search name, code, user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Role Filter Pills */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-bold py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="student">Students ({studentCount})</option>
              <option value="instructor">Instructors ({instructorCount})</option>
              <option value="rater">Raters ({raterCount})</option>
              <option value="expert">Committee Experts ({expertCount})</option>
              <option value="tester">QA Testers ({testerCount})</option>
              <option value="admin">Administrators ({adminCount})</option>
            </select>

            {/* Cohort Filter */}
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="text-xs font-bold py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Cohorts</option>
              <option value="Group_Main_Study">Main Study (Sequential)</option>
              <option value="Group_Pilot">Pilot / QA (Bypass)</option>
              <option value="Group_Pilot_Experts">Pilot Experts</option>
              <option value="Group_Evaluators">Evaluators</option>
              <option value="Group_Staff">Staff</option>
            </select>

            <button
              onClick={fetchData}
              title="Refresh Roster"
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Participant Code & Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Cohort Access Group</th>
                <th className="px-6 py-4">Enrolled Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading research user accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 text-sm">
                    No users match your current search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {u.name ? u.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-xs font-mono text-indigo-600 font-bold">{u.participant_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 font-bold">
                      {u.username}
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getCohortBadge(u.cohort_group)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {deleteConfirmId === u.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Edit user details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              disabled={u.id === currentUser?.id}
                              onClick={() => setDeleteConfirmId(u.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.id === currentUser?.id 
                                  ? 'text-slate-200 cursor-not-allowed' 
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={u.id === currentUser?.id ? "Cannot delete active logged-in admin" : "Delete user"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort & Access Architecture Reference Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-400" /> Research Access & Progression Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="font-bold text-blue-400 block mb-1">Group_Main_Study (Sequential Lock)</span>
            Strict sequential gate: Consent ➔ Pre-test ➔ Lesson 1 through Lesson 8 ➔ Post-test. Activity completion lock is strictly enforced.
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="font-bold text-amber-400 block mb-1">Group_Pilot & Testers (Bypass)</span>
            Bypass active: Zero activity completion lockouts. Enables pilot trial participants and QA testers to inspect any module in any order.
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="font-bold text-purple-400 block mb-1">Group_Pilot_Experts & Staff</span>
            Full interactive walkthrough access. Can review rubrics, inspect audio recordings, grade responses, and validate curriculum instruments.
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Tab 5: Data Clean Up & Maintenance */}
      {activeTab === 'maintenance' && renderMaintenanceView()}

      {/* ========================================================================= */}
      {/* ADD NEW USER MODAL (SMART AUTO-BINDING ROLE WIZARD) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-scale-up max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" /> Add New Research User
                </h3>
                <p className="text-xs text-slate-400">Auto-binds role, permissions, and recommended cohort group</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Step 1: Visual Role Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select User Role & Functional Permission *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.values(ROLE_DEFINITIONS).map(r => {
                    const Icon = r.icon;
                    const isSelected = newUser.role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelectInAddModal(r.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? `${r.activeColor} ring-2 ring-indigo-500/30 shadow-sm font-bold` 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <p className="text-xs font-black">{r.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{r.tag}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role Context & Cohort Auto-binding Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-600" />
                    Auto-Assigned Cohort Group:
                  </span>
                  <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {newUser.cohort_group}
                  </span>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {activeRoleDef.summary}
                </p>

                {/* If role is student, allow switching between Main Study and Pilot */}
                {newUser.role === 'student' && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Student Progression Gate:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewUser(prev => ({
                          ...prev,
                          cohort_group: prev.cohort_group === 'Group_Main_Study' ? 'Group_Pilot' : 'Group_Main_Study'
                        }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                        newUser.cohort_group === 'Group_Main_Study'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-amber-600 text-white border-amber-600'
                      }`}
                    >
                      {newUser.cohort_group === 'Group_Main_Study' ? '✓ Main Study (Strict Sequential)' : '⚡ Pilot Study (Bypass Active)'}
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Account Details */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Account Credentials & Participant Identifiers *
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Somsak Chareon"
                    value={newUser.name}
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      setNewUser(prev => ({ ...prev, name: nameVal }));
                    }}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Username *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. student21"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value.toLowerCase().trim() }))}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Participant Code *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. STU-1021"
                      value={newUser.participant_code}
                      onChange={(e) => setNewUser(prev => ({ ...prev, participant_code: e.target.value.toUpperCase().trim() }))}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Password *</label>
                  <input 
                    type="text" 
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 font-mono focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Pre-configured with thesis research credential format.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Creating User...' : 'Create Research User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT USER MODAL */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-400" /> Edit User Account
                </h3>
                <p className="text-xs text-slate-400 font-mono">ID: {editingUser.participant_code}</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username *</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.username}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().trim() }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Participant Code *</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.participant_code}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, participant_code: e.target.value.toUpperCase().trim() }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Role *</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => {
                      const rKey = e.target.value;
                      const def = ROLE_DEFINITIONS[rKey];
                      setEditFormData(prev => ({
                        ...prev,
                        role: rKey,
                        cohort_group: def ? def.defaultCohort : prev.cohort_group
                      }));
                    }}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Object.values(ROLE_DEFINITIONS).map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cohort Group *</label>
                  <select
                    value={editFormData.cohort_group}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, cohort_group: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Object.values(COHORT_DEFINITIONS).map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Reset Password (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Leave blank to preserve current password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 font-mono focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Enter a new password only if the participant requested a reset.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DATA RESET & CLEAN UP CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  resetScope === 'all' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                }`}>
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {resetScope === 'all' && 'Confirm Full System Reset'}
                    {resetScope === 'tests_only' && 'Reset Test Submissions & Scores'}
                    {resetScope === 'lessons_only' && 'Reset Lesson Modules 1–8'}
                    {resetScope === 'single_user' && `Reset Participant: ${selectedStudentName || 'Selected Student'}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review the changes before applying this irreversible cleanup
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Details Card */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              resetScope === 'all'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : resetScope === 'tests_only'
                ? 'bg-purple-50 border-purple-200 text-purple-950'
                : resetScope === 'lessons_only'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-indigo-50 border-indigo-200 text-indigo-950'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-current shrink-0" />
                <span>The following data will be permanently wiped:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                {resetScope === 'all' && (
                  <>
                    <li>All Pre-test & Post-test oral recordings & audio files on disk</li>
                    <li>All Dual-Rater 20-point & 25-point evaluation score rubrics</li>
                    <li>All Student progress records (Lessons 1–8 reset to locked)</li>
                    <li>All Review quiz scores and gamification badges</li>
                  </>
                )}
                {resetScope === 'tests_only' && (
                  <>
                    <li>All Pre-test & Post-test oral audio submissions & disk files</li>
                    <li>All Dual-Rater evaluation rubrics and scores</li>
                    <li>Pre-test and Post-test status reset to "not started"</li>
                    <li className="font-semibold text-emerald-800">Lessons 1–8 progress & quiz scores will be KEPT</li>
                  </>
                )}
                {resetScope === 'lessons_only' && (
                  <>
                    <li>All Lesson 1–8 progress records (reset to locked)</li>
                    <li>All review quiz scores and loop task practice submissions</li>
                    <li>All earned gamification badges</li>
                    <li className="font-semibold text-emerald-800">Pre-test & Post-test oral submissions and rater grades will be KEPT</li>
                  </>
                )}
                {resetScope === 'single_user' && (
                  <>
                    <li>All audio recordings and test submissions for {selectedStudentName}</li>
                    <li>All evaluation grades assigned to this student</li>
                    <li>All lesson progress and quiz scores for this student</li>
                  </>
                )}
              </ul>
            </div>

            {/* Safety Reminder */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Account Preservation:</strong> All participant accounts, staff logins, passwords, and assigned roles remain safe and intact.
              </span>
            </div>

            {/* Optional Consent Reset */}
            <label className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={includeConsentReset}
                onChange={(e) => setIncludeConsentReset(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
              />
              <span>Also reset Research Ethics Consent (participants must re-sign consent on next login)</span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleExecuteReset}
                className={`px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-md transition flex items-center gap-2 cursor-pointer ${
                  resetScope === 'all'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resetting Data...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Confirm & Execute Reset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
