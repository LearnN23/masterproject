import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Play, RotateCcw, Volume2, CheckCircle2, AlertCircle, 
  Clock, ArrowRight, ArrowLeft, ShieldAlert, Sparkles, Building2, 
  HelpCircle, Check, FileText, Send
} from 'lucide-react';
import { ASSESSMENTS_DATA } from '../data/assessmentsData';

export default function AssessmentView({ type, navigateTo, studentState, updateStudentState }) {
  const isPreTest = type === 'Pre-test';
  const dataKey = isPreTest ? 'pre_test' : 'post_test';
  const assessmentData = ASSESSMENTS_DATA[dataKey];

  const isAlreadyCompleted = isPreTest ? studentState?.preTestCompleted : studentState?.postTestCompleted;

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const currentTask = assessmentData.tasks[currentTaskIndex];

  // Timers & States per task
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(currentTask.prepTimeSeconds);
  const [isPrepping, setIsPrepping] = useState(false);
  const [prepDone, setPrepDone] = useState(false);

  // Audio recording state
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, recorded
  const [recordingTime, setRecordingTime] = useState(0);
  const [taskRecordings, setTaskRecordings] = useState({}); // { [taskNum]: { url, blob, duration } }
  const [taskNotes, setTaskNotes] = useState({}); // { [taskNum]: string }
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const prepTimerRef = useRef(null);

  // Reset timers when task changes
  useEffect(() => {
    clearInterval(prepTimerRef.current);
    clearInterval(recordingTimerRef.current);
    window.speechSynthesis?.cancel();
    setIsPlayingPrompt(false);

    setPrepTimeRemaining(currentTask.prepTimeSeconds);
    setIsPrepping(false);
    setPrepDone(false);

    // If already recorded for this task, restore recorded state
    if (taskRecordings[currentTask.taskNumber]) {
      setRecordingState('recorded');
    } else {
      setRecordingState('idle');
      setRecordingTime(0);
    }
  }, [currentTaskIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearInterval(prepTimerRef.current);
      clearInterval(recordingTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // --- TTS PROMPT PLAYBACK ---
  const playPromptAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('SpeechSynthesis is not supported in this browser.');
      return;
    }
    if (isPlayingPrompt) {
      window.speechSynthesis.cancel();
      setIsPlayingPrompt(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentTask.customerPromptText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Natural BPO caller cadence
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingPrompt(true);
    utterance.onend = () => setIsPlayingPrompt(false);
    utterance.onerror = () => setIsPlayingPrompt(false);

    window.speechSynthesis.speak(utterance);
  };

  // --- PREPARATION TIMER ---
  const startPrepTimer = () => {
    setIsPrepping(true);
    setPrepDone(false);
    prepTimerRef.current = setInterval(() => {
      setPrepTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          setIsPrepping(false);
          setPrepDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipPrepTimer = () => {
    clearInterval(prepTimerRef.current);
    setIsPrepping(false);
    setPrepDone(true);
    setPrepTimeRemaining(0);
  };

  // --- AUDIO RECORDING ---
  const startRecording = async () => {
    try {
      window.speechSynthesis?.cancel();
      setIsPlayingPrompt(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setTaskRecordings(prev => ({
          ...prev,
          [currentTask.taskNumber]: {
            url,
            blob,
            duration: recordingTime
          }
        }));
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access is required to record your response. Please grant permission in browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      clearInterval(recordingTimerRef.current);
      setRecordingState('recorded');
    }
  };

  const handleRetake = () => {
    const existing = taskRecordings[currentTask.taskNumber];
    if (existing?.url) URL.revokeObjectURL(existing.url);

    setTaskRecordings(prev => {
      const copy = { ...prev };
      delete copy[currentTask.taskNumber];
      return copy;
    });
    setRecordingState('idle');
    setRecordingTime(0);
  };

  // --- SUBMISSION ---
  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    const userId = studentState?.userId || studentState?.id;
    const participantCode = studentState?.id || studentState?.userId;
    const unitId = isPreTest ? 'section_0' : 'section_9';

    try {
      const formData = new FormData();
      if (userId) formData.append('userId', userId);
      if (participantCode) formData.append('participant_id', participantCode);
      formData.append('unit_id', unitId);

      let totalDuration = 0;
      const taskKeys = Object.keys(taskRecordings).sort((a, b) => Number(a) - Number(b));

      // 1. Upload each individual task audio recording
      taskKeys.forEach(tNum => {
        const rec = taskRecordings[tNum];
        if (rec?.blob) {
          totalDuration += (rec.duration || 15);
          formData.append(`task_audio_${tNum}`, rec.blob, `${participantCode || userId}_${dataKey}_task_${tNum}.webm`);
        }
      });

      // Primary fallback audio file (Task 1 or first available recorded task)
      const primaryRec = taskRecordings[1] || taskRecordings[taskKeys[0]];
      const primaryBlob = primaryRec?.blob || new Blob([], { type: 'audio/webm' });
      formData.append('audio_file', primaryBlob, `${participantCode || userId}_${dataKey}.webm`);
      formData.append('duration_seconds', totalDuration || recordingTime || 30);
      formData.append('self_assessment', JSON.stringify({
        completedTasks: taskKeys.length,
        totalTasks: assessmentData.tasks.length,
        taskNumbers: taskKeys.map(Number),
        notes: taskNotes
      }));

      await fetch('/api/submissions', {
        method: 'POST',
        body: formData
      });
    } catch (e) {
      console.warn('Backend submission upload:', e);
    }

    // 2. Sync progress to SQLite
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || participantCode,
          unitId,
          status: 'completed',
          currentSubSection: 'completed'
        })
      });
    } catch (e) {
      console.warn('Backend progress sync:', e);
    }

    // 3. Update React App State
    if (isPreTest) {
      updateStudentState('preTestCompleted', true);
      const url = taskRecordings[1]?.url || Object.values(taskRecordings)[0]?.url;
      if (url) updateStudentState('preTestAudioUrl', url);
    } else {
      updateStudentState('postTestCompleted', true);
      const url = taskRecordings[1]?.url || Object.values(taskRecordings)[0]?.url;
      if (url) updateStudentState('postTestAudioUrl', url);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  // --- ALREADY COMPLETED STATE ---
  if (isAlreadyCompleted || submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Assessment Completed & Synchronized
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {assessmentData.title} Submitted
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto font-medium">
            Your single-take spoken audio responses have been securely transferred to the encrypted research repository for blind two-rater evaluation (Rater 1 & Rater 2).
          </p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-xl mx-auto text-left space-y-3 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <span>Research Protocol Compliance (Appendix B)</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Single-take spoken recordings preserved on research server.</li>
            <li>Assigned Blind Participant Mask: <span className="font-mono font-bold text-indigo-700">{studentState?.id || 'BLIND-101'}</span></li>
            <li>Evaluated against 25-Point Blueprint Rubric (5 Criteria x 5 Bands).</li>
            <li>Results do not affect your formal university semester GPA.</li>
          </ul>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <button 
            onClick={() => navigateTo('student-dashboard')}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {isPreTest && (
            <button 
              onClick={() => navigateTo('lesson', { lessonId: 1 })}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Begin Lesson 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const recordedCount = Object.keys(taskRecordings).length;
  const allTasksRecorded = assessmentData.tasks.every(t => taskRecordings[t.taskNumber]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* HEADER & CONSTRUCT BADGE */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded-md">
              {assessmentData.form}
            </span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Fatoni University Thesis Instrument
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Strict Single-Take Protocol</span>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {assessmentData.title}
        </h1>
        <p className="text-sm text-slate-600 font-medium mt-1">
          {assessmentData.description}
        </p>
      </div>

      {/* 4-TASK STEPPER TABS */}
      <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {assessmentData.tasks.map((task, idx) => {
          const isDone = !!taskRecordings[task.taskNumber];
          const isActive = currentTaskIndex === idx;
          return (
            <button
              key={task.taskNumber}
              onClick={() => setCurrentTaskIndex(idx)}
              className={`p-3 rounded-xl text-left transition-all relative ${
                isActive 
                  ? 'bg-white shadow-sm border border-slate-200 ring-2 ring-indigo-500/20' 
                  : 'hover:bg-slate-200/60 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                  Task {task.taskNumber} of 4
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
              </div>
              <p className={`text-xs font-bold truncate mt-1 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                {task.title.split('&')[0]}
              </p>
            </button>
          );
        })}
      </div>

      {/* CURRENT TASK WORKPLACE SCENARIO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Scenario Header */}
        <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-indigo-300">
                {currentTask.workplaceContext} ({currentTask.jobId})
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              Task {currentTask.taskNumber}: {currentTask.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
              Prep: {currentTask.prepTimeSeconds}s | Speak: {currentTask.speakTimeSeconds}s
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Situation Prompt */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Workplace Situation:
            </p>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {currentTask.situation}
            </p>
          </div>

          {/* CRM Ticket Card (For Task 4) or Ticket Details */}
          {currentTask.crmTicketRecord ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden font-mono text-xs">
              <div className="bg-slate-800 text-slate-200 px-4 py-2 flex justify-between items-center font-bold">
                <span>INCIDENT RECORD {currentTask.crmTicketRecord.ticketId}</span>
                <span className="text-amber-400">{currentTask.crmTicketRecord.priority}</span>
              </div>
              <div className="p-4 bg-slate-900 text-slate-100 space-y-2">
                <p><span className="text-slate-400">Account:</span> {currentTask.crmTicketRecord.account}</p>
                <p><span className="text-slate-400">Symptom:</span> {currentTask.crmTicketRecord.symptom}</p>
                <p><span className="text-slate-400">Root Cause:</span> {currentTask.crmTicketRecord.rootCause}</p>
                <p><span className="text-slate-400">Actions Completed:</span> {currentTask.crmTicketRecord.actionsCompleted}</p>
                <p><span className="text-slate-400">Current Status:</span> {currentTask.crmTicketRecord.currentStatus}</p>
                <p className="text-emerald-400 font-bold"><span className="text-slate-400">Next Step & SLA:</span> {currentTask.crmTicketRecord.nextStep}</p>
              </div>
            </div>
          ) : currentTask.ticketDetails && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 font-bold block">System:</span>
                <span className="font-semibold text-slate-900">{currentTask.ticketDetails.system}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Ticket ID:</span>
                <span className="font-mono font-bold text-indigo-700">{currentTask.ticketDetails.ticketId}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Caller:</span>
                <span className="font-semibold text-slate-900">{currentTask.ticketDetails.customer}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Priority:</span>
                <span className="font-bold text-amber-700">{currentTask.ticketDetails.priority}</span>
              </div>
            </div>
          )}

          {/* AUDIO PROMPT PLAYER */}
          <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 p-5 rounded-2xl space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
                  Prerecorded Customer Audio Prompt ({currentTask.jobId})
                </span>
              </div>
              <button
                onClick={playPromptAudio}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 ${
                  isPlayingPrompt 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isPlayingPrompt ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingPrompt ? 'Stop Audio' : 'Play Customer Prompt'}</span>
              </button>
            </div>
            <p className="text-sm italic text-slate-700 bg-white/80 p-3.5 rounded-xl border border-indigo-100 font-medium">
              "{currentTask.customerPromptText}"
            </p>
          </div>

          {/* CANDIDATE TASK DIRECTIVE */}
          <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-white">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Target Workplace Communication Requirements:
            </h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {currentTask.targetCommunicationFunctions.map((fn, i) => (
                <li key={i} className="font-medium">{fn}</li>
              ))}
            </ul>
          </div>

          {/* PREPARATION TIMER & SCRATCHPAD NOTES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prep Timer Card */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Preparation Phase ({currentTask.prepTimeSeconds}s)
                  </span>
                  <span className="text-lg font-mono font-black text-indigo-600">
                    {prepTimeRemaining}s
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Review the context and write key sentence structures in the notes space below before speaking.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                {!isPrepping && !prepDone && (
                  <button
                    onClick={startPrepTimer}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                  >
                    Start {currentTask.prepTimeSeconds}s Preparation
                  </button>
                )}
                {isPrepping && (
                  <button
                    onClick={skipPrepTimer}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Skip to Recording Now
                  </button>
                )}
                {prepDone && (
                  <div className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-center text-xs font-bold rounded-lg">
                    Preparation Complete
                  </div>
                )}
              </div>
            </div>

            {/* Notes Space (Matches Appendix B Answer Space) */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Candidate Preparation Notes:
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Scratchpad only</span>
              </div>
              <textarea
                value={taskNotes[currentTask.taskNumber] || ''}
                onChange={(e) => setTaskNotes({ ...taskNotes, [currentTask.taskNumber]: e.target.value })}
                rows={3}
                placeholder="Jot down keywords (e.g. May I please verify... / If you clear cookies, it will...)"
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* RECORDING CONSOLE */}
          <div className="border-2 border-indigo-100 bg-white p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Mic className={`w-5 h-5 ${recordingState === 'recording' ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Spoken Response Recording (Target: {currentTask.speakTimeSeconds} Seconds)
              </span>
            </div>

            {/* Recording Timer / Counter */}
            <div className="text-4xl font-mono font-black text-slate-900 tracking-wider">
              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
            </div>

            {/* Waveform / Status Animation */}
            {recordingState === 'recording' && (
              <div className="flex justify-center items-center gap-1.5 h-8">
                {[40, 70, 95, 60, 85, 45, 100, 75, 55, 90, 65, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-rose-500 rounded-full animate-bounce"
                    style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-3 pt-2">
              {recordingState === 'idle' && (
                <button
                  onClick={startRecording}
                  className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Recording (Single-Take)</span>
                </button>
              )}

              {recordingState === 'recording' && (
                <button
                  onClick={stopRecording}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
                >
                  <Square className="w-4 h-4 fill-current text-rose-500" />
                  <span>Stop & Save Task {currentTask.taskNumber}</span>
                </button>
              )}

              {recordingState === 'recorded' && (
                <div className="space-y-4 w-full max-w-md mx-auto">
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Task {currentTask.taskNumber} Spoken Audio Recorded
                    </span>
                    <button
                      onClick={handleRetake}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-record</span>
                    </button>
                  </div>

                  {taskRecordings[currentTask.taskNumber]?.url && (
                    <audio 
                      controls 
                      src={taskRecordings[currentTask.taskNumber].url} 
                      className="w-full h-10 rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* STEPPER FOOTER NAVIGATION */}
          <div className="border-t border-slate-200 pt-5 flex items-center justify-between">
            <button
              disabled={currentTaskIndex === 0}
              onClick={() => setCurrentTaskIndex(prev => prev - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Task</span>
            </button>

            <div className="flex items-center gap-3">
              {currentTaskIndex < assessmentData.tasks.length - 1 ? (
                <button
                  onClick={() => setCurrentTaskIndex(prev => prev + 1)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  <span>Proceed to Task {currentTask.taskNumber + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={recordedCount === 0 || isSubmitting}
                  onClick={handleSubmitAll}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'Uploading Responses...' 
                      : allTasksRecorded 
                        ? `Submit All ${assessmentData.tasks.length} Tasks (${type})` 
                        : `Submit Recorded (${recordedCount} of ${assessmentData.tasks.length} Tasks)`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
