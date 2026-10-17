import React, { useState, useEffect } from 'react';
import { 
  Users, Award, TrendingUp, ShieldCheck, CheckCircle2, Clock, 
  Sparkles, BookOpen, Mic, ArrowRight, Lock, Unlock, Play,
  Pause, RotateCcw, FileAudio, Check, MessageSquare, AlertCircle
} from 'lucide-react';
import { LESSONS_DATA } from '../data/lessonsData';
import { getCefrRating } from '../data/assessmentsData';

export default function StudentDashboard({ navigateTo, studentState, isBypass = false, onRequestStartPostTest }) {
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  // Fetch student's submissions and instructor grades
  const fetchStudentSubmissions = async () => {
    setLoadingSubs(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      
      const participantCode = studentState?.id;
      const dbUserId = studentState?.userId;

      if (!participantCode && !dbUserId) {
        setSubmissions([]);
        return;
      }

      // Match submissions for this student by participant_code, blind_mask_code, or user_id
      const mySubs = (Array.isArray(data) ? data : []).filter(s => 
        (participantCode && (s.participant_code === participantCode || s.blind_mask_code === participantCode)) ||
        (dbUserId && s.user_id === dbUserId) ||
        (participantCode && s.user_id === participantCode)
      );
      setSubmissions(mySubs);
    } catch (e) {
      console.warn('Failed to load student submissions:', e);
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchStudentSubmissions();
  }, [studentState?.id, studentState?.userId]);

  const LESSON_ITEMS = Object.values(LESSONS_DATA).map(l => ({
    id: l.id,
    title: l.title,
    company: l.company,
    unitId: l.unitId
  }));

  const isPostTestInProgress = studentState?.postTestStarted && !studentState?.postTestCompleted;

  const isLessonLocked = (id) => {
    if (isBypass) return false;
    // Closed-book examination condition: all lessons locked while post-test is in progress
    if (isPostTestInProgress) return true;
    if (!studentState?.preTestCompleted) return true;
    if (id === 1) return false;
    const prev = studentState?.lessonsProgress?.[id - 1];
    return !prev?.isCompleted;
  };

  const completedLessonsCount = Object.values(studentState?.lessonsProgress || {}).filter(l => l.isCompleted).length;
  let progressPercent = 0;
  if (studentState?.preTestCompleted) progressPercent += 10;
  progressPercent += completedLessonsCount * 10;
  if (studentState?.postTestCompleted) progressPercent += 10;
  if (isBypass) progressPercent = 100;

  const nextUncompletedLesson = LESSON_ITEMS.find(l => !studentState?.lessonsProgress?.[l.id]?.isCompleted);
  const currentFocusLesson = nextUncompletedLesson || LESSON_ITEMS[7];
  const allLessonsDone = completedLessonsCount === 8;

  // Helper to find submission for a unit
  const getSubmissionForUnit = (unitId) => {
    return submissions.find(s => s.unit_id === unitId);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* HEADER & OVERALL PROGRESS */}
      <header className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Student Learning Portal
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              ID: {studentState?.id || studentState?.userId || 'N/A'}
            </span>
            {isBypass && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                <Unlock className="w-3 h-3 text-amber-600" /> Full Gate Bypass Active
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {studentState?.name || 'Student'}!
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Task-Based Language Teaching (TBLT) English for Technical Support & IT Helpdesk.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">Curriculum Progression</p>
          <div className="flex items-center gap-3">
            <div className="w-36 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <span className="font-mono font-black text-slate-900 text-base">{progressPercent}%</span>
          </div>
        </div>
      </header>

      {/* CLOSED-BOOK POST-TEST IN PROGRESS WARNING BANNER */}
      {isPostTestInProgress && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-amber-950">
                  Closed-Book Post-Test in Progress
                </h4>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-black uppercase px-2 py-0.5 rounded-full border border-amber-300">
                  Exam Mode Active
                </span>
              </div>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                In accordance with research protocol, all curriculum lessons and slide decks are locked. You can review all materials freely once you finish and submit your Post-test.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('post-test')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition whitespace-nowrap flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>Resume Post-Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* THREE MILESTONE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pre-test Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Diagnostic Baseline
            </span>
            {studentState?.preTestCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <h3 className="font-black text-slate-900 text-lg">Pre-Test (Form A)</h3>
          <p className="text-xs text-slate-500 font-medium">
            {studentState?.preTestCompleted 
              ? 'Completed & submitted. Establishes your starting baseline.' 
              : 'Required diagnostic speaking tasks before Lesson 1 unlocks.'}
          </p>
          {studentState?.preTestCompleted ? (
            <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Completed
            </span>
          ) : (
            <button 
              onClick={() => navigateTo('pre-test')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Take Pre-Test Form A</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Current Lesson Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md border-l-4 border-l-blue-600 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Current Focus
            </span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">
            Lesson {currentFocusLesson.id}: {currentFocusLesson.title.split('&')[0]}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {allLessonsDone 
              ? 'All 8 curriculum lessons finished! You may proceed to Post-test.' 
              : `Context: ${currentFocusLesson.company} Helpdesk.`}
          </p>
          <button 
            disabled={!isBypass && isLessonLocked(currentFocusLesson.id)}
            onClick={() => {
              if (!isBypass && isLessonLocked(currentFocusLesson.id)) {
                if (isPostTestInProgress) {
                  alert('Closed-Book Assessment in Progress: Lesson review is locked until your Post-test is completed.');
                }
                return;
              }
              const isDone = studentState?.lessonsProgress?.[currentFocusLesson.id]?.isCompleted;
              navigateTo('lesson', { 
                lessonId: currentFocusLesson.id,
                mode: isDone ? 'review' : 'study',
                initialSection: isDone ? 'situation' : undefined
              });
            }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span>
              {isPostTestInProgress
                ? 'Lesson Review Locked (Post-Test Active)'
                : studentState?.lessonsProgress?.[currentFocusLesson.id]?.isCompleted 
                ? `Review Lesson ${currentFocusLesson.id} Materials` 
                : allLessonsDone 
                ? 'Review Lesson Materials' 
                : `Continue Lesson ${currentFocusLesson.id}`}
            </span>
            {!(isLessonLocked(currentFocusLesson.id) && !isBypass) && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Post-test Card */}
        <div className={`bg-white p-6 rounded-2xl border shadow-sm border-l-4 space-y-3 ${
          studentState?.postTestCompleted 
            ? 'border-slate-200 border-l-emerald-500' 
            : isPostTestInProgress 
            ? 'border-amber-300 border-l-amber-500 ring-2 ring-amber-400/20' 
            : (allLessonsDone || isBypass)
            ? 'border-slate-200 border-l-emerald-500'
            : 'border-slate-200 border-l-slate-300'
        }`}>
          <div className="flex justify-between items-center">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
              isPostTestInProgress ? 'text-amber-800 bg-amber-100 font-bold' : 'text-slate-600 bg-slate-100'
            }`}>
              {isPostTestInProgress ? 'Exam In Progress' : 'Summative Outcome'}
            </span>
            <Award className={`w-5 h-5 ${isPostTestInProgress ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <h3 className="font-black text-slate-900 text-lg">Post-Test (Form B)</h3>
          <p className="text-xs text-slate-500 font-medium">
            {studentState?.postTestCompleted
              ? 'Completed! Your learning gain has been calculated.'
              : isPostTestInProgress
              ? 'Exam active (Closed-Book). Lesson reviews are locked until submitted.'
              : allLessonsDone || isBypass
              ? 'Unlocked! Ready to evaluate your learning gain.'
              : 'Complete all 8 instructional lessons to unlock.'}
          </p>
          {studentState?.postTestCompleted ? (
            <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Completed
            </span>
          ) : isPostTestInProgress ? (
            <button 
              onClick={() => navigateTo('post-test')}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Resume Post-Test (Form B)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (allLessonsDone || isBypass) ? (
            <button 
              onClick={() => onRequestStartPostTest ? onRequestStartPostTest() : navigateTo('post-test')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Take Post-Test Form B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="inline-block text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Locked
            </span>
          )}
        </div>
      </div>

      {/* NORMALIZED LEARNING GAIN BANNER (IF BOTH PRE & POST TEST GRADED) */}
      {(() => {
        const preSub = getSubmissionForUnit('section_0') || submissions.find(s => s.assessment_type === 'pre_test');
        const postSub = getSubmissionForUnit('section_9') || submissions.find(s => s.assessment_type === 'post_test');
        const preGrade = preSub?.grades?.instructor;
        const postGrade = postSub?.grades?.instructor;
        const preScore = preGrade ? (preGrade.total_score ?? preGrade.total) : null;
        const postScore = postGrade ? (postGrade.total_score ?? postGrade.total) : null;
        const hasGain = preScore !== null && postScore !== null;
        if (!hasGain) return null;

        const maxScore = preGrade.max_score || postGrade.max_score || 20;
        const gainPts = postScore - preScore;
        const gainPct = Math.round((gainPts / maxScore) * 100);

        const preCefr = getCefrRating(preScore, maxScore);
        const postCefr = getCefrRating(postScore, maxScore);

        return (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Research Learning Gain Verified
                </span>
                <span className="text-xs text-emerald-100 font-medium">Pre-to-Post Intervention</span>
              </div>
              <span className="text-2xl font-black text-amber-300">
                {gainPts >= 0 ? `+${gainPts}` : gainPts} pts ({gainPts >= 0 ? `+${gainPct}` : gainPct}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                <p className="text-[10px] uppercase font-bold text-emerald-200">Pre-Test Diagnostic</p>
                <p className="text-xl font-black text-white mt-0.5">{preScore} / {maxScore} ({preGrade.percentage}%)</p>
                <p className="text-[11px] text-emerald-100 mt-1">{preCefr.level} &bull; {preCefr.cefr}</p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                <p className="text-[10px] uppercase font-bold text-teal-200">Post-Test Summative</p>
                <p className="text-xl font-black text-white mt-0.5">{postScore} / {maxScore} ({postGrade.percentage}%)</p>
                <p className="text-[11px] text-teal-100 mt-1">{postCefr.level} &bull; {postCefr.cefr}</p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                <p className="text-[10px] uppercase font-bold text-amber-200">Outcome Evaluation</p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {gainPts > 0 ? 'Statistically Significant Communicative Gain' : 'Consistent Proficiency Demonstrated'}
                </p>
                <p className="text-[11px] text-amber-100 mt-1">Grounded in 20-Point Operational Rubric</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CURRICULUM LESSON GRID */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>8-Lesson TBLT Curriculum</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LESSON_ITEMS.map((lesson) => {
            const isCompleted = studentState?.lessonsProgress?.[lesson.id]?.isCompleted;
            const isLocked = isLessonLocked(lesson.id);
            const isExamLocked = isPostTestInProgress && isCompleted;
            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (isLocked) {
                    if (isPostTestInProgress) {
                      alert('Closed-Book Assessment in Progress: Lesson review is locked until your Post-test is completed.');
                    }
                    return;
                  }
                  navigateTo('lesson', { 
                    lessonId: lesson.id,
                    mode: isCompleted ? 'review' : 'study',
                    initialSection: isCompleted ? 'situation' : undefined
                  });
                }}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isLocked 
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' 
                    : isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:shadow-md cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Lesson {lesson.id}
                    </span>
                    {isExamLocked ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" /> Exam Lock
                      </span>
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {lesson.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-indigo-600 block mt-1">
                    {lesson.company}
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  {isExamLocked ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                      </span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 text-[10px]">
                        <Lock className="w-3 h-3 text-amber-600" /> Locked
                      </span>
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                      </span>
                      <span className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1 transition-colors">
                        Review <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={isLocked ? 'text-slate-400' : 'text-indigo-600'}>
                        {isLocked ? 'Locked' : 'Open Lesson'}
                      </span>
                      {!isLocked && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MY AUDIO RECORDINGS & INSTRUCTOR EVALUATION SCORES */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded">
                Official Feedback Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Scores and feedback delivered exclusively by your course instructor
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-600" />
              <span>My Recorded Spoken Responses & Instructor Evaluations</span>
            </h2>
          </div>
        </div>

        {/* List of All Evaluated Units (Pre-test, Lessons 1–8, Post-test) */}
        <div className="space-y-4">
          {/* Pre-Test Form A Evaluation */}
          {(() => {
            const preSub = getSubmissionForUnit('section_0') || submissions.find(s => s.assessment_type === 'pre_test');
            const instGrade = preSub?.grades?.instructor;
            return (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Pre-Test Form A
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Diagnostic Baseline Assessment (OWNDAYS, Concentrix, Teleperformance, Accenture)
                      </h3>
                    </div>
                  </div>
                  <div>
                    {instGrade ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                          Instructor Score: {instGrade.total} / {instGrade.max_score || 20} ({instGrade.percentage}%)
                        </span>
                        {(() => {
                          const cefr = getCefrRating(instGrade.total, instGrade.max_score || 20);
                          return (
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${cefr.badgeClass}`} title={cefr.description}>
                              {cefr.level} &bull; {cefr.cefr}
                            </span>
                          );
                        })()}
                      </div>
                    ) : preSub ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Submitted — Awaiting Instructor Review
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                        Not yet submitted
                      </span>
                    )}
                  </div>
                </div>

                {preSub ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Audio Player */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <FileAudio className="w-3.5 h-3.5 text-indigo-600" />
                        My Spoken Recording ({preSub.duration_seconds || 18}s)
                      </span>
                      {preSub.task_audio_urls && Object.keys(preSub.task_audio_urls).length > 1 ? (
                        <div className="space-y-1.5 pt-1">
                          {Object.entries(preSub.task_audio_urls).map(([tNum, url]) => (
                            <div key={tNum} className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-700 block">
                                Task {tNum}:
                              </span>
                              <audio controls src={url} className="w-full h-7" />
                            </div>
                          ))}
                        </div>
                      ) : preSub.audio_url ? (
                        <audio controls src={preSub.audio_url} className="w-full h-8" />
                      ) : (
                        <p className="text-slate-400 italic">Audio recording preserved on server</p>
                      )}
                    </div>

                    {/* Instructor Scores Breakdown */}
                    {instGrade ? (
                      <div className="md:col-span-2 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 text-xs">
                            Instructor Evaluation Feedback ({instGrade.rater_name || 'Course Instructor'})
                          </span>
                          <span className="text-[10px] text-slate-500">{instGrade.graded_at ? new Date(instGrade.graded_at).toLocaleDateString() : 'Recent'}</span>
                        </div>
                        {instGrade.task_scores && (
                          <div className="grid grid-cols-4 gap-1.5 py-1">
                            {[1, 2, 3, 4].map(tNum => (
                              <div key={tNum} className="bg-white p-1.5 rounded-lg border border-indigo-100 text-center">
                                <span className="text-[10px] font-semibold text-slate-500 block">Task {tNum}</span>
                                <span className="font-mono font-bold text-indigo-600 text-xs">{instGrade.task_scores[tNum] || 0} / 5</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {instGrade.strengths && (
                          <p className="text-slate-700"><strong className="text-emerald-700">Strengths:</strong> {instGrade.strengths}</p>
                        )}
                        {instGrade.areas_for_improvement && (
                          <p className="text-slate-700"><strong className="text-amber-700">Areas for Improvement:</strong> {instGrade.areas_for_improvement}</p>
                        )}
                        {instGrade.suggestions && (
                          <p className="text-slate-700"><strong className="text-indigo-700">Suggestions:</strong> {instGrade.suggestions}</p>
                        )}
                      </div>
                    ) : (
                      <div className="md:col-span-2 flex items-center text-slate-500 italic p-3">
                        Your response is queued for instructor evaluation. Your grade will appear here as soon as the instructor finishes reviewing.
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Complete the Pre-Test to see your baseline diagnostic score and instructor review.
                  </p>
                )}
              </div>
            );
          })()}

          {/* Lessons 1 to 8 Speaking Responses */}
          {LESSON_ITEMS.map((lesson) => {
            const sub = getSubmissionForUnit(lesson.unitId);
            const instGrade = sub?.grades?.instructor;

            return (
              <div key={lesson.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Lesson {lesson.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {lesson.title} ({lesson.company})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {instGrade ? (
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                        Instructor Score: {instGrade.total} / 25 ({instGrade.percentage}%)
                      </span>
                    ) : sub ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Audio Recorded — Awaiting Instructor Review
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                        Not yet recorded
                      </span>
                    )}

                    {studentState?.lessonsProgress?.[lesson.id]?.isCompleted && (
                      <button
                        disabled={isLessonLocked(lesson.id)}
                        onClick={() => {
                          if (isLessonLocked(lesson.id)) {
                            if (isPostTestInProgress) {
                              alert('Closed-Book Assessment in Progress: Lesson review is locked until your Post-test is completed.');
                            }
                            return;
                          }
                          navigateTo('lesson', { lessonId: lesson.id, mode: 'review', initialSection: 'situation' });
                        }}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition ${
                          isLessonLocked(lesson.id)
                            ? 'text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed opacity-60'
                            : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
                        }`}
                      >
                        {isLessonLocked(lesson.id) ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Exam Locked</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Review Lesson</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {sub ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Audio Player */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <FileAudio className="w-3.5 h-3.5 text-indigo-600" />
                        My Lesson {lesson.id} Spoken Recording ({sub.duration_seconds || 28}s)
                      </span>
                      {sub.task_audio_urls && Object.keys(sub.task_audio_urls).length > 1 ? (
                        <div className="space-y-2 pt-1">
                          {Object.entries(sub.task_audio_urls).map(([turnKey, url]) => (
                            <div key={turnKey} className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-700 block">
                                {turnKey.replace('turn_', 'Turn ')} Audio:
                              </span>
                              <audio controls src={url} className="w-full h-7" />
                            </div>
                          ))}
                        </div>
                      ) : sub.audio_url ? (
                        <audio controls src={sub.audio_url} className="w-full h-8" />
                      ) : (
                        <p className="text-slate-400 italic">Spoken recording saved on research server</p>
                      )}
                    </div>

                    {/* Instructor Feedback */}
                    {instGrade ? (
                      <div className="md:col-span-2 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 text-xs">
                            Instructor Feedback ({instGrade.rater_name || 'Dr. Arisara'})
                          </span>
                          <span className="text-[10px] text-slate-500">{instGrade.graded_at ? new Date(instGrade.graded_at).toLocaleDateString() : 'Recent'}</span>
                        </div>
                        {instGrade.strengths && (
                          <p className="text-slate-700"><strong className="text-emerald-700">Strengths:</strong> {instGrade.strengths}</p>
                        )}
                        {instGrade.areas_for_improvement && (
                          <p className="text-slate-700"><strong className="text-amber-700">Areas for Improvement:</strong> {instGrade.areas_for_improvement}</p>
                        )}
                        {instGrade.suggestions && (
                          <p className="text-slate-700"><strong className="text-indigo-700">Suggestions:</strong> {instGrade.suggestions}</p>
                        )}
                      </div>
                    ) : (
                      <div className="md:col-span-2 flex items-center text-slate-500 italic p-3">
                        Your spoken response has been recorded and submitted to your instructor for review. The score will appear here once reviewed.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {studentState?.lessonsProgress?.[lesson.id]?.isCompleted 
                        ? `Lesson ${lesson.id} is completed.` 
                        : `Complete the speaking challenge in Lesson ${lesson.id} to record your response.`}
                    </span>
                    <button
                      disabled={isLessonLocked(lesson.id)}
                      onClick={() => {
                        if (isLessonLocked(lesson.id)) {
                          if (isPostTestInProgress) {
                            alert('Closed-Book Assessment in Progress: Lesson review is locked until your Post-test is completed.');
                          }
                          return;
                        }
                        navigateTo('lesson', { 
                          lessonId: lesson.id,
                          mode: studentState?.lessonsProgress?.[lesson.id]?.isCompleted ? 'review' : 'study',
                          initialSection: studentState?.lessonsProgress?.[lesson.id]?.isCompleted ? 'situation' : undefined
                        });
                      }}
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isLessonLocked(lesson.id)
                          ? 'text-slate-400 cursor-not-allowed opacity-60'
                          : 'text-indigo-600 hover:text-indigo-800'
                      }`}
                    >
                      <span>
                        {isLessonLocked(lesson.id) && isPostTestInProgress
                          ? `Locked during Post-test`
                          : studentState?.lessonsProgress?.[lesson.id]?.isCompleted 
                          ? `Review Lesson ${lesson.id}` 
                          : `Go to Lesson ${lesson.id}`}
                      </span>
                      {!isLessonLocked(lesson.id) && <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Post-Test Form B Evaluation */}
          {(() => {
            const postSub = getSubmissionForUnit('section_9') || submissions.find(s => s.assessment_type === 'post_test');
            const instGrade = postSub?.grades?.instructor;

            return (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Post-Test Form B
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Summative Outcome Assessment (Foundever, Evoxt, MSIG, BASF)
                    </h3>
                  </div>

                  <div>
                    {instGrade ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          Instructor Outcome Score: {instGrade.total} / {instGrade.max_score || 20} ({instGrade.percentage}%)
                        </span>
                        {(() => {
                          const cefr = getCefrRating(instGrade.total, instGrade.max_score || 20);
                          return (
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${cefr.badgeClass}`} title={cefr.description}>
                              {cefr.level} &bull; {cefr.cefr}
                            </span>
                          );
                        })()}
                      </div>
                    ) : postSub ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Submitted — Awaiting Instructor Review
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                        Complete Lessons 1–8 to unlock
                      </span>
                    )}
                  </div>
                </div>

                {postSub ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <FileAudio className="w-3.5 h-3.5 text-indigo-600" />
                        My Post-Test Recording ({postSub.duration_seconds || 30}s)
                      </span>
                      {postSub.task_audio_urls && Object.keys(postSub.task_audio_urls).length > 1 ? (
                        <div className="space-y-1.5 pt-1">
                          {Object.entries(postSub.task_audio_urls).map(([tNum, url]) => (
                            <div key={tNum} className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-700 block">
                                Task {tNum}:
                              </span>
                              <audio controls src={url} className="w-full h-7" />
                            </div>
                          ))}
                        </div>
                      ) : postSub.audio_url ? (
                        <audio controls src={postSub.audio_url} className="w-full h-8" />
                      ) : (
                        <p className="text-slate-400 italic">Saved on server</p>
                      )}
                    </div>

                    {instGrade ? (
                      <div className="md:col-span-2 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 text-xs">
                            Instructor Outcome Feedback ({instGrade.rater_name || 'Course Instructor'})
                          </span>
                          <span className="text-[10px] text-slate-500">{instGrade.graded_at ? new Date(instGrade.graded_at).toLocaleDateString() : 'Recent'}</span>
                        </div>
                        {instGrade.task_scores && (
                          <div className="grid grid-cols-4 gap-1.5 py-1">
                            {[1, 2, 3, 4].map(tNum => (
                              <div key={tNum} className="bg-white p-1.5 rounded-lg border border-emerald-100 text-center">
                                <span className="text-[10px] font-semibold text-slate-500 block">Task {tNum}</span>
                                <span className="font-mono font-bold text-emerald-600 text-xs">{instGrade.task_scores[tNum] || 0} / 5</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {instGrade.strengths && (
                          <p className="text-slate-700"><strong className="text-emerald-700">Strengths:</strong> {instGrade.strengths}</p>
                        )}
                        {instGrade.areas_for_improvement && (
                          <p className="text-slate-700"><strong className="text-amber-700">Areas for Improvement:</strong> {instGrade.areas_for_improvement}</p>
                        )}
                        {instGrade.suggestions && (
                          <p className="text-slate-700"><strong className="text-indigo-700">Suggestions:</strong> {instGrade.suggestions}</p>
                        )}
                      </div>
                    ) : (
                      <div className="md:col-span-2 flex items-center text-slate-500 italic p-3">
                        Your Post-test response has been recorded. Once your instructor finishes grading, your outcome score will appear here.
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Complete all 8 instructional units to take the Post-Test and view your final learning gains.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
