
import React, { useState, useEffect, useRef } from 'react';
import { generateEliteTest, generateSpeech, playRawPCM } from '../services/gemini';

interface Question {
  question: string;
  options?: string[];
  answer: string;
  hint?: string;
  explanation: string;
}

const CompetitionInterface: React.FC = () => {
  const [activeType, setActiveType] = useState<'math' | 'spelling'>('math');
  const [difficulty, setDifficulty] = useState('Senior Secondary / High School');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');
  const [isCloud, setIsCloud] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioWaves, setAudioWaves] = useState<number[]>(new Array(16).fill(10));

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      finishTest();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft]);

  // Audio Visualizer effect
  useEffect(() => {
    if (isSpeaking) {
      waveIntervalRef.current = setInterval(() => {
        setAudioWaves(prev => prev.map(() => Math.floor(Math.random() * 80) + 20));
      }, 100);
    } else {
      clearInterval(waveIntervalRef.current);
      setAudioWaves(new Array(16).fill(10));
    }
    return () => clearInterval(waveIntervalRef.current);
  }, [isSpeaking]);

  // Auto-play word when question changes in spelling mode
  useEffect(() => {
    if (activeType === 'spelling' && timerActive && questions.length > 0) {
      handlePlayWord();
    }
  }, [currentIdx, timerActive]);

  const handlePlayWord = async () => {
    if (isSpeaking || activeType !== 'spelling') return;
    const word = questions[currentIdx].answer;
    setIsSpeaking(true);
    try {
      // Direct competition-style synthesis
      const audioData = await generateSpeech(`The word is: ${word}. ${questions[currentIdx].hint || ''}. Repeat: ${word}.`);
      if (audioData) await playRawPCM(audioData);
    } catch (err) {
      console.error("Neural Synthesis Interrupted", err);
    } finally {
      setIsSpeaking(false);
    }
  };

  const startTest = async (forceApi: boolean = false) => {
    setIsGenerating(true);
    setIsFinished(false);
    setIsCloud(forceApi);
    
    try {
      const data = await generateEliteTest(activeType, difficulty, "Global", forceApi);
      if (data && data.length > 0) {
        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(''));
        setCurrentIdx(0);
        setTimeLeft(activeType === 'math' ? 900 : 600);
        setTimerActive(true);
      }
    } catch (err) {
      alert("Neural delay detected. Deploying emergency local data bank.");
      const backup = await generateEliteTest(activeType, difficulty, "Global", false);
      setQuestions(backup);
    } finally {
      setIsGenerating(false);
    }
  };

  const finishTest = () => {
    setTimerActive(false);
    setIsFinished(true);
  };

  const nextQuestion = () => {
    const finalAnswer = activeType === 'spelling' ? spellingInput : userAnswers[currentIdx];
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = finalAnswer;
    setUserAnswers(newAnswers);
    setSpellingInput('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-12 bg-slate-950">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-t-indigo-500 border-indigo-500/20 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-indigo-600/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-[0.4em]">Calibrating Arena</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            {isCloud ? 'SYNCHRONIZING WITH GLOBAL NEURAL CLOUD...' : 'LOCALIZING COMPETITION PARAMETERS...'}
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = questions.reduce((acc, q, i) => (userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim() ? acc + 1 : acc), 0);
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 items-center justify-center overflow-y-auto">
        <div className="max-w-2xl w-full bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-10">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${percent >= 80 ? 'border-emerald-500 text-emerald-500' : 'border-indigo-500 text-indigo-500'} mb-6`}>
              <span className="text-4xl font-black italic">{percent}%</span>
            </div>
            <h2 className="text-4xl font-black text-white italic mb-2 uppercase tracking-tighter">Diagnostic Complete</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Rank: {percent === 100 ? 'Grandmaster' : percent >= 80 ? 'Elite' : 'Aspirant'}</p>
          </div>
          
          <div className="space-y-4 mb-12 max-h-60 overflow-y-auto pr-4 custom-scrollbar text-left">
            {questions.map((q, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <p className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Gate {i+1}</p>
                <p className="text-sm text-slate-400">Your Answer: <span className="font-bold text-white uppercase">{userAnswers[i] || '[NULL]'}</span></p>
                <p className="text-sm text-slate-400">Correct: <span className="font-bold text-indigo-400 uppercase">{q.answer}</span></p>
              </div>
            ))}
          </div>

          <button onClick={() => setIsFinished(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20">Return to Lobby</button>
        </div>
      </div>
    );
  }

  if (timerActive && questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12">
        <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto w-full">
           <div className="flex-1">
             <div className="flex justify-between text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
               <span>Neural Gate {currentIdx + 1} / {questions.length}</span>
               <span>{activeType === 'spelling' ? 'Audio Protocol: Active' : 'Math Logic: Active'}</span>
             </div>
             <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{width: `${((currentIdx + 1) / questions.length) * 100}%`}}></div>
             </div>
           </div>
           <div className="ml-8 text-3xl font-black font-mono text-indigo-400 bg-slate-900/50 px-6 py-2 rounded-xl border border-white/5 shadow-inner">
             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </div>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
           <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

              {activeType === 'spelling' && (
                <div className="flex items-end justify-center gap-1.5 mb-16 h-12">
                  {audioWaves.map((height, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-indigo-500 rounded-full transition-all duration-100 ease-out"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              )}

              {activeType === 'math' ? (
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tight leading-tight">{q.question}</h3>
                </div>
              ) : (
                <div className="text-center mb-16">
                  <button 
                    onClick={handlePlayWord}
                    className="group relative w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mx-auto hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                  >
                    <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" /></svg>
                    {isSpeaking && <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping opacity-50"></div>}
                  </button>
                  <p className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Synthesizing word...</p>
                  {q.hint && <div className="mt-10 px-8 py-4 bg-slate-950/50 rounded-2xl border border-white/5 inline-block">
                    <p className="text-slate-400 italic text-lg leading-relaxed">"{q.hint}"</p>
                  </div>}
                </div>
              )}

              {activeType === 'math' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { const n = [...userAnswers]; n[currentIdx] = opt; setUserAnswers(n); }}
                      className={`text-left px-8 py-6 rounded-3xl border-2 transition-all font-black text-lg ${
                        userAnswers[currentIdx] === opt ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-950/30 border-white/5 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      <span className="mr-6 text-indigo-500 opacity-40">{String.fromCharCode(65 + i)}</span> {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <input
                    autoFocus
                    type="text"
                    value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && nextQuestion()}
                    className="w-full bg-slate-950 border-2 border-white/10 rounded-[2.5rem] px-12 py-8 text-4xl text-white font-black focus:outline-none focus:border-indigo-500 tracking-[0.2em] uppercase text-center shadow-inner"
                    placeholder="ENTER SPELLING"
                  />
                  <div className="flex justify-center gap-2">
                    {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                       <span key={k} className="w-6 h-6 flex items-center justify-center bg-slate-950 border border-white/5 rounded text-[8px] font-black text-slate-700">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-16 flex justify-between items-center border-t border-white/5 pt-10">
                 <button 
                  onClick={() => setIsFinished(true)} 
                  className="text-slate-600 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                 >
                   Terminate Protocol
                 </button>
                 <button onClick={nextQuestion} className="bg-white text-slate-950 font-black px-16 py-6 rounded-3xl shadow-2xl hover:bg-indigo-50 transition-all uppercase tracking-widest text-[10px]">
                   {currentIdx === questions.length - 1 ? 'Finalize Analysis' : 'Next Transmission'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-16 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Neural Competition Suite</p>
          </div>
          <h2 className="text-8xl font-black text-white italic tracking-tighter uppercase leading-none">Elite Arena</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] space-y-10 backdrop-blur-xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block">Cognitive Discipline</label>
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-2 rounded-3xl">
                <button 
                  onClick={() => setActiveType('math')} 
                  className={`py-5 rounded-2xl text-[10px] font-black transition-all flex flex-col items-center gap-2 ${activeType === 'math' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  QUANTITATIVE REASONING
                </button>
                <button 
                  onClick={() => setActiveType('spelling')} 
                  className={`py-5 rounded-2xl text-[10px] font-black transition-all flex flex-col items-center gap-2 ${activeType === 'spelling' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  AUDIO PHONETIC LEXICON
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block">Calibration Level</label>
              <div className="grid grid-cols-2 gap-3">
                {['Primary / Junior School', 'Junior Secondary / Middle School', 'Senior Secondary / High School', 'University / Elite Professional'].map(d => (
                   <button 
                    key={d} 
                    onClick={() => setDifficulty(d)}
                    className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase text-left transition-all ${difficulty === d ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400' : 'border-white/5 text-slate-600 hover:border-white/10'}`}
                   >
                     {d}
                   </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 bg-indigo-600 rounded-[3.5rem] p-12 flex flex-col justify-between shadow-2xl shadow-indigo-600/30 group">
               <div className="space-y-6">
                 <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                   Initialize <br/> Competition Protocol
                 </h3>
                 <p className="text-indigo-100 text-xs font-bold leading-relaxed opacity-80 uppercase tracking-widest">
                   {activeType === 'spelling' 
                     ? 'Pure audio mode. Words are synthesized via neural TTS. Listen, identify etymology, and spell with precision.' 
                     : 'Advanced quantitative logic. Challenges are optimized for competitive exam speed and proof-based reasoning.'}
                 </p>
               </div>
               <button onClick={() => startTest(false)} className="bg-white text-indigo-600 font-black py-6 rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-widest text-[10px] mt-12">Activate Local Module</button>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 flex items-center justify-between">
               <div className="text-left">
                 <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-1">Global Leaderboard</p>
                 <p className="text-xs font-bold text-white uppercase tracking-widest">Cloud Neural Sync</p>
               </div>
               <button onClick={() => startTest(true)} className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] hover:bg-indigo-500/20 transition-all">Request Cloud</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionInterface;
