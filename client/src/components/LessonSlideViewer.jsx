import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Download, Monitor, Sparkles, BookOpen, CheckCircle, 
  MessageSquare, AlertCircle, FileText, FolderOpen, Image,
  ExternalLink, Sliders
} from 'lucide-react';
import { LESSONS_DATA } from '../data/lessonsData';

export default function LessonSlideViewer({ lessonId = 1 }) {
  const lesson = LESSONS_DATA[lessonId] || LESSONS_DATA[1];

  const [slideMode, setSlideMode] = useState(() => lesson.googleSlidesEmbedUrl ? 'google' : 'local');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState({});
  const containerRef = useRef(null);

  // Reset slide index & default mode when lesson changes
  useEffect(() => {
    setCurrentSlide(0);
    setImageError({});
    if (lesson.googleSlidesEmbedUrl) {
      setSlideMode('google');
    } else {
      setSlideMode('local');
    }
  }, [lessonId, lesson.googleSlidesEmbedUrl]);

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(e => console.warn(e));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(e => console.warn(e));
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation (Left / Right arrow) when in local mode
  useEffect(() => {
    if (slideMode !== 'local') return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slideMode]);

  const totalSlides = 5;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
  };

  // Image path for user-provided slides in public/slides/lesson{id}/slide_{num}.png
  const userSlideImagePath = `/slides/lesson${lessonId}/slide_${currentSlide + 1}.png`;

  // Render content for structured template slides when custom images are not yet provided
  const renderSlideContent = () => {
    // If user provided a slide image and it loaded without error
    if (!imageError[`${lessonId}_${currentSlide}`]) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
          <img 
            src={userSlideImagePath} 
            alt={`Lesson ${lessonId} Slide ${currentSlide + 1}`}
            onError={() => setImageError(prev => ({ ...prev, [`${lessonId}_${currentSlide}`]: true }))}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }

    // Default High-Fidelity Pedagogical Template Slides
    switch (currentSlide) {
      case 0:
        // SLIDE 1: Title & Workplace Scenario
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-4 z-10">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
                  TECHQUEST EOP Presentation Deck
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{lesson.company}</p>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                Lesson {lessonId} / Unit 8
              </span>
            </div>

            <div className="my-auto py-6 z-10 space-y-4">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 inline-block">
                Unit {lessonId}: Core Workplace Competency
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {lesson.title}
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl font-medium">
                {lesson.focus}
              </p>
            </div>

            <div className="flex justify-between items-end border-t border-slate-800 pt-4 text-xs text-slate-400 z-10">
              <span>Duration: {lesson.duration || '120 mins'}</span>
              <span className="font-mono text-teal-400">Slide 1: Overview</span>
            </div>
          </div>
        );

      case 1:
        // SLIDE 2: Objectives & Competencies
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-900 text-white relative">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                Pedagogical Objectives
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                Target Workplace Communication Goals
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-4">
              {(lesson.situation?.objectives || [
                'Master standard corporate call openings and branding.',
                'Acknowledge client concern with authentic empathy.',
                'Inquire with softened modal constructions.',
                'Execute professional CRM ticket logging.'
              ]).map((obj, i) => (
                <div key={i} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0 border border-indigo-500/40 text-xs">
                    0{i + 1}
                  </div>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>Workplace Standard: Level-1 Technical Service Desk</span>
              <span className="font-mono text-indigo-400">Slide 2: Objectives</span>
            </div>
          </div>
        );

      case 2:
        // SLIDE 3: Key Linguistic Features & Speech Acts
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-950 text-white relative">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                Language Focus & Speech Acts
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                {lesson.learn?.languageFocus?.title || 'Key Linguistic Structures'}
              </h2>
            </div>

            <div className="my-auto py-4 space-y-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
                {lesson.learn?.languageFocus?.explanation || 'Direct imperatives sound aggressive in customer service. Use polite modals (could, would, may) to soften requests and maintain a supportive tone.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-900/50 space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                    Avoid (Blunt / Directive)
                  </span>
                  {(lesson.learn?.languageFocus?.badExamples || [
                    '"Give me your account number."',
                    '"What is your problem?"'
                  ]).slice(0, 3).map((ex, i) => (
                    <p key={i} className="text-xs text-slate-300 font-mono">{ex}</p>
                  ))}
                </div>

                <div className="p-4 bg-teal-950/30 rounded-xl border border-teal-900/50 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Recommended (EOP Standard)
                  </span>
                  {(lesson.learn?.cards?.[0]?.examples || [
                    '"May I please have your account reference?"',
                    '"Could you tell me what error code appears?"'
                  ]).slice(0, 3).map((ex, i) => (
                    <p key={i} className="text-xs text-slate-200 font-mono font-medium">{ex}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>Linguistic Function: Modal Softening & Courtesy Markers</span>
              <span className="font-mono text-amber-400">Slide 3: Speech Acts</span>
            </div>
          </div>
        );

      case 3:
        // SLIDE 4: Authentic Dialogue Simulation
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-900 text-white relative">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
                  Model Dialogue
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                  Customer & Agent Interaction
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">
                Concentrix Benchmark
              </span>
            </div>

            <div className="my-auto py-4 space-y-3 max-w-3xl mx-auto w-full">
              <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-600/40 text-blue-300 font-bold text-xs uppercase shrink-0 mt-0.5">
                  Caller
                </span>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  &ldquo;Hello? I'm trying to process an urgent vendor invoice, but the portal keeps giving me Error 504 and logging me out!&rdquo;
                </p>
              </div>

              <div className="p-3.5 bg-teal-950/40 rounded-xl border border-teal-800/50 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-teal-600 text-white font-bold text-xs uppercase shrink-0 mt-0.5">
                  Agent
                </span>
                <p className="text-xs md:text-sm text-teal-100 leading-relaxed font-medium">
                  &ldquo;Good morning! Thank you for calling Technical Support. My name is Nadia. I am sorry to hear that your invoice portal is logging you out. I would be glad to help you investigate that right away.&rdquo;
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>Discourse Analysis: Salutation &rarr; Identity &rarr; Empathy &rarr; Offer of Assistance</span>
              <span className="font-mono text-teal-400">Slide 4: Dialogue</span>
            </div>
          </div>
        );

      case 4:
        // SLIDE 5: Speaking Challenge & Rubric
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white relative">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">
                Formative Speaking Challenge
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                25-Point Assessment Criteria
              </h2>
            </div>

            <div className="my-auto py-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { title: '1. Task Achievement', desc: 'Addresses customer issue completely' },
                { title: '2. Interactive Comm', desc: 'Maintains conversational turn-taking' },
                { title: '3. Vocabulary', desc: 'Technical support & courtesy lexicon' },
                { title: '4. Grammar', desc: 'Indirect question word order & modals' },
                { title: '5. Pronunciation', desc: 'Fluency, intelligibility, 100–120 wpm' }
              ].map((crit, idx) => (
                <div key={idx} className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-400 block mb-1">
                      Max 5 Pts
                    </span>
                    <h3 className="font-bold text-xs text-white leading-snug">{crit.title}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{crit.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>Thesis Research Instrument: 5 Criteria &times; 5 Bands = 25 Pts Total</span>
              <span className="font-mono text-purple-400">Slide 5: Rubric</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isGoogleMode = slideMode === 'google' && Boolean(lesson.googleSlidesEmbedUrl);

  return (
    <div className="space-y-4">
      {/* 16:9 Presentation Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group"
      >
        {isGoogleMode ? (
          <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center">
            <iframe
              src={lesson.googleSlidesEmbedUrl}
              title={`Lesson ${lessonId} Google Slides Deck`}
              className="w-full h-full border-0"
              allowFullScreen={true}
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            />
          </div>
        ) : (
          renderSlideContent()
        )}

        {/* Local Slide Navigation Overlay Controls (Only in Local Mode) */}
        {!isGoogleMode && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="pointer-events-auto w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg border border-slate-700"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="pointer-events-auto w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg border border-slate-700"
              title="Next Slide (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Top-Right Canvas Bar (Fullscreen & Slide Indicator) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          {isGoogleMode ? (
            <span className="px-2.5 py-1 bg-indigo-950/80 backdrop-blur-sm text-indigo-300 text-xs font-bold rounded-lg border border-indigo-700/80 flex items-center gap-1 shadow">
              <Sparkles className="w-3.5 h-3.5" /> Google Slides Live
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-slate-950/70 backdrop-blur-sm text-white text-xs font-mono font-bold rounded-lg border border-slate-700/80">
              {currentSlide + 1} / {totalSlides}
            </span>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-950/70 hover:bg-slate-900 backdrop-blur-sm text-white rounded-lg border border-slate-700/80 transition-colors shadow"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Presentation"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Notice Bar when using Placeholder Template in Local Mode */}
        {!isGoogleMode && imageError[`${lessonId}_${currentSlide}`] && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between pointer-events-none">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <FolderOpen className="w-3.5 h-3.5" /> Slide Template Active: Drop custom slide images into <code>client/public/slides/lesson{lessonId}/slide_{currentSlide + 1}.png</code>
            </span>
            <span className="text-slate-500 font-mono">16:9 Presentation Format</span>
          </div>
        )}
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Source Mode Switcher (If Google Slides link exists) */}
        {lesson.googleSlidesEmbedUrl ? (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSlideMode('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                slideMode === 'google' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Slides (Live)</span>
            </button>
            <button
              onClick={() => setSlideMode('local')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                slideMode === 'local' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Structured Deck</span>
            </button>
          </div>
        ) : (
          /* Slide Selector Chips in Local Mode */
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-2 uppercase tracking-wider">Slide:</span>
            {[0, 1, 2, 3, 4].map(idx => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentSlide === idx 
                    ? 'bg-blue-600 text-white shadow-sm scale-105' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Local Mode Slide Stepper (when in local mode with Google Slides available) */}
        {slideMode === 'local' && lesson.googleSlidesEmbedUrl && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider">Slide:</span>
            {[0, 1, 2, 3, 4].map(idx => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentSlide === idx 
                    ? 'bg-indigo-600 text-white shadow-sm scale-105' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Center Summary Label */}
        {slideMode === 'local' ? (
          <div className="text-xs font-bold text-slate-700 truncate max-w-xs text-center">
            {currentSlide === 0 && '1. Overview & Workplace Setting'}
            {currentSlide === 1 && '2. Competencies & Objectives'}
            {currentSlide === 2 && '3. Language Functions & Rules'}
            {currentSlide === 3 && '4. Model Dialogue Interaction'}
            {currentSlide === 4 && '5. Spoken Task & Rubric'}
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-medium text-center">
            Embedded Google Slides presentation for Lesson {lessonId}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {lesson.googleSlidesUrl && (
            <a
              href={lesson.googleSlidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 transition-colors"
              title="Open presentation in Google Slides"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              <span>Open in Google Slides</span>
            </a>
          )}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Monitor className="w-3.5 h-3.5" /> Present
          </button>
        </div>
      </div>

      {/* Helpful Hint for Google Slides Sharing */}
      {isGoogleMode && (
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2 leading-relaxed">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Google Slides Integration:</span> The presentation is embedded directly from Google Docs. If the viewer displays a Google Sign-in prompt, ensure in your Google Slides presentation: Click <strong>Share</strong> &rarr; change General Access to <strong>&ldquo;Anyone with the link&rdquo; (Viewer)</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
