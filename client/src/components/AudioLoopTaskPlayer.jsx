import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Mic, StopCircle, CheckCircle, RotateCcw, 
  ArrowRight, ArrowLeft, Volume2, Lock, Unlock, Sparkles, 
  Lightbulb, BookOpen, AlertCircle, Check, FileAudio, 
  PhoneCall, ShieldCheck, HelpCircle, ChevronDown, ChevronUp,
  Headphones, Award
} from 'lucide-react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function AudioLoopTaskPlayer({
  lessonId,
  lesson,
  loopTask,
  isCompleted = false,
  studentState = {},
  existingSubmission = null,
  onSubmitSuccess,
  onProceedToResults,
  onBack
}) {
  const task = loopTask || lesson?.loopTask || lesson?.speaking;
  const turns = task?.turns || [];
  const studentTurns = turns.filter(t => t.isStudent);
  const totalStudentTurns = studentTurns.length;

  // Active turn index in the loop
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);

  // Turn recordings dictionary: { [turnNumber]: { blob, url, duration } }
  const [turnRecordings, setTurnRecordings] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTurnNumber, setRecordingTurnNumber] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Prompt audio player state (SpeechSynthesis)
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);
  const [playingTurnIndex, setPlayingTurnIndex] = useState(null);
  const [promptTime, setPromptTime] = useState(0);
  const [promptProgress, setPromptProgress] = useState(0);

  // Full Model Dialogue Player state
  const [isPlayingFullDialogue, setIsPlayingFullDialogue] = useState(false);
  const [dialogueTime, setDialogueTime] = useState(0);
  const [dialogueDuration, setDialogueDuration] = useState(0);
  const fullDialogueAudioRef = useRef(null);
  const fullDialogueLessonIdRef = useRef(null);
  const promptAudioElementRef = useRef(null);

  // Single Turn Model Dialogue Audio Player state (Review mode)
  const [playingTurnAudioNum, setPlayingTurnAudioNum] = useState(null);
  const singleTurnAudioRef = useRef(null);

  // Checklist state: { [itemIdx]: boolean }
  const [checklistState, setChecklistState] = useState({});
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showPostTask, setShowPostTask] = useState(isCompleted);
  const [activeReviewTab, setActiveReviewTab] = useState('model'); // 'model' | 'recordings'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordTimerRef = useRef(null);
  const promptTimerRef = useRef(null);

  // Pre-populate existing submission audio when reviewing
  useEffect(() => {
    if (existingSubmission) {
      const taskUrls = existingSubmission.task_audio_urls || 
                       existingSubmission.self_assessment?.task_audio_urls || {};
      const preloaded = {};
      
      // Map task audio URLs to turns
      studentTurns.forEach(st => {
        const turnKey = `turn_${st.turnNumber}`;
        const url = taskUrls[turnKey] || taskUrls[st.turnNumber] || 
                    (st.turnNumber === 2 ? existingSubmission.audio_url : null);
        if (url) {
          preloaded[st.turnNumber] = {
            url,
            duration: existingSubmission.duration_seconds || st.timeLimit || 30
          };
        }
      });

      if (Object.keys(preloaded).length > 0) {
        setTurnRecordings(preloaded);
      } else if (existingSubmission.audio_url && studentTurns.length > 0) {
        setTurnRecordings({
          [studentTurns[0].turnNumber]: {
            url: existingSubmission.audio_url,
            duration: existingSubmission.duration_seconds || 30
          }
        });
      }

      if (isCompleted) {
        setShowPostTask(true);
      }
    }
  }, [existingSubmission, isCompleted]);

  // Clean up timers & audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (promptAudioElementRef.current) {
        promptAudioElementRef.current.pause();
      }
      if (fullDialogueAudioRef.current) {
        fullDialogueAudioRef.current.pause();
      }
      if (singleTurnAudioRef.current) {
        singleTurnAudioRef.current.pause();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(recordTimerRef.current);
      clearInterval(promptTimerRef.current);
      // Revoke created URLs
      Object.values(turnRecordings).forEach(rec => {
        if (rec.url && rec.url.startsWith('blob:')) {
          URL.revokeObjectURL(rec.url);
        }
      });
    };
  }, []);

  const currentTurn = turns[activeTurnIndex] || turns[0];
  const isCurrentStudent = currentTurn?.isStudent;

  // Number of student turns recorded so far
  const recordedCount = studentTurns.filter(st => !!turnRecordings[st.turnNumber]).length;
  const allStudentTurnsRecorded = recordedCount >= totalStudentTurns;

  // Checklist completion check
  const checklistItems = task?.postTask?.selfAssessmentChecklist || task?.checklist || [];
  const checkedCount = Object.values(checklistState).filter(Boolean).length;
  const isChecklistSatisfied = isCompleted || checkedCount >= Math.min(2, checklistItems.length);
  const isReadyToSubmit = allStudentTurnsRecorded && isChecklistSatisfied;

  // Helper: Can student navigate to turn idx?
  // In review mode: all turns accessible.
  // In practice mode: all prior student turns before idx must be recorded.
  const isTurnUnlocked = (idx) => {
    if (isCompleted) return true;
    if (idx === 0) return true;
    for (let i = 0; i < idx; i++) {
      const t = turns[i];
      if (t.isStudent && !turnRecordings[t.turnNumber]) {
        return false;
      }
    }
    return true;
  };

  // ==========================================
  // CUSTOMER PROMPT AUDIO PLAYER (WAV with TTS Fallback)
  // ==========================================
  const togglePlayCustomerAudio = (text, turnIdx) => {
    if (isPlayingPrompt && playingTurnIndex === turnIdx) {
      if (promptAudioElementRef.current) {
        promptAudioElementRef.current.pause();
        promptAudioElementRef.current.currentTime = 0;
      }
      window.speechSynthesis.cancel();
      setIsPlayingPrompt(false);
      setPlayingTurnIndex(null);
      clearInterval(promptTimerRef.current);
      return;
    }

    if (promptAudioElementRef.current) {
      promptAudioElementRef.current.pause();
    }
    if (fullDialogueAudioRef.current) {
      fullDialogueAudioRef.current.pause();
      setIsPlayingFullDialogue(false);
    }
    window.speechSynthesis.cancel();
    clearInterval(promptTimerRef.current);

    const turnObj = turns[turnIdx];
    const turnNumber = turnObj?.turnNumber || (turnIdx + 1);
    const audioSrc = `/audio_turns/lesson_${lessonId}_turn_${turnNumber}.wav`;

    if (!promptAudioElementRef.current) {
      promptAudioElementRef.current = new Audio();
    }
    const audio = promptAudioElementRef.current;
    audio.src = audioSrc;

    audio.onplay = () => {
      setIsPlayingPrompt(true);
      setPlayingTurnIndex(turnIdx);
      setPromptTime(0);
      setPromptProgress(0);
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setPromptTime(audio.currentTime);
        setPromptProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setIsPlayingPrompt(false);
      setPlayingTurnIndex(null);
      setPromptProgress(100);
    };

    audio.onerror = () => {
      // Fallback to SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const engVoices = voices.filter(v => v.lang.startsWith('en-'));
      if (engVoices.length > 0) {
        utterance.voice = engVoices[0];
      }
      utterance.rate = 0.95;
      const estimatedDuration = Math.max(text.split(' ').length * 0.45, 5);

      utterance.onstart = () => {
        setIsPlayingPrompt(true);
        setPlayingTurnIndex(turnIdx);
        setPromptTime(0);
        setPromptProgress(0);
        promptTimerRef.current = setInterval(() => {
          setPromptTime(prev => {
            const next = prev + 0.1;
            setPromptProgress(Math.min((next / estimatedDuration) * 100, 100));
            return next;
          });
        }, 100);
      };

      utterance.onend = () => {
        setIsPlayingPrompt(false);
        setPlayingTurnIndex(null);
        setPromptProgress(100);
        clearInterval(promptTimerRef.current);
      };

      utterance.onerror = () => {
        setIsPlayingPrompt(false);
        setPlayingTurnIndex(null);
        clearInterval(promptTimerRef.current);
      };

      window.speechSynthesis.speak(utterance);
    };

    audio.play().catch(() => {
      audio.onerror();
    });
  };

  // Full Model Dialogue Player (Native Audio)
  const togglePlayFullDialogue = () => {
    // Immediately stop single turn audio if active
    if (singleTurnAudioRef.current) {
      singleTurnAudioRef.current.pause();
      setPlayingTurnAudioNum(null);
    }
    if (promptAudioElementRef.current) {
      promptAudioElementRef.current.pause();
      setIsPlayingPrompt(false);
    }
    window.speechSynthesis.cancel();

    if (!fullDialogueAudioRef.current || fullDialogueLessonIdRef.current !== lessonId) {
      if (fullDialogueAudioRef.current) {
        fullDialogueAudioRef.current.pause();
      }
      const audio = new Audio(`/audio_loop_dialogue/lesson_${lessonId}_dialogue.wav`);
      fullDialogueLessonIdRef.current = lessonId;

      audio.onplay = () => setIsPlayingFullDialogue(true);
      audio.onpause = () => setIsPlayingFullDialogue(false);
      audio.onended = () => {
        setIsPlayingFullDialogue(false);
        setDialogueTime(0);
      };
      audio.ontimeupdate = () => {
        setDialogueTime(audio.currentTime || 0);
      };
      audio.onloadedmetadata = () => {
        setDialogueDuration(audio.duration || 0);
      };
      fullDialogueAudioRef.current = audio;
    }

    if (isPlayingFullDialogue) {
      fullDialogueAudioRef.current.pause();
    } else {
      fullDialogueAudioRef.current.play().catch(e => {
        console.warn('Could not play full dialogue audio:', e);
      });
    }
  };

  // Play/Pause single line from Model Dialogue (Review Mode)
  const togglePlaySingleTurnAudio = (turnNum, text) => {
    // If this turn is already playing, PAUSE it
    if (playingTurnAudioNum === turnNum && singleTurnAudioRef.current) {
      singleTurnAudioRef.current.pause();
      setPlayingTurnAudioNum(null);
      return;
    }

    // Stop any full dialogue currently playing
    if (fullDialogueAudioRef.current) {
      fullDialogueAudioRef.current.pause();
      setIsPlayingFullDialogue(false);
    }
    // Stop any customer prompt currently playing
    if (promptAudioElementRef.current) {
      promptAudioElementRef.current.pause();
      setIsPlayingPrompt(false);
    }
    // Stop any previously playing single turn audio
    if (singleTurnAudioRef.current) {
      singleTurnAudioRef.current.pause();
      singleTurnAudioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();

    const audio = new Audio(`/audio_turns/lesson_${lessonId}_turn_${turnNum}.wav`);
    audio.onplay = () => setPlayingTurnAudioNum(turnNum);
    audio.onpause = () => {
      setPlayingTurnAudioNum(prev => (prev === turnNum ? null : prev));
    };
    audio.onended = () => {
      setPlayingTurnAudioNum(null);
    };
    audio.onerror = () => {
      // Fallback to SpeechSynthesis
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.onend = () => setPlayingTurnAudioNum(null);
      u.onerror = () => setPlayingTurnAudioNum(null);
      window.speechSynthesis.speak(u);
      setPlayingTurnAudioNum(turnNum);
    };

    singleTurnAudioRef.current = audio;
    audio.play().catch(e => {
      console.warn('Could not play single turn audio, falling back to TTS:', e);
      audio.onerror();
    });
  };

  // ==========================================
  // STUDENT AUDIO RECORDING (PER TURN)
  // ==========================================
  const startRecording = async (turnNum) => {
    if (isCompleted) return;
    try {
      window.speechSynthesis.cancel();
      setIsPlayingPrompt(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm'
        });
        const url = URL.createObjectURL(audioBlob);
        setTurnRecordings(prev => ({
          ...prev,
          [turnNum]: {
            blob: audioBlob,
            url,
            duration: recordingTime || 20
          }
        }));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTurnNumber(turnNum);
      setRecordingTime(0);

      clearInterval(recordTimerRef.current);
      recordTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      alert('Could not access your microphone. Please allow microphone permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    clearInterval(recordTimerRef.current);
    setIsRecording(false);
    setRecordingTurnNumber(null);
  };

  const reRecordTurn = (turnNum) => {
    if (isCompleted) return;
    setTurnRecordings(prev => {
      const next = { ...prev };
      if (next[turnNum]?.url && next[turnNum].url.startsWith('blob:')) {
        URL.revokeObjectURL(next[turnNum].url);
      }
      delete next[turnNum];
      return next;
    });
  };

  // ==========================================
  // FINAL SUBMISSION HANDLER
  // ==========================================
  const handleSubmitLoopTask = async () => {
    if (!isReadyToSubmit || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const uId = studentState?.userId || studentState?.id;
      const pCode = studentState?.id || studentState?.userId;
      const formData = new FormData();

      if (uId) formData.append('userId', uId);
      if (pCode) formData.append('participant_id', pCode);
      formData.append('unit_id', lesson?.unitId || `lesson_${lessonId}`);

      // Self assessment metadata
      const meta = {
        checklist: checklistState,
        completedTurns: Object.keys(turnRecordings).map(Number),
        completedCount: recordedCount,
        submittedAt: new Date().toISOString()
      };

      // 1. Mark progress & self-assessment in SQLite (Formative Practice Lab - No heavy audio storage bloat)
      const updatedLessons = { ...(studentState.lessonsProgress || {}) };
      const curr = { ...(updatedLessons[lessonId] || { sectionsCompleted: {} }) };
      curr.isCompleted = true;
      curr.speakingPracticeCompleted = true;
      curr.sectionsCompleted = { ...curr.sectionsCompleted, speaking: true };
      updatedLessons[lessonId] = curr;

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uId || pCode,
          unitId: lesson?.unitId || `lesson_${lessonId}`,
          status: 'completed',
          sectionsCompleted: curr.sectionsCompleted,
          reviewScore: curr.reviewScore || 100,
          selfAssessment: meta
        })
      });

      // Unlock post-task model answer
      setShowPostTask(true);
      setActiveReviewTab('model');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (e) {
      console.error('Failed to submit loop task:', e);
      alert('Network issue while submitting. Your recordings are saved locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Task Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-indigo-600" />
              {task.isCapstone6Turn ? '6-Turn Capstone Audio Loop Task' : '4-Turn Audio Loop Task'}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {recordedCount} of {totalStudentTurns} Spoken Turns Recorded
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{task.title}</h3>
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-2 mt-0.5">
            <span>{task.workplace}</span>
            <span>&bull;</span>
            <span className="text-indigo-600 font-bold">Caller: {task.callerName}</span>
          </p>
        </div>

        {/* Quick Reference Button */}
        <button
          type="button"
          onClick={() => setShowCheatSheet(!showCheatSheet)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
            showCheatSheet
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{showCheatSheet ? 'Hide Helpdesk Cheat Sheet' : 'Helpdesk Cheat Sheet (Vocab & Phrases)'}</span>
          {showCheatSheet ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Completion Banner if in Review Mode */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-emerald-900">Audio Loop Task Submitted & Verified</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Your multi-turn responses have been archived for instructor evaluation. Review mode active.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveReviewTab('model')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeReviewTab === 'model'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Model Dialogue & Analysis
            </button>
            <button
              onClick={() => setActiveReviewTab('recordings')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeReviewTab === 'recordings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              My Spoken Recordings
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Helpdesk Cheat Sheet */}
      {showCheatSheet && task.preTask && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4 animate-fade-in shadow-inner">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Helpdesk Reference: Useful Expressions & Customer Translation
            </h4>
            <span className="text-[10px] font-bold text-amber-700">Pre-Task Study Aid</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Useful Expressions */}
            <div className="space-y-3">
              <p className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                Target Communication Phrases:
              </p>
              {task.preTask.usefulExpressions?.map((cat, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm space-y-1">
                  <p className="font-bold text-indigo-900 text-[11px]">{cat.category}</p>
                  <ul className="space-y-1 text-slate-700 pl-3 list-disc text-[11px]">
                    {cat.examples.map((ex, exIdx) => (
                      <li key={exIdx} className="italic text-slate-800 font-medium">"{ex}"</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Customer vs Tech Vocabulary */}
            <div className="space-y-3">
              <p className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                Customer Language vs. Technical Support Terms:
              </p>
              <div className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-amber-100/60 border-b border-amber-200 text-amber-900 font-bold">
                    <tr>
                      <th className="p-2">Customer Phrase</th>
                      <th className="p-2">Technical Term</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {task.preTask.vocabulary?.map((v, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/50">
                        <td className="p-2 font-semibold text-rose-700 italic">"{v.customerPhrase}"</td>
                        <td className="p-2 font-bold text-indigo-700 font-mono">{v.technicalTerm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grammar Tip */}
              {task.preTask.grammarFocus && (
                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm text-[11px] space-y-1">
                  <p className="font-bold text-emerald-900">{task.preTask.grammarFocus.title}</p>
                  <p className="font-mono text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                    {task.preTask.grammarFocus.syntax}
                  </p>
                  <p className="text-emerald-700 font-medium mt-1">
                    <span className="font-bold text-emerald-800">Professional Example:</span> "{task.preTask.grammarFocus.good}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REVIEW MODE: MODEL DIALOGUE & LANGUAGE RATIONALE REVEAL */}
      {/* ========================================================================= */}
      {showPostTask && activeReviewTab === 'model' && (
        <div className="space-y-6 animate-fade-in">
          {/* Benchmark Model Dialogue */}
          <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Benchmark Ideal Dialogue
                </span>
                <h4 className="text-lg font-black text-white mt-0.5">
                  Professional Contact Center Model Responses
                </h4>
              </div>
              <span className="text-xs bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full font-bold">
                Quality Assurance (QA) Standard
              </span>
            </div>

            {/* Native Full Model Dialogue Audio Player */}
            <div className="bg-indigo-950/80 border border-indigo-700/60 p-4 rounded-xl flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayFullDialogue}
                    className="w-11 h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-md transition transform hover:scale-105 cursor-pointer"
                    title={isPlayingFullDialogue ? 'Pause Dialogue' : 'Play Full Dialogue'}
                  >
                    {isPlayingFullDialogue ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>{isPlayingFullDialogue ? 'Playing Full Best Practice Dialogue...' : 'Listen to Full Native Model Dialogue'}</span>
                    </p>
                    <p className="text-[10px] text-indigo-300 mt-0.5">
                      Authentic 2-voice workplace conversation (Customer + Professional Support Agent)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[10px] font-mono text-indigo-300">
                    {formatTime(dialogueTime)} / {formatTime(dialogueDuration || 0)}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-800 text-indigo-200 px-2.5 py-1 rounded-lg border border-indigo-700">
                    Gemini Neural Voice
                  </span>
                </div>
              </div>

              {/* Progress timeline */}
              <div 
                className="w-full bg-indigo-900/80 rounded-full h-1.5 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  if (fullDialogueAudioRef.current && dialogueDuration > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    fullDialogueAudioRef.current.currentTime = ratio * dialogueDuration;
                    setDialogueTime(fullDialogueAudioRef.current.currentTime);
                  }
                }}
              >
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-100"
                  style={{ width: `${dialogueDuration ? (dialogueTime / dialogueDuration) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {task.postTask?.modelDialogue?.map((item, idx) => {
                const isAgent = item.speaker.toLowerCase().includes('agent') || item.speaker.toLowerCase().includes('golf') || item.speaker.toLowerCase().includes('mei') || item.speaker.toLowerCase().includes('pear');
                const isTurnPlaying = playingTurnAudioNum === item.turn;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isTurnPlaying
                        ? 'bg-indigo-950/90 border-amber-400/80 ring-2 ring-amber-400/40 shadow-lg'
                        : isAgent
                        ? 'bg-blue-600/30 border-blue-400/40 ml-4 sm:ml-8'
                        : 'bg-slate-800/80 border-slate-700 mr-4 sm:mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-black ${isTurnPlaying ? 'text-amber-400' : isAgent ? 'text-amber-300' : 'text-slate-300'}`}>
                        Turn {item.turn}: {item.speaker}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.purpose && (
                          <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-indigo-200 border border-indigo-700/50">
                            {item.purpose}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => togglePlaySingleTurnAudio(item.turn, item.text)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                            isTurnPlaying
                              ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-md font-black'
                              : 'bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white border-white/10'
                          }`}
                          title={isTurnPlaying ? 'Pause playback' : 'Listen to this line'}
                        >
                          {isTurnPlaying ? (
                            <>
                              <Pause className="w-3 h-3 text-slate-950 fill-current" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-amber-300 fill-current ml-0.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-white">
                      "{item.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Language Functions & Professional Rationale */}
          {task.postTask?.languageFunctions && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    Language Functions & Workplace Rationale
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Why these specific phrasings achieve high marks in customer service and QA audits
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">BPO Rubric Insights</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Target Phrasing</th>
                      <th className="p-3">Communication Function</th>
                      <th className="p-3">Workplace QA Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {task.postTask.languageFunctions.map((fn, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-3 font-bold text-indigo-700 italic">"{fn.phrasing}"</td>
                        <td className="p-3 font-semibold text-slate-800">{fn.function}</td>
                        <td className="p-3 text-slate-600 font-medium">{fn.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Alternative Responses */}
          {task.postTask?.alternativeResponses && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Alternative Professional Styles:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {task.postTask.alternativeResponses.map((alt, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-indigo-700 text-xs block">{alt.style}</span>
                    {alt.turn2 && <p className="text-slate-700"><strong className="text-slate-500">Turn 2:</strong> "{alt.turn2}"</p>}
                    {alt.turn4 && <p className="text-slate-700"><strong className="text-slate-500">Turn 4:</strong> "{alt.turn4}"</p>}
                    {alt.turn6 && <p className="text-slate-700"><strong className="text-slate-500">Turn 6:</strong> "{alt.turn6}"</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Post-Task Model Review Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onBack}
              className="text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Review Quiz
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveReviewTab('recordings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Headphones className="w-4 h-4 text-indigo-600" />
                <span>Listen to My Recordings</span>
              </button>
              {onProceedToResults && (
                <button
                  type="button"
                  onClick={onProceedToResults}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition flex items-center gap-2 text-xs"
                >
                  <span>Proceed to Lesson Results</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATION INTERACTIVE WORKSPACE (TURN STEPPER & CARDS) */}
      {/* ========================================================================= */}
      {(!showPostTask || activeReviewTab === 'recordings') && (
        <div className="space-y-6">
          {/* Turn-by-Turn Interactive Stepper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                Audio Loop Sequence ({turns.length} Turns)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Step {activeTurnIndex + 1} of {turns.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {turns.map((t, idx) => {
                const isActive = activeTurnIndex === idx;
                const hasRecording = t.isStudent && !!turnRecordings[t.turnNumber];
                const isCustomer = !t.isStudent;
                const unlocked = isTurnUnlocked(idx);

                return (
                  <button
                    key={t.turnNumber}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      if (unlocked) {
                        window.speechSynthesis.cancel();
                        setIsPlayingPrompt(false);
                        setActiveTurnIndex(idx);
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      !unlocked
                        ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                        : isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                        : hasRecording
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        : isCustomer
                        ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                    title={!unlocked ? `Complete prior recording turns to unlock Turn ${t.turnNumber}` : ''}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <span>Turn {t.turnNumber}</span>
                      {!unlocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : hasRecording ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isCustomer ? (
                        <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                    </div>
                    <p className={`text-[10px] font-medium truncate mt-0.5 ${!unlocked ? 'text-slate-400' : isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {!unlocked ? 'Locked' : t.isStudent ? 'Your Voice' : 'Customer'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Turn Display Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Turn Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isCurrentStudent ? 'bg-indigo-50/60 border-indigo-100' : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  isCurrentStudent ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-slate-950'
                }`}>
                  {currentTurn.turnNumber}
                </span>
                <div>
                  <h4 className={`text-sm font-black ${isCurrentStudent ? 'text-indigo-950' : 'text-white'}`}>
                    {currentTurn.speaker}
                  </h4>
                  <p className={`text-[11px] font-medium ${isCurrentStudent ? 'text-indigo-700' : 'text-slate-400'}`}>
                    {isCurrentStudent ? 'Student Speaking Turn' : `Customer Mood: ${currentTurn.tone || 'Urgent'}`}
                  </p>
                </div>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                isCurrentStudent 
                  ? 'bg-white text-indigo-700 border-indigo-200' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                Target: {currentTurn.timeLimit}s
              </span>
            </div>

            {/* Turn Body */}
            <div className="p-6 space-y-6">
              {/* ====================================== */}
              {/* CUSTOMER TURN VIEW                     */}
              {/* ====================================== */}
              {!isCurrentStudent && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Customer Spoken Line:
                    </span>
                    <p className="text-base text-slate-900 font-medium italic leading-relaxed">
                      "{currentTurn.audioPrompt}"
                    </p>
                  </div>

                  {/* Play Customer Audio Control */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 shadow-sm">
                    <button
                      type="button"
                      onClick={() => togglePlayCustomerAudio(currentTurn.audioPrompt, activeTurnIndex)}
                      className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md transition"
                    >
                      {isPlayingPrompt && playingTurnIndex === activeTurnIndex ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4" />
                          {isPlayingPrompt && playingTurnIndex === activeTurnIndex
                            ? 'Customer speaking...'
                            : 'Click to Listen to Customer Voice'}
                        </span>
                        <span className="font-mono text-slate-400">{formatTime(promptTime)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-100"
                          style={{ width: `${isPlayingPrompt && playingTurnIndex === activeTurnIndex ? promptProgress : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation for customer turn */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={activeTurnIndex === 0}
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsPlayingPrompt(false);
                        if (activeTurnIndex > 0) setActiveTurnIndex(activeTurnIndex - 1);
                      }}
                      className="text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Turn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsPlayingPrompt(false);
                        if (activeTurnIndex < turns.length - 1) {
                          setActiveTurnIndex(activeTurnIndex + 1);
                        }
                      }}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm text-xs cursor-pointer"
                    >
                      <span>Proceed to Turn {turns[activeTurnIndex + 1]?.turnNumber || activeTurnIndex + 2} (Your Response)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ====================================== */}
              {/* STUDENT AGENT RECORDING TURN VIEW      */}
              {/* ====================================== */}
              {isCurrentStudent && (
                <div className="space-y-5">
                  {/* Task Mission Card */}
                  <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Turn {currentTurn.turnNumber} Mission Objectives:
                    </span>
                    <p className="text-sm font-semibold text-indigo-950 leading-relaxed">
                      {currentTurn.taskGoal}
                    </p>
                  </div>

                  {/* Hints / Sentence Starters */}
                  {currentTurn.hints && currentTurn.hints.length > 0 && (
                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs space-y-2 text-amber-950">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
                        Recommended Sentence Starters:
                      </p>
                      <ul className="space-y-1.5 pl-3 list-disc">
                        {currentTurn.hints.map((hint, hIdx) => (
                          <li key={hIdx} className="font-medium text-slate-800 italic">
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recorder Card */}
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-4">
                    {/* State: Not yet recorded */}
                    {!turnRecordings[currentTurn.turnNumber] && !isRecording && (
                      <div className="space-y-3">
                        <button
                          type="button"
                          disabled={isCompleted}
                          onClick={() => startRecording(currentTurn.turnNumber)}
                          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg mx-auto disabled:bg-slate-300 disabled:cursor-not-allowed group"
                        >
                          <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {isCompleted ? 'Recording Disabled in Review Mode' : `Click to Record Turn ${currentTurn.turnNumber}`}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Target speech duration: {currentTurn.timeLimit} seconds
                          </p>
                        </div>
                      </div>
                    )}

                    {/* State: Actively Recording */}
                    {isRecording && recordingTurnNumber === currentTurn.turnNumber && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="flex items-center justify-center gap-3">
                          <span className="w-4 h-4 rounded-full bg-red-600 animate-ping"></span>
                          <span className="text-3xl font-black font-mono text-red-600">
                            {formatTime(recordingTime)}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-700">
                          Recording Turn {currentTurn.turnNumber} live... Speak clearly into your mic.
                        </p>
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 mx-auto shadow-md text-xs"
                        >
                          <StopCircle className="w-5 h-5 text-red-400" />
                          <span>Stop Recording</span>
                        </button>
                      </div>
                    )}

                    {/* State: Captured */}
                    {turnRecordings[currentTurn.turnNumber] && !isRecording && (
                      <div className="space-y-3 max-w-md mx-auto">
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Turn {currentTurn.turnNumber} Audio Saved ({turnRecordings[currentTurn.turnNumber].duration}s)</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                          <audio
                            controls
                            src={turnRecordings[currentTurn.turnNumber].url}
                            className="w-full h-8"
                          />
                        </div>

                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => reRecordTurn(currentTurn.turnNumber)}
                            className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5 mx-auto transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Re-record Turn {currentTurn.turnNumber}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={activeTurnIndex === 0}
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsPlayingPrompt(false);
                        if (activeTurnIndex > 0) setActiveTurnIndex(activeTurnIndex - 1);
                      }}
                      className="text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Turn</span>
                    </button>

                    {activeTurnIndex < turns.length - 1 ? (
                      <button
                        type="button"
                        disabled={!turnRecordings[currentTurn.turnNumber] && !isCompleted}
                        onClick={() => {
                          if (turnRecordings[currentTurn.turnNumber] || isCompleted) {
                            window.speechSynthesis.cancel();
                            setIsPlayingPrompt(false);
                            setActiveTurnIndex(activeTurnIndex + 1);
                          }
                        }}
                        className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm text-xs ${
                          !turnRecordings[currentTurn.turnNumber] && !isCompleted
                            ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                        }`}
                        title={!turnRecordings[currentTurn.turnNumber] && !isCompleted ? `Record Turn ${currentTurn.turnNumber} to unlock the next turn` : ''}
                      >
                        {!turnRecordings[currentTurn.turnNumber] && !isCompleted ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Record Turn {currentTurn.turnNumber} to Proceed</span>
                          </>
                        ) : (
                          <>
                            <span>Proceed to Turn {turns[activeTurnIndex + 1]?.turnNumber}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!turnRecordings[currentTurn.turnNumber] && !isCompleted}
                        onClick={() => {
                          if (turnRecordings[currentTurn.turnNumber] || isCompleted) {
                            const selfAssessmentEl = document.getElementById('self-assessment-section');
                            if (selfAssessmentEl) {
                              selfAssessmentEl.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm text-xs ${
                          !turnRecordings[currentTurn.turnNumber] && !isCompleted
                            ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md'
                        }`}
                        title={!turnRecordings[currentTurn.turnNumber] && !isCompleted ? `Record Turn ${currentTurn.turnNumber} to unlock self-assessment` : ''}
                      >
                        {!turnRecordings[currentTurn.turnNumber] && !isCompleted ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Record Turn {currentTurn.turnNumber} to Complete</span>
                          </>
                        ) : (
                          <>
                            <span>Proceed to Self-Assessment Checklist</span>
                            <CheckCircle className="w-4 h-4 text-emerald-200" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SELF-ASSESSMENT & SUBMISSION SECTION (REVEALED ONCE ALL RECORDINGS DONE)   */}
          {/* ========================================================================= */}
          {(allStudentTurnsRecorded || isCompleted) ? (
            <div id="self-assessment-section" className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-md space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> All Spoken Turns Recorded
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      Step Final: Rubric Checklist
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    Self-Assessment Checklist & Loop Submission
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Verify the communication criteria you achieved in your spoken recordings before final submission
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {recordedCount} of {totalStudentTurns} Recorded
                </span>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {checklistItems.map((item, idx) => {
                  const isChecked = isCompleted ? true : !!checklistState[idx];
                  return (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs transition ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isCompleted}
                        onChange={(e) => {
                          setChecklistState(prev => ({ ...prev, [idx]: e.target.checked }));
                        }}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 disabled:opacity-80 shrink-0"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Review Quiz
                </button>

                {isCompleted ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPostTask(true);
                        setActiveReviewTab('model');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition flex items-center gap-2 text-xs"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>View Benchmark Model Dialogue</span>
                    </button>
                    {onProceedToResults && (
                      <button
                        type="button"
                        onClick={onProceedToResults}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition flex items-center gap-2 text-xs"
                      >
                        <span>View Lesson Results</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!isReadyToSubmit || isSubmitting}
                    onClick={handleSubmitLoopTask}
                    className="bg-emerald-600 text-white px-7 py-3 rounded-xl font-black hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition flex items-center gap-2 text-xs"
                  >
                    {isSubmitting ? (
                      'Archiving Spoken Dialogue...'
                    ) : (
                      <>
                        <span>Complete & Submit Audio Loop Task</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Self-Assessment Checklist Locked</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Complete your spoken recordings for all dialogue turns ({recordedCount} of {totalStudentTurns} recorded) to unlock the self-assessment checklist and finalize your submission.
                </p>
              </div>
              <div className="max-w-xs mx-auto">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Dialogue Progress</span>
                  <span>{recordedCount} / {totalStudentTurns} Turns Recorded</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(recordedCount / totalStudentTurns) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
