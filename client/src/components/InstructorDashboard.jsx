import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Award, CheckCircle2, Clock, Play, Pause, Save, 
  ShieldCheck, FileAudio, HelpCircle, ArrowLeft, Send,
  AlertTriangle, Download, RefreshCw, BarChart3, TrendingUp,
  Sparkles, Check, ChevronRight, Eye, Filter, GraduationCap,
  MessageSquare, Volume2, RotateCcw, AlertCircle
} from 'lucide-react';
import { RUBRIC_CRITERIA_25, getCefrRating, ASSESSMENTS_DATA } from '../data/assessmentsData';
import ScoreCalibrationStudio from './ScoreCalibrationStudio';

export default function InstructorDashboard({ currentUser, navigateTo }) {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'students', 'calibration'
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'pending', 'graded', 'pre_test', 'post_test', 'formative'
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedTaskNumber, setSelectedTaskNumber] = useState(1);

  // Instructor Rubric Scoring State (25-point Analytic Scale)
  const [scores, setScores] = useState({
    task_achievement: 0,
    interactive_comm: 0,
    vocabulary: 0,
    grammar: 0,
    pronunciation_fluency: 0
  });
  const [feedback, setFeedback] = useState({ strengths: '', improvements: '', suggestions: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [subsRes, usersRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/users')
      ]);
      const subsData = await subsRes.json();
      const usersData = await usersRes.json();

      setSubmissions(subsData || []);
      const stuList = (usersData || []).filter(u => u.role === 'student' || u.role === 'tester');
      setStudents(stuList);

      if (!selectedSub && subsData && subsData.length > 0) {
        // default select first pending instructor review or first submission
        const pending = subsData.find(s => !s.grades?.instructor);
        setSelectedSub(pending || subsData[0]);
      }
    } catch (e) {
      console.warn('Failed to load instructor dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // When selected submission changes, load existing instructor evaluation if available
  useEffect(() => {
    if (selectedSub) {
      const instGrade = selectedSub.grades?.instructor;
      if (instGrade) {
        setScores({
          task_achievement: instGrade.task_achievement || 0,
          interactive_comm: instGrade.interactive_comm || 0,
          vocabulary: instGrade.vocabulary || 0,
          grammar: instGrade.grammar || 0,
          pronunciation_fluency: instGrade.pronunciation_fluency || 0
        });
        setFeedback({
          strengths: instGrade.strengths || '',
          improvements: instGrade.areas_for_improvement || '',
          suggestions: instGrade.suggestions || ''
        });
      } else {
        // Reset scores
        setScores({
          task_achievement: 0,
          interactive_comm: 0,
          vocabulary: 0,
          grammar: 0,
          pronunciation_fluency: 0
        });
        setFeedback({ strengths: '', improvements: '', suggestions: '' });
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setSaveSuccess(false);

      if (selectedSub.task_audio_urls) {
        const keys = Object.keys(selectedSub.task_audio_urls).map(Number).sort((a, b) => a - b);
        setSelectedTaskNumber(keys.length > 0 ? keys[0] : 1);
      } else {
        setSelectedTaskNumber(1);
      }
    }
  }, [selectedSub?.id]);

  // Audio controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Score calculations
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const percentage = Math.round((totalScore / 25) * 100);
  const cefr = getCefrRating(totalScore);

  const handleScoreChange = (criterionId, val) => {
    setScores(prev => ({ ...prev, [criterionId]: val }));
  };

  const handleSaveEvaluation = async () => {
    if (!selectedSub) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        submissionId: selectedSub.id,
        raterId: currentUser?.id || 'usr_instructor',
        raterRole: 'instructor', // Authoritative role whose grade is received by student
        taskAchievement: scores.task_achievement,
        interactiveComm: scores.interactive_comm,
        vocabulary: scores.vocabulary,
        grammar: scores.grammar,
        pronunciationFluency: scores.pronunciation_fluency,
        strengths: feedback.strengths,
        areasForImprovement: feedback.improvements,
        suggestions: feedback.suggestions
      };

      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to save grade');
      }

      setSaveSuccess(true);
      // Refresh list to update UI
      fetchDashboardData();
    } catch (e) {
      alert(`Error saving grade: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtering submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (filterType === 'pending') return !sub.grades?.instructor;
    if (filterType === 'graded') return !!sub.grades?.instructor;
    if (filterType === 'pre_test') return sub.assessment_type === 'pre_test' || sub.unit_id === 'section_0';
    if (filterType === 'post_test') return sub.assessment_type === 'post_test' || sub.unit_id === 'section_9';
    if (filterType === 'formative') return sub.assessment_type === 'formative_speaking' || sub.unit_id?.startsWith('lesson_');
    return true;
  });

  // Calculate metrics
  const pendingCount = submissions.filter(s => !s.grades?.instructor).length;
  const gradedCount = submissions.filter(s => !!s.grades?.instructor).length;
  const preTestCount = submissions.filter(s => s.assessment_type === 'pre_test' || s.unit_id === 'section_0').length;
  const postTestCount = submissions.filter(s => s.assessment_type === 'post_test' || s.unit_id === 'section_9').length;
  const lessonsCount = submissions.filter(s => s.assessment_type === 'formative_speaking' || s.unit_id?.startsWith('lesson_')).length;

  // Derive active assessment & task metadata for selected submission
  const isPreTest = selectedSub?.assessment_type === 'pre_test' || selectedSub?.unit_id === 'section_0';
  const isPostTest = selectedSub?.assessment_type === 'post_test' || selectedSub?.unit_id === 'section_9';
  const currentAssessment = isPreTest ? ASSESSMENTS_DATA.pre_test : (isPostTest ? ASSESSMENTS_DATA.post_test : null);
  const activeTaskMeta = currentAssessment?.tasks?.find(t => t.taskNumber === Number(selectedTaskNumber)) || currentAssessment?.tasks?.[0] || null;

  // Active audio URL for playback (supports multi-task uploads)
  const taskUrls = selectedSub?.task_audio_urls || {};
  const activeAudioUrl = taskUrls[selectedTaskNumber] || (selectedTaskNumber === 1 ? selectedSub?.audio_url : null) || selectedSub?.audio_url || selectedSub?.audio_blob_path;

  // Calibration discrepancies (>20% difference between instructor and rater on 25-pt scale, i.e., >= 5 points)
  const calibrationDiscrepancies = submissions.filter(s => {
    const instTotal = s.grades?.instructor?.total_score;
    const raterTotal = s.grades?.rater?.total_score || s.grades?.rater1?.total_score;
    if (instTotal !== undefined && raterTotal !== undefined) {
      return Math.abs(instTotal - raterTotal) >= 5;
    }
    return false;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Lead Instructor Dashboard
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentUser?.participant_code || 'INST-01'}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">{currentUser?.name || 'Dr. Arisara (Lead Instructor)'}</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-medium">
              Grade spoken responses with the 25-point analytic rubric. Your evaluations are the authoritative scores delivered to student dashboards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/api/export/spss" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Export SPSS (.csv)
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-6 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'queue' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileAudio className="w-4 h-4" /> Audio Grading Queue
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-black">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Student Roster & Progress
          </button>
          <button
            onClick={() => setActiveTab('calibration')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calibration' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" /> Inter-Rater Calibration Matrix
            {calibrationDiscrepancies.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
                {calibrationDiscrepancies.length} Alert
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</p>
          <div className="flex justify-between items-end mt-2">
            <p className="text-3xl font-black text-slate-800">{submissions.length}</p>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Audio Logs</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Pre, Post & Lessons 1–8</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending My Review</p>
          <div className="flex justify-between items-end mt-2">
            <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Queue</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Awaiting instructor evaluation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published to Students</p>
          <div className="flex justify-between items-end mt-2">
            <p className="text-3xl font-black text-teal-600">{gradedCount}</p>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">Delivered</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Visible on student dashboard</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calibration Alerts</p>
          <div className="flex justify-between items-end mt-2">
            <p className={`text-3xl font-black ${calibrationDiscrepancies.length > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {calibrationDiscrepancies.length}
            </p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              calibrationDiscrepancies.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {calibrationDiscrepancies.length > 0 ? '>20% Diff' : 'Aligned'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Instructor vs Rater discrepancy</p>
        </div>
      </div>

      {/* TAB 1: AUDIO GRADING QUEUE & WORKSPACE */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submissions List (Left Col) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Submissions Queue ({filteredSubmissions.length})</h3>
                <p className="text-[11px] text-slate-500 font-medium">Select a student recording to evaluate</p>
              </div>
              <button 
                onClick={fetchDashboardData}
                title="Refresh"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="p-3 border-b border-slate-100 flex gap-1.5 overflow-x-auto text-xs bg-white">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                All ({submissions.length})
              </button>
              <button 
                onClick={() => setFilterType('pending')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${filterType === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Pending ({pendingCount})
              </button>
              <button 
                onClick={() => setFilterType('graded')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${filterType === 'graded' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Graded ({gradedCount})
              </button>
              <button 
                onClick={() => setFilterType('pre_test')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${filterType === 'pre_test' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Pre-Test ({preTestCount})
              </button>
              <button 
                onClick={() => setFilterType('formative')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${filterType === 'formative' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Lessons 1–8 ({lessonsCount})
              </button>
              <button 
                onClick={() => setFilterType('post_test')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${filterType === 'post_test' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Post-Test ({postTestCount})
              </button>
            </div>

            {/* Submissions Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No submissions found for the selected filter.
                </div>
              ) : (
                filteredSubmissions.map(sub => {
                  const isSelected = selectedSub?.id === sub.id;
                  const instScore = sub.grades?.instructor;
                  const raterScore = sub.grades?.rater || sub.grades?.rater1;
                  const instTotal = instScore ? (instScore.total_score ?? instScore.total) : null;
                  const instPct = instScore ? (instScore.total_percentage ?? instScore.percentage) : null;
                  const raterTotal = raterScore ? (raterScore.total_score ?? raterScore.total) : null;
                  const hasDiscrepancy = instTotal !== null && raterTotal !== null && Math.abs(instTotal - raterTotal) >= 5;
                  const isPre = sub.assessment_type === 'pre_test' || sub.unit_id === 'section_0';
                  const isPost = sub.assessment_type === 'post_test' || sub.unit_id === 'section_9';
                  const taskCount = sub.self_assessment?.completedTasks || (sub.task_audio_urls ? Object.keys(sub.task_audio_urls).length : null);

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50/70 border-l-4 border-l-blue-600' 
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {sub.blind_mask_code || sub.participant_code}
                          </span>
                          {isPre && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              Diagnostic Pre-Test
                            </span>
                          )}
                          {isPost && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                              Outcome Post-Test
                            </span>
                          )}
                          {!isPre && !isPost && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              Lesson Practice
                            </span>
                          )}
                          {taskCount > 1 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              {taskCount} Tasks
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {sub.submitted_at ? new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">
                        {sub.unit_title || sub.unit_id}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Student: {sub.student_name || sub.participant_code}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {instTotal !== null ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                            Instructor: {instTotal}/25 ({instPct}%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Needs Review
                          </span>
                        )}

                        {raterTotal !== null && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Rater: {raterTotal}/25
                          </span>
                        )}

                        {hasDiscrepancy && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200" title="Discrepancy >= 20% on 25-pt scale">
                            ! 20% Diff
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Grading Workspace (Right Col) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {selectedSub ? (
              <>
                {/* Active Case Banner */}
                <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded">
                        {selectedSub.assessment_type === 'pre_test' ? 'Diagnostic Pre-Test' : 
                         selectedSub.assessment_type === 'post_test' ? 'Formal Post-Test' : 
                         'Formative Lesson Practice'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Candidate: {selectedSub.blind_mask_code || selectedSub.participant_code}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900">{selectedSub.unit_title || selectedSub.unit_id}</h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Submitted on {selectedSub.submitted_at ? new Date(selectedSub.submitted_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Score</p>
                    <p className="text-3xl font-black text-indigo-600">
                      {totalScore} <span className="text-sm font-medium text-slate-400">/ 25</span>
                    </p>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      CEFR: {cefr?.cefr || 'A2'} ({percentage}%)
                    </span>
                  </div>
                </div>

                {/* Multi-Task Switcher & Task Context (For Pre-Test / Post-Test) */}
                {currentAssessment && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Assessment Tasks (Select Task to Review Audio)
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {selectedSub.self_assessment?.completedTasks || Object.keys(taskUrls).length || 1} of {currentAssessment.tasks.length} Recorded
                      </span>
                    </div>

                    {/* Task Tab Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {currentAssessment.tasks.map(t => {
                        const hasAudio = !!(taskUrls[t.taskNumber] || (t.taskNumber === 1 && selectedSub.audio_url));
                        const isActive = selectedTaskNumber === t.taskNumber;
                        return (
                          <button
                            key={t.taskNumber}
                            type="button"
                            onClick={() => {
                              setSelectedTaskNumber(t.taskNumber);
                              setIsPlaying(false);
                              setCurrentTime(0);
                            }}
                            className={`p-2.5 rounded-xl text-left transition-all border ${
                              isActive 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-black">
                              <span>Task {t.taskNumber}</span>
                              {hasAudio ? (
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-emerald-500'}`} title="Audio recorded" />
                              ) : (
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-slate-400' : 'bg-slate-300'}`} title="No audio file" />
                              )}
                            </div>
                            <p className={`text-[11px] mt-1 font-semibold line-clamp-1 ${isActive ? 'text-indigo-100' : 'text-slate-600'}`}>
                              {t.title}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Task Context & Caller Prompt */}
                    {activeTaskMeta && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            Task {activeTaskMeta.taskNumber}: {activeTaskMeta.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                            {activeTaskMeta.workplaceContext}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-slate-700 font-medium italic">
                          <span className="not-italic font-bold text-slate-500 text-[10px] block mb-0.5">Caller / Prompt:</span>
                          "{activeTaskMeta.customerPromptText}"
                        </div>
                        {activeTaskMeta.kpiList && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {activeTaskMeta.kpiList.map((kpi, kIdx) => (
                              <span key={kIdx} className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                                ✓ {kpi}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Audio Review Player */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-inner space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 text-teal-400 font-bold">
                      <Volume2 className="w-4 h-4" /> 
                      {currentAssessment 
                        ? `Task ${selectedTaskNumber} Audio Recording` 
                        : 'Single-Take Spoken Response Recording'}
                    </span>
                    <span className="font-mono text-slate-400">
                      {Math.floor(currentTime)}s / {duration ? Math.floor(duration) : (selectedSub.duration_seconds || 0)}s
                    </span>
                  </div>

                  {activeAudioUrl ? (
                    <>
                      <audio 
                        key={activeAudioUrl}
                        ref={audioRef}
                        src={activeAudioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />

                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                        <div 
                          className="bg-teal-400 h-full rounded-full transition-all duration-100"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>

                      {/* Player Controls */}
                      <div className="flex justify-between items-center pt-1">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center hover:bg-teal-300 font-bold shadow transition-colors"
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                          </button>
                          <button
                            onClick={restartAudio}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            title="Replay from beginning"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Speed Selector */}
                        <div className="flex items-center gap-1.5 text-xs bg-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-slate-400 font-semibold text-[10px]">Speed:</span>
                          {[0.8, 1.0, 1.2].map(spd => (
                            <button
                              key={spd}
                              onClick={() => handleSpeedChange(spd)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${playbackSpeed === spd ? 'bg-teal-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
                            >
                              {spd}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-slate-800/80 rounded-xl text-center text-xs text-slate-400">
                      No recording found for Task {selectedTaskNumber}. (Candidate may not have recorded this task).
                    </div>
                  )}
                </div>

                {/* Authoritative Delivery Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed font-medium">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authoritative Instructor Evaluation:</span> Scores and qualitative feedback saved here are immediately published to the student's dashboard. Rater scores remain internal for thesis calibration.
                  </div>
                </div>

                {/* 25-Point Analytic Rubric Sliders / Buttons */}
                <div className="space-y-4">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" /> 25-Point Analytic Speaking Rubric
                  </h3>

                  {RUBRIC_CRITERIA_25.map((crit, idx) => {
                    const currentVal = scores[crit.id] || 0;
                    return (
                      <div key={crit.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900 text-xs">
                              {idx + 1}. {crit.label}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">{crit.description}</p>
                          </div>
                          <span className="text-xs font-black text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {currentVal} / 5
                          </span>
                        </div>

                        {/* 1-5 Rating Selector */}
                        <div className="grid grid-cols-5 gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map(pt => (
                            <button
                              key={pt}
                              type="button"
                              onClick={() => handleScoreChange(crit.id, pt)}
                              className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                currentVal === pt 
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {pt} pt{pt > 1 ? 's' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Qualitative Feedback Textareas */}
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" /> Qualitative Feedback for Student
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Key Strengths Observed:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Excellent active listening, polite greeting, and precise IT vocabulary..."
                        value={feedback.strengths}
                        onChange={(e) => setFeedback(prev => ({ ...prev, strengths: e.target.value }))}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Areas for Improvement:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Remember to verify customer permission before requesting a remote desktop access..."
                        value={feedback.improvements}
                        onChange={(e) => setFeedback(prev => ({ ...prev, improvements: e.target.value }))}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pedagogical Suggestions / Next Steps:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Review Lesson 2 modal verbs for polite clarification..."
                        value={feedback.suggestions}
                        onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit / Publish Button */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Grade and feedback published to student!
                      </span>
                    )}
                  </div>

                  <button
                    disabled={isSaving || totalScore === 0}
                    onClick={handleSaveEvaluation}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Publishing Grade...' : 'Publish Authoritative Grade to Student'}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-16 text-center text-slate-400">
                <FileAudio className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-slate-600">Select a submission from the left queue to begin evaluating.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT COHORT PROGRESS ROSTER */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enrolled Students & Progress Roster ({students.length})</h3>
              <p className="text-xs text-slate-500 font-medium">Tracking sequential completion and speaking evaluation scores</p>
            </div>
            <a 
              href="/api/export/spss" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export SPSS Dataset
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Participant Code & Name</th>
                  <th className="px-6 py-4">Cohort Group</th>
                  <th className="px-6 py-4 text-center">Pre-Test (25)</th>
                  <th className="px-6 py-4 text-center">Formative Submissions</th>
                  <th className="px-6 py-4 text-center">Post-Test (25)</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium">
                {students.map(s => {
                  const studentSubs = submissions.filter(sub => sub.participant_code === s.participant_code || sub.user_id === s.id);
                  const preTestSub = studentSubs.find(sub => sub.assessment_type === 'pre_test');
                  const postTestSub = studentSubs.find(sub => sub.assessment_type === 'post_test');
                  const formativeSubs = studentSubs.filter(sub => sub.assessment_type === 'formative_speaking');

                  const preScore = preTestSub?.grades?.instructor?.total_score;
                  const postScore = postTestSub?.grades?.instructor?.total_score;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-xs font-mono text-indigo-600 font-bold">{s.participant_code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {s.cohort_group}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">
                        {preScore !== undefined ? (
                          <span className="text-indigo-600 font-black">{preScore}/25</span>
                        ) : preTestSub ? (
                          <span className="text-amber-600 text-xs">Pending Review</span>
                        ) : (
                          <span className="text-slate-400 text-xs">Not Taken</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                          {formativeSubs.length} / 8 Lessons
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">
                        {postScore !== undefined ? (
                          <span className="text-teal-600 font-black">{postScore}/25</span>
                        ) : postTestSub ? (
                          <span className="text-amber-600 text-xs">Pending Review</span>
                        ) : (
                          <span className="text-slate-400 text-xs">Locked / Not Taken</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          postScore ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {postScore ? 'Completed Cohort' : 'Active Learning'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INTER-RATER CALIBRATION STUDIO */}
      {activeTab === 'calibration' && (
        <ScoreCalibrationStudio
          currentUser={currentUser}
          submissions={submissions}
          onRefresh={fetchDashboardData}
        />
      )}
    </div>
  );
}
