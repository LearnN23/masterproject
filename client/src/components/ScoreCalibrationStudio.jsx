import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, AlertTriangle, CheckCircle2, Clock, Play, Pause, RotateCcw,
  Volume2, ShieldCheck, Download, Search, Filter, Sparkles, Check,
  ChevronRight, ArrowRight, X, Sliders, MessageSquare, FileAudio,
  UserCheck, AlertCircle, RefreshCw, BarChart2
} from 'lucide-react';
import { RUBRIC_CRITERIA_25, getCefrRating, ASSESSMENTS_DATA } from '../data/assessmentsData';

export default function ScoreCalibrationStudio({ currentUser, submissions: propSubmissions, onRefresh }) {
  const [submissions, setSubmissions] = useState(propSubmissions || []);
  const [loading, setLoading] = useState(!propSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'alerts', 'aligned', 'calibrated', 'pending'
  const [unitFilter, setUnitFilter] = useState('all'); // 'all', 'pre_test', 'lessons', 'post_test'
  
  // Active Calibration Modal State
  const [calibratingSub, setCalibratingSub] = useState(null);
  const [selectedTaskNumber, setSelectedTaskNumber] = useState(1);
  const [calibratedScores, setCalibratedScores] = useState({
    task_achievement: 3,
    interactive_comm: 3,
    vocabulary: 3,
    grammar: 3,
    pronunciation_fluency: 3
  });
  const [feedback, setFeedback] = useState({
    strengths: '',
    improvements: '',
    suggestions: ''
  });
  const [calibrationNotes, setCalibrationNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Audio Player State for Modal
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const fetchSubmissionsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data || []);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.warn('Failed to load submissions for calibration:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propSubmissions) {
      fetchSubmissionsData();
    } else {
      setSubmissions(propSubmissions);
    }
  }, [propSubmissions]);

  // Open Calibration Modal
  const handleOpenCalibration = (sub) => {
    setCalibratingSub(sub);
    const inst = sub.grades?.instructor || {};
    const rater = sub.grades?.rater || sub.grades?.rater1 || {};

    // Default calibrated scores: if already calibrated, load instructor; else average or instructor
    const ta = inst.task_achievement || rater.task_achievement || 3;
    const ic = inst.interactive_comm || rater.interactive_comm || 3;
    const voc = inst.vocabulary || rater.vocabulary || 3;
    const gr = inst.grammar || rater.grammar || 3;
    const pf = inst.pronunciation_fluency || rater.pronunciation_fluency || 3;

    setCalibratedScores({
      task_achievement: ta,
      interactive_comm: ic,
      vocabulary: voc,
      grammar: gr,
      pronunciation_fluency: pf
    });

    setFeedback({
      strengths: inst.strengths || rater.strengths || '',
      improvements: inst.areas_for_improvement || rater.areas_for_improvement || '',
      suggestions: inst.suggestions || rater.suggestions || ''
    });

    setCalibrationNotes(inst.calibration_notes || '');
    setSaveSuccess(false);
    setIsPlaying(false);
    setCurrentTime(0);

    // Multi-task handling
    if (sub.task_audio_urls) {
      const keys = Object.keys(sub.task_audio_urls).map(Number).sort((a, b) => a - b);
      setSelectedTaskNumber(keys.length > 0 ? keys[0] : 1);
    } else {
      setSelectedTaskNumber(1);
    }
  };

  const handleCloseCalibration = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCalibratingSub(null);
    setIsPlaying(false);
  };

  // Audio Player Controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const replayAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Quick Calibration Presets
  const handleAdoptPreset = (presetType) => {
    if (!calibratingSub) return;
    const inst = calibratingSub.grades?.instructor || {};
    const rater = calibratingSub.grades?.rater || calibratingSub.grades?.rater1 || {};

    if (presetType === 'instructor') {
      setCalibratedScores({
        task_achievement: inst.task_achievement || 3,
        interactive_comm: inst.interactive_comm || 3,
        vocabulary: inst.vocabulary || 3,
        grammar: inst.grammar || 3,
        pronunciation_fluency: inst.pronunciation_fluency || 3
      });
      setFeedback({
        strengths: inst.strengths || '',
        improvements: inst.areas_for_improvement || '',
        suggestions: inst.suggestions || ''
      });
      setCalibrationNotes(`Consensus: Confirmed Lead Instructor evaluation.`);
    } else if (presetType === 'rater') {
      setCalibratedScores({
        task_achievement: rater.task_achievement || 3,
        interactive_comm: rater.interactive_comm || 3,
        vocabulary: rater.vocabulary || 3,
        grammar: rater.grammar || 3,
        pronunciation_fluency: rater.pronunciation_fluency || 3
      });
      setFeedback({
        strengths: rater.strengths || inst.strengths || '',
        improvements: rater.areas_for_improvement || inst.areas_for_improvement || '',
        suggestions: rater.suggestions || inst.suggestions || ''
      });
      setCalibrationNotes(`Consensus: Reconciled to Independent Rater scoring.`);
    } else if (presetType === 'average') {
      const avg = (v1, v2) => Math.min(5, Math.max(1, Math.round(((v1 || 3) + (v2 || 3)) / 2)));
      setCalibratedScores({
        task_achievement: avg(inst.task_achievement, rater.task_achievement),
        interactive_comm: avg(inst.interactive_comm, rater.interactive_comm),
        vocabulary: avg(inst.vocabulary, rater.vocabulary),
        grammar: avg(inst.grammar, rater.grammar),
        pronunciation_fluency: avg(inst.pronunciation_fluency, rater.pronunciation_fluency)
      });
      setCalibrationNotes(`Consensus: Reconciled via arithmetic midpoint between Instructor (${inst.total_score || 'N/A'}) and Rater (${rater.total_score || 'N/A'}).`);
    }
  };

  // Save Calibrated Consensus Score
  const handleSaveCalibratedScore = async () => {
    if (!calibratingSub) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        submissionId: calibratingSub.id,
        calibratedBy: currentUser?.id || currentUser?.username || 'instructor',
        scores: calibratedScores,
        taskAchievement: calibratedScores.task_achievement,
        interactiveComm: calibratedScores.interactive_comm,
        vocabulary: calibratedScores.vocabulary,
        grammar: calibratedScores.grammar,
        pronunciationFluency: calibratedScores.pronunciation_fluency,
        strengths: feedback.strengths,
        areasForImprovement: feedback.improvements,
        suggestions: feedback.suggestions,
        calibrationNotes: calibrationNotes || 'Calibrated consensus score saved.'
      };

      const res = await fetch('/api/calibration/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to save calibration');
      }

      setSaveSuccess(true);
      await fetchSubmissionsData();
      setTimeout(() => {
        handleCloseCalibration();
      }, 1200);
    } catch (err) {
      alert(`Calibration save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Metrics Calculations
  const dualRatedSubs = submissions.filter(s => s.grades?.instructor && (s.grades?.rater || s.grades?.rater1));
  const alertsList = dualRatedSubs.filter(s => {
    const instTotal = s.grades?.instructor?.total_score ?? s.grades?.instructor?.total;
    const raterTotal = s.grades?.rater?.total_score ?? s.grades?.rater?.total ?? s.grades?.rater1?.total;
    return instTotal !== undefined && raterTotal !== undefined && Math.abs(instTotal - raterTotal) >= 5;
  });
  const alignedList = dualRatedSubs.filter(s => {
    const instTotal = s.grades?.instructor?.total_score ?? s.grades?.instructor?.total;
    const raterTotal = s.grades?.rater?.total_score ?? s.grades?.rater?.total ?? s.grades?.rater1?.total;
    return instTotal !== undefined && raterTotal !== undefined && Math.abs(instTotal - raterTotal) < 5;
  });
  const calibratedList = submissions.filter(s => s.grades?.instructor?.is_calibrated);

  const agreementPct = dualRatedSubs.length > 0 
    ? Math.round((alignedList.length / dualRatedSubs.length) * 100) 
    : 100;

  // Filter Submissions
  const filteredSubmissions = submissions.filter(s => {
    const inst = s.grades?.instructor;
    const rater = s.grades?.rater || s.grades?.rater1;
    const hasBoth = Boolean(inst && rater);
    const instTotal = inst?.total_score ?? inst?.total;
    const raterTotal = rater?.total_score ?? rater?.total;
    const diff = (instTotal !== undefined && raterTotal !== undefined) ? Math.abs(instTotal - raterTotal) : null;
    const isAlert = diff !== null && diff >= 5;
    const isAligned = diff !== null && diff < 5;
    const isCalibrated = Boolean(inst?.is_calibrated);

    // Status Filter
    if (statusFilter === 'alerts' && !isAlert) return false;
    if (statusFilter === 'aligned' && !isAligned) return false;
    if (statusFilter === 'calibrated' && !isCalibrated) return false;
    if (statusFilter === 'pending' && hasBoth) return false;

    // Unit Filter
    if (unitFilter === 'pre_test' && !(s.assessment_type === 'pre_test' || s.unit_id === 'section_0')) return false;
    if (unitFilter === 'post_test' && !(s.assessment_type === 'post_test' || s.unit_id === 'section_9')) return false;
    if (unitFilter === 'lessons' && !(s.assessment_type === 'formative_speaking' || s.unit_id?.startsWith('lesson_'))) return false;

    // Search Term Filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const code = (s.participant_code || s.blind_mask_code || '').toLowerCase();
      const name = (s.name || s.student_name || '').toLowerCase();
      const title = (s.unit_title || s.unit_id || '').toLowerCase();
      if (!code.includes(q) && !name.includes(q) && !title.includes(q)) return false;
    }

    return true;
  });

  // Calculate live calibrated total
  const liveCalibratedTotal = Object.values(calibratedScores).reduce((a, b) => a + (Number(b) || 0), 0);
  const liveCefr = getCefrRating(liveCalibratedTotal);

  // Active audio URL for playback in modal
  const modalTaskUrls = calibratingSub?.task_audio_urls || {};
  const modalActiveAudioUrl = modalTaskUrls[selectedTaskNumber] || 
    (selectedTaskNumber === 1 ? calibratingSub?.audio_url : null) || 
    calibratingSub?.audio_url || 
    calibratingSub?.audio_blob_path;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Score Calibration & Consensus Studio
              </span>
              <span className="text-xs text-purple-300 font-mono">
                Active Role: {currentUser?.name || 'Authorized Evaluator'} ({currentUser?.role})
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Dual-Rater Inter-Rater Reliability Hub</h2>
            <p className="text-slate-300 text-xs mt-1 max-w-3xl font-medium leading-relaxed">
              Compare ratings from the Course Instructor and Independent Rater. Discrepancies exceeding 20% (&ge; 5 points on the 25-pt scale) are flagged for consensus moderation. Calibrated scores are published directly to students as their final authoritative grades.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchSubmissionsData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/api/export/spss"
              download="TECHQUEST_SPSS_Dataset.csv"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SPSS CSV Export</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 KPI METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Dual-Rated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dual-Rated Pool</p>
          <div className="flex justify-between items-end mt-2">
            <p className="text-3xl font-black text-slate-900">{dualRatedSubs.length}</p>
            <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
              of {submissions.length} total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Submissions with &ge; 2 ratings</p>
        </div>

        {/* Card 2: Agreement % */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rater Agreement</p>
          <div className="flex justify-between items-end mt-2">
            <p className="text-3xl font-black text-emerald-600">{agreementPct}%</p>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              {alignedList.length} Aligned
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Within &plusmn; 4 points (&lt; 20% diff)</p>
        </div>

        {/* Card 3: Discrepancy Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discrepancy Alerts</p>
          <div className="flex justify-between items-end mt-2">
            <p className={`text-3xl font-black ${alertsList.length > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {alertsList.length}
            </p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              alertsList.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {alertsList.length > 0 ? 'Consensus Req.' : 'None'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">&ge; 5 points (&ge; 20% gap)</p>
        </div>

        {/* Card 4: Calibrated & Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calibrated</p>
          <div className="flex justify-between items-end mt-2">
            <p className="text-3xl font-black text-purple-600">{calibratedList.length}</p>
            <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
              Reconciled
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Authoritative consensus saved</p>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setStatusFilter('alerts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                statusFilter === 'alerts' ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Alerts &ge;5 pts ({alertsList.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('aligned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                statusFilter === 'aligned' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aligned ({alignedList.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('calibrated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                statusFilter === 'calibrated' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Calibrated ({calibratedList.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === 'pending' ? 'bg-slate-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending 2nd Rater
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, student, or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Unit Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Filter by Unit:</span>
          {['all', 'pre_test', 'lessons', 'post_test'].map((uf) => (
            <button
              key={uf}
              onClick={() => setUnitFilter(uf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                unitFilter === uf ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {uf === 'all' && 'All Units'}
              {uf === 'pre_test' && 'Pre-Test Form A'}
              {uf === 'lessons' && 'Lessons 1–8 Formative'}
              {uf === 'post_test' && 'Post-Test Form B'}
            </button>
          ))}
        </div>
      </div>

      {/* DUAL-RATER ROSTER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Dual-Rater Scoring Roster</h3>
            <p className="text-xs text-slate-500 font-medium">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">Assessment Unit</th>
                <th className="px-5 py-3.5 text-center">Instructor (25)</th>
                <th className="px-5 py-3.5 text-center">Rater (25)</th>
                <th className="px-5 py-3.5 text-center">Score Delta (&Delta;)</th>
                <th className="px-5 py-3.5 text-center">Calibration Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-400 italic">
                    No submissions matched the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const inst = sub.grades?.instructor;
                  const rater = sub.grades?.rater || sub.grades?.rater1;
                  const instTotal = inst ? (inst.total_score ?? inst.total) : null;
                  const raterTotal = rater ? (rater.total_score ?? rater.total) : null;
                  const diff = (instTotal !== null && raterTotal !== null) ? Math.abs(instTotal - raterTotal) : null;
                  const exceeds20Pct = diff !== null && diff >= 5;
                  const isCalibrated = Boolean(inst?.is_calibrated);

                  const instCefr = instTotal !== null ? getCefrRating(instTotal) : null;
                  const raterCefr = raterTotal !== null ? getCefrRating(raterTotal) : null;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Participant */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-slate-900">
                          {sub.blind_mask_code || sub.participant_code}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {sub.name || 'Candidate'} &bull; {new Date(sub.submitted_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Assessment Unit */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">
                          {sub.unit_title || sub.unit_id}
                        </div>
                        <span className="inline-block text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.2 rounded mt-0.5">
                          {sub.assessment_type || 'Speaking'}
                        </span>
                      </td>

                      {/* Instructor Score */}
                      <td className="px-5 py-4 text-center">
                        {instTotal !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                              {instTotal} / 25
                            </span>
                            <span className="text-[10px] text-indigo-500 font-bold mt-0.5">
                              {instCefr?.cefr}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Rater Score */}
                      <td className="px-5 py-4 text-center">
                        {raterTotal !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                              {raterTotal} / 25
                            </span>
                            <span className="text-[10px] text-teal-500 font-bold mt-0.5">
                              {raterCefr?.cefr}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Score Delta */}
                      <td className="px-5 py-4 text-center font-bold">
                        {diff !== null ? (
                          <span className={`text-[11px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                            exceeds20Pct 
                              ? 'bg-rose-100 text-rose-800 font-black border border-rose-200' 
                              : diff >= 3 
                              ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {diff} pts ({Math.round((diff / 25) * 100)}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        {isCalibrated ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-purple-600" /> Calibrated
                          </span>
                        ) : exceeds20Pct ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Consensus Required
                          </span>
                        ) : diff !== null ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Aligned (&lt;20%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Awaiting 2nd Rater</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleOpenCalibration(sub)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition inline-flex items-center gap-1.5 shadow-sm ${
                            exceeds20Pct && !isCalibrated
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : isCalibrated
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          <Sliders className="w-3 h-3" />
                          <span>{exceeds20Pct && !isCalibrated ? 'Reconcile' : isCalibrated ? 'Inspect' : 'Calibrate'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALIBRATION DEEP-DIVE MODAL */}
      {calibratingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 border-b border-indigo-900/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Consensus Adjudication
                  </span>
                  <span className="text-xs text-purple-300 font-mono">
                    Candidate: {calibratingSub.blind_mask_code || calibratingSub.participant_code}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Score Calibration: {calibratingSub.unit_title || calibratingSub.unit_id}
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Reconcile the 5 rubric criteria between Instructor and Rater. The saved result will become the authoritative score shown to the student.
                </p>
              </div>

              <button
                onClick={handleCloseCalibration}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* AUDIO PLAYER & MULTI-TASK SELECTOR */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-inner">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Spoken Performance Recording
                    </span>
                  </div>

                  {/* Multi-task selector buttons if Pre-test or Post-test */}
                  {calibratingSub.task_audio_urls && Object.keys(calibratingSub.task_audio_urls).length > 1 && (
                    <div className="flex gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                      {Object.keys(calibratingSub.task_audio_urls).map((taskNum) => (
                        <button
                          key={taskNum}
                          onClick={() => {
                            setSelectedTaskNumber(Number(taskNum));
                            setIsPlaying(false);
                            setCurrentTime(0);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            Number(selectedTaskNumber) === Number(taskNum)
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Task {taskNum}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audio Element & Controls */}
                {modalActiveAudioUrl ? (
                  <div className="space-y-3">
                    <audio
                      ref={audioRef}
                      src={modalActiveAudioUrl}
                      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                      onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />

                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shadow-lg shrink-0"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1.5">
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative cursor-pointer"
                          onClick={(e) => {
                            if (!audioRef.current || !duration) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            audioRef.current.currentTime = pos * duration;
                          }}
                        >
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>{formatTime(currentTime)}</span>
                          <button onClick={replayAudio} className="hover:text-indigo-400 flex items-center gap-1 transition">
                            <RotateCcw className="w-3 h-3" /> Replay
                          </button>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Speed Buttons */}
                      <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-[10px] font-bold">
                        {[0.8, 1.0, 1.25].map(s => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`px-2 py-0.5 rounded transition ${playbackSpeed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/80 rounded-xl text-center text-xs text-slate-400">
                    Recording audio file stored on research server.
                  </div>
                )}
              </div>

              {/* QUICK ADOPTION PRESETS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Quick Consensus Presets:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAdoptPreset('average')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition shadow-sm"
                  >
                    Adopt Average (Midpoint)
                  </button>
                  <button
                    onClick={() => handleAdoptPreset('instructor')}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 transition shadow-sm"
                  >
                    Keep Instructor Scores
                  </button>
                  <button
                    onClick={() => handleAdoptPreset('rater')}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs font-bold text-teal-700 transition shadow-sm"
                  >
                    Adopt Rater Scores
                  </button>
                </div>
              </div>

              {/* 5-DIMENSION RUBRIC SIDE-BY-SIDE BREAKDOWN */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    25-Point Speaking Rubric: Criteria Reconciler
                  </h4>

                  {/* Live Total Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Calibrated Outcome:</span>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-black shadow-sm">
                      {liveCalibratedTotal} / 25 ({Math.round((liveCalibratedTotal / 25) * 100)}%) &bull; {liveCefr.cefr}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {RUBRIC_CRITERIA_25.map((crit, idx) => {
                    const instGrade = calibratingSub.grades?.instructor;
                    const raterGrade = calibratingSub.grades?.rater || calibratingSub.grades?.rater1;
                    const instScore = instGrade ? instGrade[crit.id] : null;
                    const raterScore = raterGrade ? raterGrade[crit.id] : null;
                    const diff = (instScore !== null && raterScore !== null) ? Math.abs(instScore - raterScore) : null;
                    const currentScore = calibratedScores[crit.id] || 3;

                    return (
                      <div key={crit.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-2">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">
                              {crit.label}
                            </h5>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {crit.description}
                            </p>
                          </div>

                          {/* Side-by-side Rater Tags */}
                          <div className="flex items-center gap-2 shrink-0 text-xs">
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                              Inst: {instScore ?? '-'} / 5
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 font-bold border border-teal-200">
                              Rater: {raterScore ?? '-'} / 5
                            </span>
                            {diff !== null && diff > 0 && (
                              <span className={`px-2 py-0.5 rounded-lg font-black ${
                                diff >= 2 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                &Delta; {diff}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Calibrated Stepper Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-xs font-bold text-purple-900">
                            Reconciled Mark:
                          </span>

                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                onClick={() => setCalibratedScores(prev => ({ ...prev, [crit.id]: val }))}
                                className={`w-9 h-9 rounded-xl font-black text-xs transition flex items-center justify-center shadow-sm ${
                                  currentScore === val
                                    ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                                title={crit.bands?.[val] || `Level ${val}`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Band Descriptor Preview */}
                        {crit.bands?.[currentScore] && (
                          <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 text-[11px] text-purple-900 italic">
                            &ldquo;{crit.bands[currentScore]}&rdquo;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SIDE-BY-SIDE QUALITATIVE FEEDBACK REVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instructor Original Feedback */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2 text-xs">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5 border-b border-indigo-200 pb-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Lead Instructor Feedback</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider">Strengths:</span>
                    <p className="text-slate-700 italic">{calibratingSub.grades?.instructor?.strengths || 'None recorded'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-amber-800 block text-[10px] uppercase tracking-wider">Areas for Improvement:</span>
                    <p className="text-slate-700 italic">{calibratingSub.grades?.instructor?.areas_for_improvement || 'None recorded'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-indigo-800 block text-[10px] uppercase tracking-wider">Suggestions:</span>
                    <p className="text-slate-700 italic">{calibratingSub.grades?.instructor?.suggestions || 'None recorded'}</p>
                  </div>
                </div>

                {/* Rater Original Feedback */}
                <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-2 text-xs">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5 border-b border-teal-200 pb-1.5">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                    <span>Independent Rater Feedback</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider">Strengths:</span>
                    <p className="text-slate-700 italic">{calibratingSub.grades?.rater?.strengths || calibratingSub.grades?.rater1?.strengths || 'None recorded'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-amber-800 block text-[10px] uppercase tracking-wider">Areas for Improvement:</span>
                    <p className="text-slate-700 italic">{calibratingSub.grades?.rater?.areas_for_improvement || calibratingSub.grades?.rater1?.areas_for_improvement || 'None recorded'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-teal-800 block text-[10px] uppercase tracking-wider">Suggestions:</span>
                    <p className="text-slate-700 italic">{calibratingSub.grades?.rater?.suggestions || calibratingSub.grades?.rater1?.suggestions || 'None recorded'}</p>
                  </div>
                </div>
              </div>

              {/* AUTHORITATIVE RECONCILED FEEDBACK INPUTS (PUBLISHED TO STUDENT) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <h4 className="font-black text-slate-900 text-xs">
                    Authoritative Student Feedback (Delivered to Student Dashboard)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Strengths
                    </label>
                    <textarea
                      rows={3}
                      value={feedback.strengths}
                      onChange={(e) => setFeedback(prev => ({ ...prev, strengths: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 focus:outline-none"
                      placeholder="Identified strong communication acts..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Areas for Improvement
                    </label>
                    <textarea
                      rows={3}
                      value={feedback.improvements}
                      onChange={(e) => setFeedback(prev => ({ ...prev, improvements: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 focus:outline-none"
                      placeholder="Identified speech breakdowns or vocabulary gaps..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Actionable Suggestions
                    </label>
                    <textarea
                      rows={3}
                      value={feedback.suggestions}
                      onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 focus:outline-none"
                      placeholder="Practice recommendations..."
                    />
                  </div>
                </div>
              </div>

              {/* CONSENSUS / CALIBRATION AUDIT NOTES */}
              <div className="bg-purple-50/40 rounded-2xl border border-purple-200 p-4 space-y-2">
                <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Consensus & Calibration Rationale (Audit Trail for Thesis Methodology)</span>
                </label>
                <textarea
                  rows={2}
                  value={calibrationNotes}
                  onChange={(e) => setCalibrationNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="e.g., Reviewed during consensus moderation. Both raters agreed pronunciation was intelligible and adjusted grammar to 4."
                />
              </div>

              {saveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Calibrated consensus score saved successfully! Updating authoritative database records...</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-5 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Authoritative mark to be published: <strong className="text-slate-900 font-black">{liveCalibratedTotal} / 25 ({liveCefr.cefr})</strong>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseCalibration}
                  disabled={saving}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCalibratedScore}
                  disabled={saving}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Apply Calibrated Score</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
