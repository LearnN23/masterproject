import React from 'react';
import { 
  ShieldCheck, 
  Wifi, 
  Award, 
  Users, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  GraduationCap, 
  FileSpreadsheet, 
  Headphones 
} from 'lucide-react';

export default function Header({ 
  currentPersona, 
  setPersona, 
  activeUnit, 
  setActiveUnit, 
  course, 
  progress,
  onOpenLogin,
  participantId
}) {
  const isExpert = currentPersona === 'pilot_expert';
  const isRater = currentPersona.startsWith('rater');
  const isDataExport = currentPersona === 'data_export';

  // Calculate completion percentage
  const totalSteps = 4; // Pre-task video, pdf, quiz, during-task audio
  const completedCount = (progress?.completedActivities || []).filter(a => a.startsWith(activeUnit)).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalSteps) * 100));

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0">TECHQUEST</h1>
              <span className="text-xs bg-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-400/30">
                EOP LMS
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">
              English for IT Technical Support • TBLT Master's Thesis Module
            </p>
          </div>
        </div>

        {/* Persona & Role Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Cohort / Role:</span>
            <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
              currentPersona === 'main_study' 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                : currentPersona === 'pilot_expert'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : currentPersona === 'data_export'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
            }`}>
              {currentPersona === 'main_study' && '🎓 Main Study (Locked)'}
              {currentPersona === 'pilot_expert' && '🔍 Pilot / Expert (Bypass)'}
              {currentPersona === 'raterA' && '📝 Rater 1 (Researcher)'}
              {currentPersona === 'raterB' && '⚖️ Rater 2 (Expert Evaluator)'}
              {currentPersona === 'data_export' && '📊 Thesis SPSS Export'}
            </span>
            <span className="font-mono text-slate-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-[11px]">
              {participantId}
            </span>
          </div>

          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Cohort / Role</span>
          </button>
        </div>
      </div>

      {/* Navigation & Progress Bar Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Unit Selector */}
        {!isRater && !isDataExport && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 pt-0.5">
            <span className="text-slate-400 font-medium flex-shrink-0 mr-1 text-[11px]">Sections:</span>
            {course?.units?.map((unit, idx) => {
              // Gating rule: Section 0 is always open. Section N requires completion of Section N-1 unless Expert Bypass is active.
              const prevUnitId = idx > 0 ? course.units[idx - 1].id : null;
              const prevUnitDone = prevUnitId ? (progress?.completedActivities || []).some(a => a.startsWith(prevUnitId)) : true;
              const isLocked = !isExpert && idx > 0 && !prevUnitDone;
              const isActive = activeUnit === unit.id;

              // Format clean short badge title
              let shortLabel = unit.title.split(':')[0];
              if (idx === 0) shortLabel = '0. Pre-Test';
              else if (idx === 9) shortLabel = '9. Post-Test';
              else shortLabel = `L${idx}`;

              return (
                <button
                  key={unit.id}
                  disabled={isLocked}
                  onClick={() => setActiveUnit(unit.id)}
                  title={unit.title}
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400' 
                      : isLocked 
                        ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-800'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                  ) : isExpert && idx > 0 ? (
                    <Unlock className="w-2.5 h-2.5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  )}
                  <span>{shortLabel}</span>
                  {isExpert && idx > 0 && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">Bypass</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Student Progress & Badges */}
        {!isRater && !isDataExport && (
          <div className="flex items-center gap-4 ml-auto">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Unit Progress:</span>
              <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-emerald-400">{progressPercent}%</span>
            </div>

            {/* Badges showcase */}
            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
              <span className="text-slate-400 font-medium mr-1">Badges:</span>
              <div className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold ${
                progress?.badges?.includes('badge-1')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-800'
              }`}>
                <Award className="w-3.5 h-3.5" />
                <span>Dispatcher</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
