import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Award, CheckCircle2, Clock, Play, Pause, Save, 
  ShieldCheck, FileAudio, HelpCircle, ArrowLeft, Send,
  AlertTriangle, Download, RefreshCw, BarChart3, TrendingUp,
  Sparkles, Check, ChevronRight, Eye, Filter
} from 'lucide-react';
import { RUBRIC_CRITERIA_25, getCefrRating } from '../data/assessmentsData';

export default function RaterDashboard({ currentUser }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, pending, graded, pre_test, post_test, formative
  const [selectedSub, setSelectedSub] = useState(null);

  // Scoring form state
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

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data || []);
      if (!selectedSub && data && data.length > 0) {
        // default select first pending or first submission
        const pending = data.find(s => !s.grades?.rater);
        setSelectedSub(pending || data[0]);
      }
    } catch (e) {
      console.warn('Failed to load submissions for rater:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // When selected submission changes, load existing rater grade if available
  useEffect(() => {
    if (selectedSub) {
      const rGrade = selectedSub.grades?.rater || selectedSub.grades?.raterB;
      if (rGrade) {
        setScores({
          task_achievement: rGrade.task_achievement || 0,
          interactive_comm: rGrade.interactive_comm || 0,
          vocabulary: rGrade.vocabulary || 0,
          grammar: rGrade.grammar || 0,
          pronunciation_fluency: rGrade.pronunciation_fluency || 0
        });
        setFeedback({
          strengths: rGrade.strengths || '',
          improvements: rGrade.areas_for_improvement || '',
          suggestions: rGrade.suggestions || ''
        });
      } else {
        setScores({ task_achievement: 0, interactive_comm: 0, vocabulary: 0, grammar: 0, pronunciation_fluency: 0 });
        setFeedback({ strengths: '', improvements: '', suggestions: '' });
      }
      setSaveSuccess(false);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [selectedSub]);

  // Audio controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSpeed = (s) => {
    setPlaybackSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  const formatSec = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const cefrInfo = totalScore > 0 ? getCefrRating(totalScore, 25) : null;

  const handleScoreChange = (critId, val) => {
    setScores(prev => ({ ...prev, [critId]: val }));
    setSaveSuccess(false);
  };

  const handleSaveGrade = async () => {
    if (!selectedSub?.id) return;
    setIsSaving(true);
    try {
      await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: selectedSub.id,
          raterType: 'rater',
          rater_role: 'rater',
          scores,
          strengths: feedback.strengths,
          improvements: feedback.improvements,
          suggestions: feedback.suggestions
        })
      });
      setSaveSuccess(true);
      fetchSubmissions();
    } catch (e) {
      console.warn('Failed to save rater grade:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Metrics
  const totalSubmissions = submissions.length;
  const pendingRatings = submissions.filter(s => !s.grades?.rater).length;
  const completedRatings = submissions.filter(s => !!s.grades?.rater).length;
  const discrepancyCount = submissions.filter(s => {
    const i = s.grades?.instructor?.total;
    const r = s.grades?.rater?.total;
    return i !== undefined && r !== undefined && Math.abs(i - r) >= 5;
  }).length;

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => {
    if (filterType === 'pending') return !s.grades?.rater;
    if (filterType === 'graded') return !!s.grades?.rater;
    if (filterType === 'pre_test') return s.assessment_type === 'pre_test';
    if (filterType === 'post_test') return s.assessment_type === 'post_test';
    if (filterType === 'formative') return s.assessment_type === 'formative_speaking';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* HEADER & PILOT PHASE BADGE */}
      <header className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              Rater Calibration Portal
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Pilot & Testing Phase Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Independent Rater Evaluation Dashboard
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Blind dual-rater scoring system for inter-rater reliability calibration (ICC / Cohen's Kappa).
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </header>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Total Submissions
          </span>
          <span className="text-3xl font-black text-slate-900 font-mono">{totalSubmissions}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Pool for calibration</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/20">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
            Pending My Rating
          </span>
          <span className="text-3xl font-black text-amber-600 font-mono">{pendingRatings}</span>
          <span className="text-[11px] text-amber-700 block mt-1">Submissions to score</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Completed Ratings
          </span>
          <span className="text-3xl font-black text-emerald-600 font-mono">{completedRatings}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Rater scored</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Consensus Alerts (&gt;20%)
          </span>
          <span className={`text-3xl font-black font-mono ${discrepancyCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
            {discrepancyCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Calibration flags</span>
        </div>
      </div>

      {/* NOTICE BOX */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-start gap-3.5 shadow-sm text-xs">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-indigo-200 text-sm">Rater Role & Research Protocol</p>
          <p className="text-slate-300 leading-relaxed">
            You are operating as an <strong>Independent Evaluator / Rater</strong> during the pilot/testing calibration phase. Your 25-point rubric scores are stored for inter-rater reliability analysis (ICC &gt; 0.85). Students receive the authoritative score from their <strong>Course Instructor</strong> on their dashboard.
          </p>
        </div>
      </div>

      {/* WORKSPACE: QUEUE (LEFT) + 25-POINT RUBRIC (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FileAudio className="w-4 h-4 text-indigo-600" />
                <span>Audio Submissions Queue</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {filteredSubmissions.length} items
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending My Score' },
                { key: 'graded', label: 'Graded by Me' },
                { key: 'pre_test', label: 'Pre-Test' },
                { key: 'post_test', label: 'Post-Test' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterType === f.key 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Submissions List */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredSubmissions.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-8">No submissions match the filter.</p>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isSelected = selectedSub?.id === sub.id;
                  const rGrade = sub.grades?.rater || sub.grades?.raterB;
                  const instGrade = sub.grades?.instructor;
                  const diff = rGrade && instGrade ? Math.abs(rGrade.total - instGrade.total) : null;
                  const isDiscrepant = diff !== null && diff >= 5;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/20 shadow-sm' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-black text-slate-900">
                          {sub.blind_mask_code || sub.participant_code || 'BLIND-101'}
                        </span>
                        {rGrade ? (
                          <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                            Rater: {rGrade.total}/25
                          </span>
                        ) : (
                          <span className="font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded text-[10px]">
                            Pending Rating
                          </span>
                        )}
                      </div>

                      <p className="font-semibold text-slate-700 truncate">{sub.unit_title || sub.unit_id}</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/60">
                        <span>{sub.duration_seconds || 30}s • {sub.assessment_type}</span>
                        {isDiscrepant && (
                          <span className="text-rose-600 font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Diff {diff} pts
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scoring Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedSub ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Submission Header */}
              <div className="flex flex-wrap justify-between items-start gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                      Masked Submission
                    </span>
                    <span className="text-sm font-mono font-black text-indigo-700">
                      {selectedSub.blind_mask_code || selectedSub.participant_code || 'BLIND-101'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedSub.unit_title || selectedSub.unit_id}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recorded oral response • Single-take file preserved on server
                  </p>
                </div>

                {/* Total Score Badge */}
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Rater Score
                  </span>
                  <span className="text-3xl font-mono font-black text-indigo-600">
                    {totalScore} <span className="text-sm text-slate-400">/ 25</span>
                  </span>
                  {cefrInfo && (
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      {cefrInfo.cefr} ({((totalScore / 25) * 100).toFixed(0)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* AUDIO PLAYER WITH VARIABLE SPEED */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                <audio
                  ref={audioRef}
                  src={selectedSub.audio_url || '/uploads/audio/demo_nadia_pretest.webm'}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onEnded={() => setIsPlaying(false)}
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition shadow-md"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <div className="flex-1 mx-4 space-y-1">
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-400 h-full transition-all"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{formatSec(currentTime)}</span>
                      <span>{formatSec(duration || selectedSub.duration_seconds || 30)}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-[10px] font-bold">
                    {[0.8, 1.0, 1.25].map(s => (
                      <button
                        key={s}
                        onClick={() => handleSpeed(s)}
                        className={`px-2 py-0.5 rounded transition ${playbackSpeed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 25-POINT BLUEPRINT RUBRIC CRITERIA */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Analytic Rubric Evaluation (5 Criteria x 5 Bands)</span>
                </h4>

                <div className="space-y-3.5">
                  {RUBRIC_CRITERIA_25.map((crit) => {
                    const val = scores[crit.id] || 0;
                    return (
                      <div key={crit.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 text-xs">{crit.label}</span>
                          <span className="font-mono font-black text-indigo-600 text-xs">
                            {val > 0 ? `${val} / 5` : 'Not Rated'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{crit.description}</p>

                        <div className="grid grid-cols-5 gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((b) => (
                            <button
                              key={b}
                              onClick={() => handleScoreChange(crit.id, b)}
                              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                                val === b
                                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                                  : 'bg-white text-slate-700 border border-slate-300 hover:border-indigo-400'
                              }`}
                            >
                              Band {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QUALITATIVE RATER COMMENTS */}
              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observed Strengths</label>
                  <textarea
                    value={feedback.strengths}
                    onChange={(e) => setFeedback({ ...feedback, strengths: e.target.value })}
                    rows={2}
                    placeholder="Clear intonation, prompt address of technical issue..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Areas for Improvement</label>
                  <textarea
                    value={feedback.improvements}
                    onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
                    rows={2}
                    placeholder="Inconsistent indirect question syntax..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {saveSuccess ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Rater evaluation saved to SQLite for calibration!
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Total Raw Score: {totalScore} / 25</span>
                )}

                <button
                  disabled={totalScore === 0 || isSaving}
                  onClick={handleSaveGrade}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-40 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Rater Calibration Score'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a submission from the queue to start evaluating.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
