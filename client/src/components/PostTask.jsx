import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Volume2, 
  Star, 
  Play, 
  Pause, 
  ListChecks, 
  Sparkles, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function PostTask({ unit, onCompleteActivity, onAwardBadge, hasBadge, onNextUnit }) {
  const postTaskData = unit?.postTask;
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [checklist, setChecklist] = useState({
    empathy: false,
    lexicon: false,
    eta: false,
    cadence: false
  });

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePlayModelResponse = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlayingModel(false);
        return;
      }

      const text = postTaskData?.modelResponse?.transcript.replace(/"/g, '') || '';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // calm, measured professional pace
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsPlayingModel(true);
      utterance.onend = () => setIsPlayingModel(false);
      utterance.onerror = () => setIsPlayingModel(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Model Audio Transcript:\n' + postTaskData?.modelResponse?.transcript);
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleFinishUnit = () => {
    onCompleteActivity(`${unit.id}-posttask`);
    onAwardBadge(unit.badge.id);
  };

  return (
    <div className="space-y-6">
      {/* Phase Banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
            TBLT Stage 3
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-2 mb-1">
            Post-Task: Reflection, Model Benchmark & Gamification
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl m-0">
            Compare your spoken response against the expert benchmark, complete your self-evaluation, and claim your Unit completion badge.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasBadge ? (
            <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
              <Award className="w-4 h-4 text-amber-600" />
              Badge Claimed: {unit.badge.name}
            </div>
          ) : (
            <button
              onClick={handleFinishUnit}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Claim Unit Badge
            </button>
          )}
        </div>
      </div>

      {/* Grid: Model Audio Response & Reflection Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Benchmark Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-base font-bold text-slate-800 m-0">
                Expert Benchmark Spoken Response
              </h3>
            </div>
            <button
              onClick={handlePlayModelResponse}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-all"
            >
              {isPlayingModel ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Benchmark
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Listen to Model Audio
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Exact Spoken Audio Transcript (Proficient Level 4)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed italic m-0">
              {postTaskData?.modelResponse?.transcript}
            </p>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
              Structural & Linguistic Takeaways:
            </h4>
            <div className="space-y-2">
              {postTaskData?.modelResponse?.keyTakeaways?.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/60">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Self-Reflection & Badge Unlock */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
              <ListChecks className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800 m-0">Self-Benchmark Checklist</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Evaluate your recorded response against the 4 research rubric dimensions:
            </p>

            <div className="space-y-2.5 text-xs">
              <label 
                onClick={() => toggleCheck('empathy')}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  checklist.empathy ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                  checklist.empathy ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {checklist.empathy && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <span className="font-bold block">1. De-escalation & Empathy (Criterion 3)</span>
                  <span className="text-[11px] text-slate-500">I acknowledged Sarah's stress before prescribing any technical steps.</span>
                </div>
              </label>

              <label 
                onClick={() => toggleCheck('lexicon')}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  checklist.lexicon ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                  checklist.lexicon ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {checklist.lexicon && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <span className="font-bold block">2. EOP Diagnostic Lexicon (Criterion 2)</span>
                  <span className="text-[11px] text-slate-500">I used standard terms like "directory suspension" or "verification passcode".</span>
                </div>
              </label>

              <label 
                onClick={() => toggleCheck('eta')}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  checklist.eta ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                  checklist.eta ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {checklist.eta && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <span className="font-bold block">3. Concrete ETA & Ownership (Criterion 3)</span>
                  <span className="text-[11px] text-slate-500">I provided a specific time window (under 2 mins) well before her presentation.</span>
                </div>
              </label>

              <label 
                onClick={() => toggleCheck('cadence')}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  checklist.cadence ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                  checklist.cadence ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {checklist.cadence && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <span className="font-bold block">4. Delivery Cadence & Intelligibility (Criteria 1 & 4)</span>
                  <span className="text-[11px] text-slate-500">I maintained a steady rhythm without lengthy frozen pauses (&gt; 5s).</span>
                </div>
              </label>
            </div>
          </div>

          {/* Badge Showcase Card */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center gap-3">
              <div className="bg-amber-500 p-3 rounded-xl shadow-md text-white flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  {unit.badge.tier} Tier Milestone
                </span>
                <h4 className="text-sm font-bold text-amber-950 m-0">
                  {unit.badge.name}
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5 m-0 leading-tight">
                  {unit.badge.criteria}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinishUnit}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
            >
              <span>Complete Unit & Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
