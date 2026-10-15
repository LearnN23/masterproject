import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Trash2, ShieldCheck, Download, Search, 
  Filter, CheckCircle2, AlertTriangle, RefreshCw, Database,
  FileSpreadsheet, Server, Award, Sparkles, Check, X,
  GraduationCap, Mic, HardDrive, KeyRound, Info
} from 'lucide-react';

export default function AdminDashboard({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    participant_code: '',
    role: 'student',
    cohort_group: 'Group_Main_Study',
    password: 'password123'
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Load Users & System Stats
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/stats')
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      setUsers(usersData || []);
      setStats(statsData || null);
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
      setFeedbackMsg({ text: `User "${newUser.name}" successfully created!`, type: 'success' });
      setShowAddModal(false);
      setNewUser({
        username: '',
        name: '',
        participant_code: '',
        role: 'student',
        cohort_group: 'Group_Main_Study',
        password: 'password123'
      });
      fetchData();
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 5000);
    }
  };

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

  // Filtered User list
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.participant_code && u.participant_code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter || (roleFilter === 'rater' && u.role.startsWith('rater'));
    const matchesCohort = cohortFilter === 'all' || u.cohort_group === cohortFilter;

    return matchesSearch && matchesRole && matchesCohort;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-200">Student</span>;
      case 'instructor':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">Instructor</span>;
      case 'rater':
      case 'rater_1':
      case 'rater_2':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-teal-100 text-teal-800 border border-teal-200">Rater / Evaluator</span>;
      case 'expert':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-purple-100 text-purple-800 border border-purple-200">Committee Expert</span>;
      case 'admin':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200">Administrator</span>;
      case 'tester':
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">QA Tester</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  const getCohortBadge = (cohort) => {
    switch (cohort) {
      case 'Group_Main_Study':
        return <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Main Cohort (Sequential)</span>;
      case 'Group_Pilot':
        return <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Pilot Cohort (Bypass)</span>;
      case 'Group_Pilot_Experts':
        return <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">Expert / Committee</span>;
      case 'Group_Evaluators':
        return <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">Evaluators</span>;
      case 'Group_Staff':
        return <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Staff / Admin</span>;
      default:
        return <span className="text-[11px] text-slate-600">{cohort}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full border border-rose-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator Console
              </span>
              <span className="text-xs text-slate-400 font-mono">SQLite WAL Engine</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">System & User Management</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-medium">
              Manage research participant accounts, cohort access groups, and export the official SPSS research dataset.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/api/export/credentials" 
              download="techquest_users_credentials.csv"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold shadow-md transition-all"
            >
              <KeyRound className="w-4 h-4" /> Download User Credentials (.csv)
            </a>
            <a 
              href="/api/export/spss" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Export SPSS (.csv)
            </a>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-md transition-all"
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

      {/* Stats Row */}
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
          <p className="text-xs text-slate-500 mt-3 font-medium">Students, instructors, raters, experts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audio Submissions</p>
              <p className="text-3xl font-black text-indigo-600 mt-2">{stats?.totalSubmissions ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Local single-take audio stored</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluations Logged</p>
              <p className="text-3xl font-black text-teal-600 mt-2">{stats?.totalEvaluations ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Instructor + Rater calibration</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Engine</p>
              <p className="text-base font-black text-slate-800 mt-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" /> SQLite WAL
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-3">Zero cloud egress costs</p>
        </div>
      </div>

      {/* Main User Roster & Filter Controls */}
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

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-semibold py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="rater">Rater / Evaluator</option>
              <option value="expert">Expert / Committee</option>
              <option value="admin">Administrator</option>
              <option value="tester">QA Tester</option>
            </select>

            {/* Cohort Filter */}
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="text-xs font-semibold py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Cohorts</option>
              <option value="Group_Main_Study">Group_Main_Study</option>
              <option value="Group_Pilot">Group_Pilot</option>
              <option value="Group_Pilot_Experts">Group_Pilot_Experts</option>
              <option value="Group_Evaluators">Group_Evaluators</option>
              <option value="Group_Staff">Group_Staff</option>
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
                <th className="px-6 py-4">Cohort Group</th>
                <th className="px-6 py-4">Created Date</th>
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
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
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
                      {deleteConfirmId === u.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={u.id === currentUser?.id}
                          onClick={() => setDeleteConfirmId(u.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.id === currentUser?.id 
                              ? 'text-slate-300 cursor-not-allowed' 
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={u.id === currentUser?.id ? "Cannot delete active user" : "Delete user"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
          <Info className="w-4 h-4 text-teal-400" /> Research Access & Progression Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="font-bold text-blue-400 block mb-1">Group_Main_Study</span>
            Strict sequential gate: Consent ➔ Pre-test ➔ Lesson 1 through Lesson 8 ➔ Post-test. Activity completion lock is enforced.
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="font-bold text-emerald-400 block mb-1">Group_Pilot & Testers</span>
            Bypass active: Zero activity completion lockouts. Enables QA inspection and formative pilot testing across all 8 lessons simultaneously.
          </div>
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="font-bold text-purple-400 block mb-1">Group_Pilot_Experts & Staff</span>
            Full interactive walkthrough access. Can review rubrics, inspect audio recordings, test any user role, and validate curriculum instruments.
          </div>
        </div>
      </div>

      {/* CREATE NEW USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" /> Add New Research User
                </h3>
                <p className="text-xs text-slate-400">Enroll new student, rater, expert, or tester in TECHQUEST</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Somsak Chareon"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. somsak"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value.toLowerCase().trim() }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Participant Code *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. STU-1026"
                    value={newUser.participant_code}
                    onChange={(e) => setNewUser(prev => ({ ...prev, participant_code: e.target.value.toUpperCase().trim() }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="rater">Rater (Pilot Calibration)</option>
                    <option value="expert">Expert (Thesis Committee)</option>
                    <option value="tester">QA Tester (Pilot Group)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cohort Group *</label>
                  <select
                    value={newUser.cohort_group}
                    onChange={(e) => setNewUser(prev => ({ ...prev, cohort_group: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Group_Main_Study">Group_Main_Study (Sequential)</option>
                    <option value="Group_Pilot">Group_Pilot (Bypass)</option>
                    <option value="Group_Pilot_Experts">Group_Pilot_Experts</option>
                    <option value="Group_Evaluators">Group_Evaluators</option>
                    <option value="Group_Staff">Group_Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Initial Password</label>
                <input 
                  type="text" 
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 font-mono focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Default is 'password123'. Participants can use this to sign in.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
