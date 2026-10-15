import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Download, Monitor, Sparkles, BookOpen, CheckCircle, 
  MessageSquare, AlertCircle, FileText, FolderOpen, Image
} from 'lucide-react';
import { LESSONS_DATA } from '../data/lessonsData';

export default function LessonSlideViewer({ lessonId = 1 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState({});
  const containerRef = useRef(null);

  const lesson = LESSONS_DATA[lessonId] || LESSONS_DATA[1];

  // Reset slide index when lesson changes
  useEffect(() => {
    setCurrentSlide(0);
    setImageError({});
  }, [lessonId]);

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

  // Keyboard navigation (Left / Right arrow)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

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
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/30 inline-block">
                Workplace Role: {lesson.situation?.role || 'Technical Support Agent'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {lesson.title}
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">
                {lesson.focus}
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 z-10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                Scenario Context: {lesson.situation?.intro?.substring(0, 100)}...
              </span>
              <span className="text-teal-400 font-mono font-bold shrink-0 ml-4">Duration: {lesson.duration}</span>
            </div>
          </div>
        );

      case 1:
        // SLIDE 2: Objectives & Speech Acts
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-900 text-white">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-teal-400 uppercase">Learning Objectives</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Target Competencies & Speech Acts</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Slide 2 of {totalSlides}</span>
            </div>

            <div className="my-auto py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.situation?.objectives?.map((obj, i) => (
                <div key={i} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium text-slate-200 leading-snug">{obj}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-950/60 border border-blue-800/50 rounded-xl text-xs text-blue-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Assessment Alignment: Each objective corresponds directly to the 25-point analytic speaking rubric.</span>
            </div>
          </div>
        );

      case 2:
        // SLIDE 3: Language Focus & Grammatical Patterns
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-900 text-white">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">Language Functions & Formulae</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{lesson.learn?.languageFocus?.title || 'Speech Acts'}</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Slide 3 of {totalSlides}</span>
            </div>

            <div className="my-auto py-4 space-y-4">
              <p className="text-sm text-slate-300 font-medium">
                {lesson.learn?.languageFocus?.explanation || 'Direct grammatical structures for technical support communication.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-950/40 rounded-xl border border-rose-800/40 space-y-2">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>x</span> Avoid / Ineffective Phrasing:
                  </p>
                  <ul className="text-xs text-rose-200 space-y-1.5 pl-2">
                    {lesson.learn?.languageFocus?.badExamples?.slice(0, 3).map((ex, i) => (
                      <li key={i} className="italic">{ex}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/40 space-y-2">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✓</span> Professional Workplace Standard:
                  </p>
                  <ul className="text-xs text-emerald-200 space-y-1.5 pl-2">
                    {lesson.learn?.languageFocus?.goodExamples?.slice(0, 3).map((ex, i) => (
                      <li key={i} className="font-semibold">{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Key Grammar Act: Modal softening, imperatives, polite conditionals, problem triage.
            </div>
          </div>
        );

      case 3:
        // SLIDE 4: Model Workplace Dialogue
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-900 text-white">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">Authentic Case Model</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{lesson.learn?.modelDialogue?.title || 'Agent-Client Model Interaction'}</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Slide 4 of {totalSlides}</span>
            </div>

            <div className="my-auto py-3 space-y-2.5 overflow-y-auto max-h-[300px] pr-2">
              {lesson.learn?.modelDialogue?.lines?.slice(0, 4).map((line, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    line.speaker.startsWith('Agent') 
                      ? 'bg-blue-950/60 border-blue-700/60 ml-6' 
                      : 'bg-slate-800/70 border-slate-700/70 mr-6'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold ${line.speaker.startsWith('Agent') ? 'text-blue-300' : 'text-slate-300'}`}>
                      {line.speaker}
                    </span>
                    {line.purpose && (
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-mono">
                        {line.purpose}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200">{line.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300">
              Notice: The agent maintains professional composure, clarifies symptoms, and verifies user permission before executing SOP instructions.
            </div>
          </div>
        );

      case 4:
        // SLIDE 5: Speaking Task & Performance Rubric
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between bg-slate-900 text-white">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-teal-400 uppercase">Spoken Simulation & Assessment</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Helpdesk Ticket Practice & Criteria</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Slide 5 of {totalSlides}</span>
            </div>

            <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase">Task Requirement:</span>
                <h4 className="text-sm font-bold text-white">{lesson.speaking?.scenario || 'Handle the incoming customer enquiry'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Listen to the client's voice message, inspect the CRM ticket details, and record your single-take spoken response.
                </p>
              </div>

              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase">25-Point Evaluation Rubric:</span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  <li>Task Achievement (5 pts)</li>
                  <li>Interactive Communication (5 pts)</li>
                  <li>Technical Vocabulary (5 pts)</li>
                  <li>Grammar & Accuracy (5 pts)</li>
                  <li>Pronunciation & Fluency (5 pts)</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-teal-950/60 border border-teal-800/60 rounded-xl text-xs text-teal-200 flex items-center justify-between">
              <span>Ready to practice? Advance to Section 3 (Learn & Practice) to master these target patterns!</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in" ref={containerRef}>
      {/* Slide Presentation Canvas (16:9 Aspect Ratio) */}
      <div className="w-full aspect-[16/9] max-h-[560px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group">
        {renderSlideContent()}

        {/* Slide Navigation Overlay Controls */}
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

        {/* Top-Right Canvas Bar (Fullscreen & Slide Indicator) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <span className="px-2.5 py-1 bg-slate-950/70 backdrop-blur-sm text-white text-xs font-mono font-bold rounded-lg border border-slate-700/80">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-950/70 hover:bg-slate-900 backdrop-blur-sm text-white rounded-lg border border-slate-700/80 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Presentation"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Notice Bar when using Placeholder Template */}
        {imageError[`${lessonId}_${currentSlide}`] && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between pointer-events-none">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <FolderOpen className="w-3.5 h-3.5" /> Slide Template Active: Drop custom slide images into <code>client/public/slides/lesson{lessonId}/slide_{currentSlide + 1}.png</code>
            </span>
            <span className="text-slate-500 font-mono">16:9 Presentation Format</span>
          </div>
        )}
      </div>

      {/* Control & Thumbnail Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Slide Selector Chips */}
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

        {/* Slide Titles Summary */}
        <div className="text-xs font-bold text-slate-700 truncate max-w-xs text-center">
          {currentSlide === 0 && '1. Overview & Workplace Setting'}
          {currentSlide === 1 && '2. Competencies & Objectives'}
          {currentSlide === 2 && '3. Language Functions & Rules'}
          {currentSlide === 3 && '4. Model Dialogue Interaction'}
          {currentSlide === 4 && '5. Spoken Task & Rubric'}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`/slides/lesson${lessonId}/slides.pdf`}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
            title="Download Slide Deck PDF if provided"
          >
            <Download className="w-3.5 h-3.5" /> PDF Slides
          </a>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Monitor className="w-3.5 h-3.5" /> Present
          </button>
        </div>
      </div>
    </div>
  );
}
