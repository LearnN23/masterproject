import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  Scale, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Headphones, 
  Sparkles 
} from 'lucide-react';

export default function LoginModal({ onLogin, currentPersona, currentPid }) {
  const [selectedRole, setSelectedRole] = useState(currentPersona || 'main_study');
  const [customId, setCustomId] = useState(currentPid || 'P-101');

  const handleRoleSelect = (role, defaultId) => {
    setSelectedRole(role);
    setCustomId(defaultId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(selectedRole, customId.trim() || 'P-101');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-white m-0">TECHQUEST</h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  TBLT EOP PLATFORM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 m-0">
                English for IT Technical Support • Master's Thesis Research Project
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Select Your Research Cohort & Role:
            </label>

            <div className="space-y-2.5">
              {/* Option 1: Main Study */}
              <div
                onClick={() => handleRoleSelect('main_study', 'P-101')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  selectedRole === 'main_study'
                    ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-200 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  selectedRole === 'main_study' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Experimental Student Cohort (`Group_Main_Study`)
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> Sequential Lock
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 m-0">
                    Units are locked sequentially. Student must complete Unit 1 before Unit 2 unlocks.
                  </p>
                </div>
              </div>

              {/* Option 2: Pilot / Evaluator */}
              <div
                onClick={() => handleRoleSelect('pilot_expert', 'EXPERT-01')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  selectedRole === 'pilot_expert'
                    ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-200 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  selectedRole === 'pilot_expert' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Pilot Evaluator / Committee (`Group_Pilot_Experts`)
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Unlock className="w-3 h-3" /> Bypass Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 m-0">
                    Full access bypass enabled. Inspect any unit, ticket, popup PDF, or rubric freely.
                  </p>
                </div>
              </div>

              {/* Grid: Rater A, Rater B, SPSS Export */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {/* Rater A */}
                <div
                  onClick={() => handleRoleSelect('raterA', 'RATER-01')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedRole === 'raterA'
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <div className="text-[11px] font-bold text-slate-800">Rater 1</div>
                  <div className="text-[10px] text-slate-400">Researcher</div>
                </div>

                {/* Rater B */}
                <div
                  onClick={() => handleRoleSelect('raterB', 'RATER-02')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedRole === 'raterB'
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Scale className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <div className="text-[11px] font-bold text-slate-800">Rater 2</div>
                  <div className="text-[10px] text-slate-400">Expert Evaluator</div>
                </div>

                {/* Data Export */}
                <div
                  onClick={() => handleRoleSelect('data_export', 'ADMIN')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedRole === 'data_export'
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <div className="text-[11px] font-bold text-slate-800">SPSS Export</div>
                  <div className="text-[10px] text-slate-400">Thesis Analytics</div>
                </div>
              </div>
            </div>
          </div>

          {/* User ID field */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Assigned Participant ID / Research Alias:
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="e.g. P-101, IT-2024-001"
              className="w-full text-xs font-mono font-bold bg-white px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Used for blind marking and anonymous SPSS export tracking.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 text-xs transition-all"
          >
            <span>Enter TECHQUEST Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
