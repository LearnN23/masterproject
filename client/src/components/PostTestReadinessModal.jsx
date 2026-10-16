import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, BookOpen, Clock, Mic, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function PostTestReadinessModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
              Form B • Summative Evaluation
            </span>
          </div>

          <h2 id="modal-headline" className="text-2xl font-black text-white tracking-tight">
            Post-Test Readiness & Protocol
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Standardized Occupational Oral Proficiency Test (Closed-Book Protocol)
          </p>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-5">
          {/* CRITICAL WARNING CALLOUT */}
          <div className="bg-amber-50 border-2 border-amber-400/40 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                <span>Closed-Book Assessment Condition</span>
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Once you start the Post-test, <strong className="font-bold underline decoration-amber-500">all 8 curriculum lessons and review materials will be locked</strong>. 
                You will <strong>not</strong> be able to view slide decks, vocabulary lists, or model dialogues while the test is in progress.
              </p>
            </div>
          </div>

          {/* TEST SPECIFICATIONS */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Assessment Rules & Structure</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Mic className="w-3 h-3 text-indigo-600" /> 4 Spoken Tasks
                </span>
                <p className="font-bold text-slate-800 text-[11px]">Authentic Tech Support scenarios</p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-600" /> Timed Single-Take
                </span>
                <p className="font-bold text-slate-800 text-[11px]">Strict prep & speaking timers</p>
              </div>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1 font-medium">
              <li>Requires an active microphone to record your spoken responses.</li>
              <li>Recordings are saved to the research repository for blind two-rater evaluation.</li>
              <li><strong className="text-emerald-700">Automatic Unlock:</strong> Full review access to all 8 lessons will be restored immediately after you submit.</li>
            </ul>
          </div>

          {/* QUESTION PROMPT */}
          <div className="text-center pt-1">
            <p className="text-xs font-bold text-slate-700">
              Are you ready to proceed with your Post-test now?
            </p>
          </div>
        </div>

        {/* MODAL ACTIONS */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-sm transition"
          >
            Review Lessons First
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>I am Ready — Start Post-Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
