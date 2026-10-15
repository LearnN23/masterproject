import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Users, GraduationCap, Award, ShieldCheck, 
  CheckCircle2, ArrowRight, FileText, Send, Star, 
  HelpCircle, Eye, RefreshCw, MessageSquare, BookOpen,
  Mic, Check, ChevronRight, Layers, Sliders
} from 'lucide-react';

export default function ExpertDashboard({ currentUser, onSelectRoleWalkthrough, navigateTo }) {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub', 'evaluation', 'results'
  
  // Thesis Expert Evaluation Form State (5 Dimensions x 1-5 scale)
  const [evalForm, setEvalForm] = useState({
    contentQuality: 5,
    languageAppropriateness: 5,
    learningActivities: 5,
    interfaceQuality: 5,
    overallAppropriateness: 5,
    comments: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pastEvaluations, setPastEvaluations] = useState([]);

  // Fetch past expert evaluations
  const fetchPastEvaluations = async () => {
    try {
      const res = await fetch('/api/expert/evaluations');
      const data = await res.json();
      setPastEvaluations(data || []);
      // If current expert already evaluated, load it
      const existing = (data || []).find(e => e.expert_id === currentUser?.id);
      if (existing) {
        setEvalForm({
          contentQuality: existing.content_quality,
          languageAppropriateness: existing.language_appropriateness,
          learningActivities: existing.learning_activities,
          interfaceQuality: existing.interface_quality,
          overallAppropriateness: existing.overall_appropriateness,
          comments: existing.comments || ''
        });
      }
    } catch (e) {
      console.warn('Failed to load expert evaluations:', e);
    }
  };

  useEffect(() => {
    fetchPastEvaluations();
  }, [currentUser?.id]);

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/expert/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId: currentUser?.id,
          ...evalForm
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to submit evaluation');
      }

      setSaveSuccess(true);
      fetchPastEvaluations();
    } catch (err) {
      alert(`Error submitting evaluation: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const EXPERT_DIMENSIONS = [
    {
      id: 'contentQuality',
      title: '1. Occupational Needs Analysis Alignment',
      description: 'The curriculum directly addresses real-world communication tasks identified in IT support job advertisements in Malaysia (Tier-1 Helpdesk, CRM ticketing, SOP troubleshooting).'
    },
    {
      id: 'languageAppropriateness',
      title: '2. EOP Linguistic Authenticity & Speech Acts',
      description: 'Dialogues, vocabulary, and language functions (greetings, clarifying questions, empathy, modal sequencing) reflect authentic workplace standards.'
    },
    {
      id: 'learningActivities',
      title: '3. Task-Based Language Teaching (TBLT) Framework',
      description: 'Pedagogical structure follows rigorous pre-task (schema activation), during-task (simulated ticket handling), and post-task reflection cycles.'
    },
    {
      id: 'interfaceQuality',
      title: '4. Usability & Workplace Helpdesk Scaffolding',
      description: 'The UI scaffolds learning through simulated ticketing cards, audio client prompts, knowledge-base SOPs, and accessible browser-based recording.'
    },
    {
      id: 'overallAppropriateness',
      title: '5. Assessment & 25-Point Rubric Validity',
      description: 'Parallel Pre-test and Post-test forms and the 5-criteria analytic speaking rubric accurately diagnose and measure occupational oral proficiency.'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-8 text-white shadow-xl border border-purple-900/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Committee & Expert Evaluator Hub
              </span>
              <span className="text-xs text-purple-300 font-mono">ID: {currentUser?.participant_code || 'EXPERT-01'}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">{currentUser?.name || 'Prof. Evaluation Expert'}</h1>
            <p className="text-purple-200 text-sm mt-1 max-w-2xl font-medium">
              You have unrestricted full-system access. Select any persona below to inspect the platform from that user's perspective, or complete the thesis evaluation instrument.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mt-6 border-t border-purple-800/40 pt-4">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hub' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Layers className="w-4 h-4" /> Role Walkthrough Selector
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'evaluation' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Award className="w-4 h-4" /> Expert Validation Instrument
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'results' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <FileText className="w-4 h-4" /> Committee Validation Submissions ({pastEvaluations.length})
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE ROLE WALKTHROUGH SELECTOR */}
      {activeTab === 'hub' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" /> Interactive Platform Walkthrough
            </h2>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Click any of the 4 personas below to immediately navigate the platform with that role's exact permissions and interface:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Student Persona Walkthrough */}
              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-blue-50/40 hover:border-blue-500 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Zero Lockouts (Bypass Active)
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">Student Walkthrough</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    Experience the complete learning journey as a student. Inspect all 8 lessons, workplace video hooks, simulated helpdesk tickets, and record audio responses. You bypass all sequential locks so you can inspect any unit freely.
                  </p>
                </div>
                <button
                  onClick={() => onSelectRoleWalkthrough('student')}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
                >
                  Launch Student Persona <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Instructor Persona Walkthrough */}
              <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 hover:border-indigo-500 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Authoritative Grading
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">Instructor Walkthrough</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    Experience the lead instructor's workspace. Review student voice recordings, use the 25-point analytic speaking rubric, provide qualitative feedback, and inspect the inter-rater calibration matrix.
                  </p>
                </div>
                <button
                  onClick={() => onSelectRoleWalkthrough('instructor')}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
                >
                  Launch Instructor Persona <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3. Rater Persona Walkthrough */}
              <div className="p-6 rounded-2xl border-2 border-teal-200 bg-teal-50/40 hover:border-teal-500 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Mic className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                      Blind Calibration
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">Rater Walkthrough (Pilot Calibration)</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    Experience the blind evaluation queue designed for inter-rater reliability calibration during the pilot testing phase. Rater scores are stored internally alongside instructor scores.
                  </p>
                </div>
                <button
                  onClick={() => onSelectRoleWalkthrough('rater')}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
                >
                  Launch Rater Persona <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4. Administrator Persona Walkthrough */}
              <div className="p-6 rounded-2xl border-2 border-rose-200 bg-rose-50/40 hover:border-rose-500 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      System Admin
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">Administrator Walkthrough</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    Inspect user account creation, cohort group assignment, system telemetry, and download the full research dataset formatted for SPSS / JAMOVI.
                  </p>
                </div>
                <button
                  onClick={() => onSelectRoleWalkthrough('admin')}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
                >
                  Launch Admin Persona <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPERT VALIDATION INSTRUMENT FORM */}
      {activeTab === 'evaluation' && (
        <form onSubmit={handleSubmitEvaluation} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" /> Master's Thesis Expert Evaluation Instrument
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Please rate the appropriateness, linguistic authenticity, and pedagogical validity of the TECHQUEST module across the 5 thesis dimensions (1 = Poor / Strongly Disagree, 5 = Excellent / Strongly Agree).
            </p>
          </div>

          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Your expert evaluation has been successfully submitted and stored for thesis documentation!
            </div>
          )}

          <div className="space-y-5">
            {EXPERT_DIMENSIONS.map((dim) => {
              const currentScore = evalForm[dim.id];
              return (
                <div key={dim.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{dim.title}</h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{dim.description}</p>
                    </div>
                    <span className="text-sm font-black text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                      {currentScore} / 5
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {[
                      { val: 1, label: '1 - Poor' },
                      { val: 2, label: '2 - Fair' },
                      { val: 3, label: '3 - Adequate' },
                      { val: 4, label: '4 - Good' },
                      { val: 5, label: '5 - Excellent' }
                    ].map(rating => (
                      <button
                        key={rating.val}
                        type="button"
                        onClick={() => setEvalForm(prev => ({ ...prev, [dim.id]: rating.val }))}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          currentScore === rating.val 
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rating.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Expert Evaluator Qualitative Comments & Recommendations:
            </label>
            <textarea
              rows={4}
              placeholder="Please provide your expert feedback regarding module design, task authenticity, language functions, and recommendations for the thesis..."
              value={evalForm.comments}
              onChange={(e) => setEvalForm(prev => ({ ...prev, comments: e.target.value }))}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Expert Evaluation'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PAST COMMITTEE EVALUATIONS */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-base">Expert Committee Submissions ({pastEvaluations.length})</h3>
            <p className="text-xs text-slate-500 font-medium">Ratings logged across all expert evaluators</p>
          </div>

          <div className="divide-y divide-slate-100">
            {pastEvaluations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No expert evaluations submitted yet.
              </div>
            ) : (
              pastEvaluations.map(ev => {
                const avg = ((ev.content_quality + ev.language_appropriateness + ev.learning_activities + ev.interface_quality + ev.overall_appropriateness) / 5).toFixed(1);
                return (
                  <div key={ev.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{ev.expert_name || 'Committee Evaluator'}</p>
                        <p className="text-xs text-purple-600 font-mono font-bold">{ev.participant_code}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          Overall Mean: {avg} / 5.0
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(ev.evaluated_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Needs</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{ev.content_quality}/5</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Language</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{ev.language_appropriateness}/5</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">TBLT</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{ev.learning_activities}/5</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Interface</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{ev.interface_quality}/5</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Rubric</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{ev.overall_appropriateness}/5</p>
                      </div>
                    </div>

                    {ev.comments && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                        <span className="font-bold block text-slate-900 mb-1">Feedback:</span>
                        {ev.comments}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
