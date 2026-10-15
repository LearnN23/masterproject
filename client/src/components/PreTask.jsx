import React, { useState } from 'react';
import { 
  Play, 
  FileText, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Download, 
  HelpCircle, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PreTask({ unit, onCompleteActivity, isCompleted, onNextPhase }) {
  const [showCheatsheetModal, setShowCheatsheetModal] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const preTaskData = unit?.preTask;

  const handleSelectAnswer = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCheckQuiz = () => {
    let score = 0;
    preTaskData.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correct) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === preTaskData.quiz.length) {
      onCompleteActivity(`${unit.id}-pretask-quiz`);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleOpenPdfModal = () => {
    setShowCheatsheetModal(true);
    onCompleteActivity(`${unit.id}-pretask-pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Phase Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
            TBLT Stage 1
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-2 mb-1">
            Pre-Task: Scaffolding & Technical Language Input
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl m-0">
            Familiarize yourself with standard helpdesk terminology, polite imperatives, and customer de-escalation strategies before handling live tickets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenPdfModal}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-700 font-semibold px-4 py-2 rounded-xl border border-indigo-200 shadow-sm text-sm transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            Pop-up Cheatsheet (800×600)
          </button>
        </div>
      </div>

      {/* Grid: Video Demonstration & Scaffolding Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
              <Play className="w-4 h-4 text-indigo-600" />
              {preTaskData?.video?.title || 'Support Dialogue Demonstration'}
            </h3>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
              Interactive Model Input
            </span>
          </div>

          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* HTML5 Video Element */}
            <video 
              controls 
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              onPlay={() => onCompleteActivity(`${unit.id}-pretask-video`)}
            >
              <source src={preTaskData?.video?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
            <strong>Key Linguistic Focus:</strong> {preTaskData?.video?.notes}
          </div>
        </div>

        {/* Quick Cheatsheet Preview Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800 m-0">Helpdesk Phrasebook</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Core communicative structures required for achieving maximum marks in Criteria 2 & 3:
            </p>

            <div className="space-y-3">
              {preTaskData?.cheatsheet?.categories?.slice(0, 2).map((cat, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                    {cat.name}
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc m-0">
                    {cat.phrases.slice(0, 2).map((phrase, pIdx) => (
                      <li key={pIdx} className="italic leading-snug">"{phrase}"</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleOpenPdfModal}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2.5 rounded-xl border border-indigo-200 text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Full 800×600 Pop-up PDF
          </button>
        </div>
      </div>

      {/* Formative Interactive Quiz (H5P Simulated Component) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-800 m-0">
                Formative Knowledge Check (H5P Interactive)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 m-0">
              Verify your diagnostic vocabulary and de-escalation mastery. Score 100% to unlock the live speaking ticket.
            </p>
          </div>
          {quizSubmitted && (
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              quizScore === preTaskData.quiz.length 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              Score: {quizScore} / {preTaskData.quiz.length}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {preTaskData?.quiz?.map((q, idx) => {
            const selected = quizAnswers[q.id];
            const isCorrect = selected === q.correct;

            return (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="font-semibold text-slate-800 text-sm mb-3">
                  {idx + 1}. {q.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let optionStyle = 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200';
                    if (selected === optIdx) {
                      optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold ring-2 ring-indigo-200';
                    }
                    if (quizSubmitted) {
                      if (optIdx === q.correct) {
                        optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                      } else if (selected === optIdx) {
                        optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`text-left text-xs p-3 rounded-lg border transition-all flex items-start gap-2 ${optionStyle}`}
                      >
                        <span className="font-bold text-slate-400 w-4">{String.fromCharCode(65 + optIdx)}.</span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                    isCorrect ? 'bg-emerald-100/60 text-emerald-800' : 'bg-rose-100/60 text-rose-800'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          {!quizSubmitted ? (
            <button
              onClick={handleCheckQuiz}
              disabled={Object.keys(quizAnswers).length < preTaskData.quiz.length}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all"
            >
              Submit & Check Answers
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full justify-between">
              {quizScore === preTaskData.quiz.length ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Pre-Task Mastered! Proceed to the Live Ticket.
                </div>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Try Again
                </button>
              )}

              <button
                onClick={onNextPhase}
                className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all"
              >
                Go to Ticket Task #TK-101
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 800x600 Pop-up PDF Cheatsheet Modal */}
      {showCheatsheetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ width: '800px', height: '600px', maxWidth: '95vw', maxHeight: '90vh' }}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-sm text-white m-0">
                    TECHQUEST Resource: {preTaskData?.cheatsheet?.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">Standardized PDF Handout • 800×600 Pop-up Mode</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('PDF downloaded: techquest_unit1_glossary.pdf')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save PDF
                </button>
                <button
                  onClick={() => setShowCheatsheetModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Styled PDF Handout Document */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 text-slate-800 text-xs leading-relaxed space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <h5 className="text-base font-bold text-indigo-900 m-0">
                    EOP Technical Support Oral Communication Matrix
                  </h5>
                  <p className="text-slate-500 text-[11px] mt-1 m-0">
                    Task-Based Language Teaching (TBLT) Scaffold for Information Technology Helpdesk Scenarios
                  </p>
                </div>

                <div className="space-y-4">
                  {preTaskData?.cheatsheet?.categories?.map((cat, idx) => (
                    <div key={idx} className="border-l-4 border-indigo-600 pl-3">
                      <h6 className="font-bold text-indigo-800 text-xs uppercase tracking-wider mb-1.5">
                        {idx + 1}. {cat.name}
                      </h6>
                      <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                        {cat.phrases.map((phrase, pIdx) => (
                          <li key={pIdx}>
                            <span className="font-medium text-slate-900">{phrase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px]">
                  <strong>Evaluation Note:</strong> During the ticket response, the raters will grade your lexical precision (Criterion 2) and de-escalation empathy (Criterion 3) against the phrases above.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Moodle File Display: In pop-up | Document ID: #PDF-EOP-101</span>
              <button
                onClick={() => setShowCheatsheetModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-sm"
              >
                Close & Return to Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
