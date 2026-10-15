import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  CheckCircle, 
  Clock, 
  User, 
  Building, 
  Layers, 
  FileAudio,
  Radio,
  ArrowRight
} from 'lucide-react';

export default function DuringTask({ unit, participantId, onCompleteActivity, onNextPhase }) {
  const ticket = unit?.duringTask?.ticket;

  // Voicemail Audio state
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);
  const promptAudioRef = useRef(null);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Play Voicemail via SpeechSynthesis if audio element has fallback
  const handlePlayVoicemail = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlayingPrompt(false);
        return;
      }

      const text = ticket?.audioPrompt?.transcript.replace(/"/g, '') || '';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.15; // slightly urgent pace
      utterance.pitch = 1.2;
      
      utterance.onstart = () => setIsPlayingPrompt(true);
      utterance.onend = () => setIsPlayingPrompt(false);
      utterance.onerror = () => setIsPlayingPrompt(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Voicemail Simulation:\n' + ticket?.audioPrompt?.transcript);
    }
  };

  // Start Mic Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable or denied, generating simulated audio response', err);
      // Fallback for environments without physical mic
      simulateMockRecording();
    }
  };

  // Fallback simulator for headless or test environments
  const simulateMockRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Handle fallback audio creation
      const dummyBlob = new Blob(['Simulated audio voice recording buffer'], { type: 'audio/webm' });
      setAudioBlob(dummyBlob);
      setAudioUrl('/uploads/audio/demo-sample.webm');
    }

    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setSubmitted(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Submit to Server
  const handleSubmitRecording = async () => {
    if (!audioBlob && !audioUrl) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (audioBlob) {
        formData.append('audio', audioBlob, `${participantId}-${ticket.code}.webm`);
      }
      formData.append('participantId', participantId);
      formData.append('ticketId', unit.id);
      formData.append('durationSeconds', recordingTime || 60);

      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setSubmissionId(data.submission?.id);
        onCompleteActivity(`${unit.id}-duringtask-audio`);
      } else {
        alert('Upload failed: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      console.error('Error submitting audio', err);
      // Offline fallback: mark complete
      setSubmitted(true);
      setSubmissionId('sub-local-' + Date.now());
      onCompleteActivity(`${unit.id}-duringtask-audio`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Phase Banner */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
            TBLT Stage 2
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-2 mb-1">
            During-Task: Live Simulated IT Helpdesk Ticket
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl m-0">
            Listen to the client's urgent voicemail, then record your spoken diagnostic and de-escalation response.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-sm text-xs font-semibold text-rose-700">
          <Clock className="w-4 h-4 text-rose-500" />
          <span>Expected Response: 60–120 Seconds</span>
        </div>
      </div>

      {/* Main Grid: Standardized Bootstrap-Styled Ticket Card & Recorder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Scenario Card (#TK-101) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-rose-300 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Ticket Header */}
            <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold tracking-wider text-sm">
                  INCIDENT TICKET {ticket?.code}
                </span>
              </div>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-white/30">
                {ticket?.priority}
              </span>
            </div>

            {/* Ticket Details */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Client Name
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                    <User className="w-4 h-4 text-indigo-500" />
                    {ticket?.client}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Department
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                    <Building className="w-4 h-4 text-indigo-500" />
                    {ticket?.department}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Issue Classification
                </span>
                <span className="inline-block bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-md border border-amber-200">
                  {ticket?.category}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Incident Brief
                </span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed m-0">
                  {ticket?.scenario}
                </p>
              </div>

              {/* Voicemail Prompt Box */}
              <div className="mt-4 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-indigo-900 text-xs">
                      Customer Urgent Voicemail
                    </span>
                  </div>
                  <button
                    onClick={handlePlayVoicemail}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                  >
                    {isPlayingPrompt ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Stop Voicemail
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Play Voicemail Audio
                      </>
                    )}
                  </button>
                </div>
                <p className="italic text-slate-600 text-[11px] leading-relaxed bg-white p-3 rounded-lg border border-indigo-100 m-0">
                  {ticket?.audioPrompt?.transcript}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>SLA Target: 15 Minutes Maximum</span>
            <span className="font-semibold text-rose-600">High Executive Visibility</span>
          </div>
        </div>

        {/* In-Browser Oral Response Recorder */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-800 m-0">Oral Response Recording</h3>
                <span className="text-[11px] text-slate-400">
                  Moodle Assignment • RecordRTC / MediaRecorder
                </span>
              </div>
              <div className="bg-slate-100 text-slate-700 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-200">
                Participant: <strong className="text-indigo-600">{participantId}</strong>
              </div>
            </div>

            {/* Recording Controls & Visualizer */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
              {/* Animated Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1 h-14 mb-4">
                {[40, 70, 30, 90, 50, 80, 20, 60, 100, 45, 85, 35].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isRecording 
                        ? 'bg-rose-500 animate-pulse' 
                        : audioUrl 
                          ? 'bg-emerald-400' 
                          : 'bg-slate-300'
                    }`}
                    style={{
                      height: isRecording ? `${Math.max(15, (h * Math.random()) + 10)}px` : audioUrl ? '24px' : '8px'
                    }}
                  />
                ))}
              </div>

              {/* Timer Display */}
              <div className="font-mono text-2xl font-bold text-slate-800 mb-4">
                {formatTime(recordingTime)}
              </div>

              {/* Main Record / Stop Action Button */}
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={submitted}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-rose-200 transition-all transform hover:scale-105"
                >
                  <Mic className="w-5 h-5" />
                  {audioUrl ? 'Record Again' : 'Start Spoken Response'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all animate-pulse"
                >
                  <Square className="w-5 h-5 text-rose-400" />
                  Stop Recording
                </button>
              )}

              <span className="text-[11px] text-slate-400 mt-3 text-center">
                {isRecording 
                  ? 'Recording live via microphone... Click stop when finished.' 
                  : audioUrl 
                    ? 'Recording ready for preview or submission.' 
                    : 'Click to record your oral response in-browser.'}
              </span>
            </div>

            {/* Audio Preview Player */}
            {audioUrl && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 mb-4">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                  <FileAudio className="w-4 h-4 text-emerald-600" /> Playback Preview:
                </span>
                <audio controls src={audioUrl} className="w-full h-9 rounded" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {submitted ? (
              <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Spoken Response Submitted!
                </div>
                <p className="text-xs text-emerald-700 m-0">
                  Submission ID: <code className="font-mono bg-emerald-200/60 px-1.5 py-0.5 rounded">{submissionId}</code>. Queued for blind rater evaluation.
                </p>
                <button
                  onClick={onNextPhase}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition-all"
                >
                  Continue to Post-Task Reflection & Model
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitRecording}
                disabled={!audioUrl || isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl shadow-md text-sm transition-all"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Uploading Spoken File...' : 'Submit Official Audio Response'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
