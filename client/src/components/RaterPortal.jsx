import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Play, 
  Pause, 
  Save, 
  ShieldCheck, 
  FileAudio, 
  HelpCircle,
  EyeOff,
  Filter
} from 'lucide-react';

export default function RaterPortal({ raterType, course }) {
  const raterName = raterType === 'raterA' ? 'Rater A (Researcher)' : 'Rater B (Expert Evaluator)';
  const [submissions, setSubmissions] = useState([]);
  const [activeSubId, setActiveSubId] = useState(null);
  const [scores, setScores] = useState({
    fluency: 0,
    lexicon: 0,
    empathy: 0,
    phonology: 0
  });
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1.0);
  const audioPlayerRef = useRef(null);

  const handleSpeedChange = (speed) => {
    setCurrentSpeed(speed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  // Fetch submissions from server
  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data || []);
      if (data && data.length > 0 && !activeSubId) {
        setActiveSubId(data[0].id);
        loadExistingGrades(data[0], raterType);
      }
    } catch (err) {
      console.error('Failed to load submissions', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [raterType]);

  const activeSub = submissions.find(s => s.id === activeSubId);

  const loadExistingGrades = (sub, rater) => {
    if (sub && sub.grades && sub.grades[rater]) {
      const g = sub.grades[rater];
      setScores({
        fluency: g.fluency || 0,
        lexicon: g.lexicon || 0,
        empathy: g.empathy || 0,
        phonology: g.phonology || 0
      });
      setNotes(g.notes || '');
    } else {
      setScores({ fluency: 0, lexicon: 0, empathy: 0, phonology: 0 });
      setNotes('');
    }
    setSaveSuccess(false);
  };

  const handleSelectSubmission = (sub) => {
    setActiveSubId(sub.id);
    loadExistingGrades(sub, raterType);
  };

  const handleScoreChange = (criterionId, points) => {
    setScores(prev => ({ ...prev, [criterionId]: points }));
    setSaveSuccess(false);
  };

  const totalPoints = scores.fluency + scores.lexicon + scores.empathy + scores.phonology;
  const percentage = ((totalPoints / 16) * 100).toFixed(1);

  const handleSaveGrade = async () => {
    if (!activeSubId) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: activeSubId,
          raterType,
          scores,
          notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Failed to save grade', err);
    } finally {
      setIsSaving(false);
    }
  };

  const rubric = course?.rubric;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-400/30">
              Inter-Rater Reliability Protocol
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Blind Marking Active (Participant ID Only)</span>
            </div>
          </div>
          <h2 className="text-xl font-bold mt-2 mb-1 text-white">
            Dual-Rater Assessment Portal: <span className="text-indigo-400">{raterName}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl m-0">
            Grade oral ticket responses against the 4-criteria Analytic Rubric. Scores are stored in an isolated partition to ensure unbiased Cohen's Kappa & ICC calculations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submissions Queue */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 m-0">Submissions Queue</h3>
            <span className="text-xs font-semibold text-slate-500">
              {submissions.length} Total
            </span>
          </div>

          <div className="space-y-2">
            {submissions.map((sub) => {
              const isGradedByMe = !!(sub.grades && sub.grades[raterType]);
              const isSelected = sub.id === activeSubId;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-200 shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      {sub.participantId}
                    </span>
                    {isGradedByMe ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Graded ({sub.grades[raterType].total}/16)
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Pending Grade
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Task: {sub.ticketId}</span>
                    <span>Duration: {sub.durationSeconds || 60}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Audio Player & Interactive Rubric Form */}
        <div className="lg:col-span-8 space-y-5">
          {activeSub ? (
            <>
              {/* Audio Playback Box */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                    <FileAudio className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold uppercase">Candidate:</span>
                      <strong className="text-sm font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {activeSub.participantId}
                      </strong>
                    </div>
                    <span className="text-xs text-slate-500">
                      Submitted: {new Date(activeSub.submittedAt).toLocaleTimeString()} • Duration: {activeSub.durationSeconds || 60}s
                    </span>
                  </div>
                </div>

                <div className="flex-1 max-w-md space-y-2">
                  <audio 
                    ref={audioPlayerRef}
                    controls 
                    src={activeSub.audioFile} 
                    className="w-full h-10 rounded-lg"
                  />
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 font-semibold text-[11px]">Speed Control:</span>
                    <div className="flex items-center gap-1.5">
                      {[0.8, 1.0, 1.25].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedChange(rate)}
                          className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold transition-all ${
                            currentSpeed === rate
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rubric Evaluation Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 m-0">
                      Analytic Rubric: 4-Criteria Assessment
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 m-0">
                      Select 1 level per criterion. Total scaled to 100% automatically.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold uppercase block">Composite Score</span>
                    <span className="text-lg font-black text-indigo-600 font-mono">
                      {totalPoints} / 16 ({percentage}%)
                    </span>
                  </div>
                </div>

                {/* Criteria Rows */}
                <div className="space-y-6">
                  {rubric?.criteria?.map((crit) => {
                    const currentScore = scores[crit.id] || 0;

                    return (
                      <div key={crit.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">
                            {crit.name}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Weight: {crit.weight} • Score: {currentScore} pt{currentScore !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* 4 Levels Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                          {crit.levels.map((lvl) => {
                            const isSelected = currentScore === lvl.points;

                            return (
                              <button
                                key={lvl.points}
                                onClick={() => handleScoreChange(crit.id, lvl.points)}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                                  isSelected 
                                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-200 font-medium' 
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                      isSelected ? 'text-indigo-200' : 'text-slate-400'
                                    }`}>
                                      {lvl.label}
                                    </span>
                                    <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {lvl.points} pt
                                    </span>
                                  </div>
                                  <p className={`text-[11px] leading-snug m-0 ${
                                    isSelected ? 'text-indigo-100' : 'text-slate-600'
                                  }`}>
                                    {lvl.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Qualitative Feedback Notes */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Evaluator Qualitative Comments / Justification:
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter diagnostic notes on student cadence, technical lexicon errors, or empathy de-escalation effectiveness..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>

                {/* Submit / Save Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Rubric score successfully locked for {raterName}!
                    </div>
                  )}

                  <button
                    onClick={handleSaveGrade}
                    disabled={isSaving || totalPoints === 0}
                    className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving Grade...' : 'Lock & Save Evaluation'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              No submissions currently available in the queue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
