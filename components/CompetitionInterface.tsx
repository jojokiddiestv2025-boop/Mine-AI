
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

  // Audio Visualizer effect - more dramatic for competition feel
  useEffect(() => {
    if (isSpeaking) {
      waveIntervalRef.current = setInterval(() => {
        setAudioWaves(prev => prev.map(() => Math.floor(Math.random() * 90) + 10));
      }, 80);
    } else {
      clearInterval(waveIntervalRef.current);
      setAudioWaves(new Array(16).fill(10));
    }
    return () => clearInterval(waveIntervalRef.current);
  }, [isSpeaking]);

  // Auto-play word when question changes in spelling mode
  useEffect(() => {
    if (activeType === 'spelling' && timerActive && questions.length > 0) {
      const timer = setTimeout(() => handlePlayWord(), 500); // Small delay for UI transition
      return () => clearTimeout(timer);
    }
  }, [currentIdx, timerActive, activeType]);

  const handlePlayWord = async () => {
    if (isSpeaking || activeType !== 'spelling') return;
    const word = questions[currentIdx].answer;
    setIsSpeaking(true);
    try {
      // Professional announcer style
      const audioData = await generateSpeech(`Word number ${currentIdx + 1}. The word is: ${word}. ${questions[currentIdx].hint || ''}. Spell: ${word}.`);
      if (audioData) await playRawPCM(audioData);
    } catch (err) {
      console.error("Neural Voice Transmission Error", err);
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
      alert("Cloud sync interrupted. Accessing local encrypted cache.");
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
          <div className="w-32 h-32 border-4 border-t-indigo-500 border-indigo-500/10 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 bg-indigo-600/30 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-[0.4em]">Calibrating</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse mt-4">
            {isCloud ? 'Establishing high-bandwidth cloud link...' : 'Verifying local integrity...'}
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = questions.reduce((acc, q, i) => (userAnswers[i].toLowerCase().trim() === q.answer.toLowerCase().trim() ? acc + 1 : acc), 0);
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-900/40 border border-white/5 rounded-[3.5rem] p-16 text-center shadow-2xl backdrop-blur-3xl">
          <div className="mb-12">
            <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full border-8 ${percent >= 80 ? 'border-emerald-500 text-emerald-500' : 'border-indigo-600 text-indigo-400'} mb-8 shadow-2xl`}>
              <span className="text-5xl font-black italic">{percent}%</span>
            </div>
            <h2 className="text-5xl font-black text-white italic mb-2 uppercase tracking-tighter leading-none">Result Finalized</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-4">Neural Standing: {percent === 100 ? 'Grandmaster' : percent >= 80 ? 'Champion' : 'Aspirant'}</p>
          </div>
          <button onClick={() => setIsFinished(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-3xl transition-all uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 active:scale-95">Return to Hub</button>
        </div>
      </div>
    );
  }

  if (timerActive && questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16 max-w-5xl mx-auto w-full">
           <div className="flex-1">
             <div className="flex justify-between text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-3">
               <span>Gate {currentIdx + 1} of {questions.length}</span>
               <span>{activeType === 'spelling' ? 'Audio Encryption: ON' : 'Math Logic: ACTIVE'}</span>
             </div>
             <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-1000" style={{width: `${((currentIdx + 1) / questions.length) * 100}%`}}></div>
             </div>
           </div>
           <div className="ml-12 text-4xl font-black font-mono text-indigo-400 bg-slate-900/40 px-8 py-3 rounded-2xl border border-white/5">
             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </div>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full mb-20">
           <div className="bg-slate-900/50 border border-white/5 rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[120px] rounded-full -mr-40 -mt-40"></div>

              {activeType === 'spelling' && (
                <div className="flex items-end justify-center gap-2 mb-16 h-16">
                  {audioWaves.map((height, i) => (
                    <div 
                      key={i} 
                      className="w-2 bg-indigo-500 rounded-full transition-all duration-100"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              )}

              {activeType === 'math' ? (
                <div className="text-center mb-16">
                  <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight">{q.question}</h3>
                </div>
              ) : (
                <div className="text-center mb-16">
                  <button 
                    onClick={handlePlayWord}
                    className="group relative w-36 h-36 bg-indigo-600 rounded-full flex items-center justify-center mx-auto hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                  >
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" /></svg>
                    {isSpeaking && <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping opacity-60"></div>}
                  </button>
                  <p className="mt-8 text-slate-500 text-[11px] font-black uppercase tracking-[0.5em]">Neural Voice Synthesizer</p>
                  {q.hint && <div className="mt-12 px-10 py-5 bg-slate-950/40 rounded-3xl border border-white/5 inline-block max-w-xl">
                    <p className="text-slate-400 italic text-xl">"{q.hint}"</p>
                  </div>}
                </div>
              )}

              {activeType === 'math' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { const n = [...userAnswers]; n[currentIdx] = opt; setUserAnswers(n); }}
                      className={`text-left px-8 py-7 rounded-[2rem] border-2 transition-all font-black text-xl ${
                        userAnswers[currentIdx] === opt ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl shadow-indigo-600/20' : 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      <span className="mr-6 text-indigo-500 opacity-30">{String.fromCharCode(65 + i)}</span> {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="max-w-xl mx-auto space-y-8">
                  <input
                    autoFocus
                    type="text"
                    value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && nextQuestion()}
                    className="w-full bg-slate-950 border-2 border-white/10 rounded-[3rem] px-12 py-8 text-5xl text-white font-black focus:outline-none focus:border-indigo-500 tracking-[0.2em] uppercase text-center shadow-inner"
                    placeholder="ENTER..."
                  />
                  <div className="flex justify-center gap-3">
                    {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                       <span key={k} className="w-8 h-8 flex items-center justify-center bg-slate-950/50 border border-white/5 rounded-lg text-[10px] font-black text-slate-700">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-20 flex justify-between items-center border-t border-white/5 pt-12">
                 <button 
                  onClick={() => setIsFinished(true)} 
                  className="text-slate-600 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.4em] transition-colors"
                 >
                   Terminate protocol
                 </button>
                 <button onClick={nextQuestion} className="bg-white text-slate-950 font-black px-16 py-6 rounded-[2rem] shadow-2xl hover:bg-indigo-50 transition-all uppercase tracking-widest text-xs active:scale-95">
                   {currentIdx === questions.length - 1 ? 'Diagnostic Finish' : 'Next Transmission'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-16 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto w-full space-y-20 pb-20">
        <div className="text-center space-y-8">
          <div className="inline-block px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
             <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em]">Championship protocol</p>
          </div>
          <h2 className="text-9xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">Elite Arena</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 bg-slate-900/30 border border-white/5 p-12 rounded-[4rem] space-y-12 backdrop-blur-3xl">
            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] block">Cognitive Module</label>
              <div className="grid grid-cols-2 gap-6 bg-slate-950/50 p-3 rounded-[2.5rem] border border-white/5">
                <button 
                  onClick={() => setActiveType('math')} 
                  className={`py-6 rounded-[2rem] text-[11px] font-black transition-all flex flex-col items-center gap-4 ${activeType === 'math' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  MATH LOGIC
                </button>
                <button 
                  onClick={() => setActiveType('spelling')} 
                  className={`py-6 rounded-[2rem] text-[11px] font-black transition-all flex flex-col items-center gap-4 ${activeType === 'spelling' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  AUDIO SPELLING
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] block">Calibrated Grade</label>
              <div className="grid grid-cols-2 gap-4">
                {['Primary / Junior School', 'Junior Secondary / Middle School', 'Senior Secondary / High School', 'University / Elite Professional'].map(d => (
                   <button 
                    key={d} 
                    onClick={() => setDifficulty(d)}
                    className={`px-8 py-5 rounded-3xl border text-[11px] font-black uppercase text-left transition-all ${difficulty === d ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-slate-600 hover:border-white/10 hover:bg-white/5'}`}
                   >
                     {d}
                   </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex-1 bg-indigo-600 rounded-[4rem] p-12 flex flex-col justify-between shadow-2xl shadow-indigo-600/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700"></div>
               <div className="space-y-8 relative z-10">
                 <div className="w-20 h-20 bg-white/20 rounded-[2.5rem] flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-700 border border-white/10">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                   Start <br/> Championship
                 </h3>
                 <p className="text-indigo-100 text-[13px] font-bold leading-relaxed opacity-80 uppercase tracking-widest">
                   {activeType === 'spelling' 
                     ? 'Strict audio transmission. The AI synthesizes the target word. Listen carefully and spell without visual aid.' 
                     : 'Advanced quantitative logic engine. Problems optimized for competitive speed and logical precision.'}
                 </p>
               </div>
               <button onClick={() => startTest(false)} className="bg-white text-indigo-600 font-black py-7 rounded-[2.5rem] shadow-2xl hover:scale-[1.03] transition-all uppercase tracking-widest text-[11px] mt-12 active:scale-95">Initialize Module</button>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 flex items-center justify-between">
               <div>
                 <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.6em] mb-2">Neural Network Sync</p>
                 <p className="text-sm font-bold text-white uppercase tracking-[0.2em]">Global Leaderboard</p>
               </div>
               <button onClick={() => startTest(true)} className="px-8 py-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] hover:bg-indigo-500/20 transition-all">Request Cloud</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionInterface;
