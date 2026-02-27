'use client';

import { useState, useEffect, useRef } from 'react';
import { allowedEmails as defaultAllowedEmails, vibeCodingQuestions } from './data';

export default function Page() {
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [assignedQuestion, setAssignedQuestion] = useState('');
  const [userName, setUserName] = useState('');
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 hours in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [allowedEmails] = useState<{email_id: string, name?: string}[]>(defaultAllowedEmails.map(e => ({email_id: e})));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
            }, 3000); // Play for 3 seconds
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const userRecordIndex = allowedEmails.findIndex(record => record.email_id.toLowerCase() === email.toLowerCase());
    
    if (userRecordIndex !== -1) {
      const userRecord = allowedEmails[userRecordIndex];
      setIsAuthenticated(true);
      setUserName(userRecord.name || email.split('@')[0]);
      // Deterministically assign a question based on email index to ensure uniqueness per user
      const questionIndex = userRecordIndex % vibeCodingQuestions.length;
      setAssignedQuestion(vibeCodingQuestions[questionIndex]);
    } else {
      setError('Email not found in the allowed list.');
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-noise mix-blend-multiply"></div>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] organic-blob -translate-x-1/2 -translate-y-1/4 z-0"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] organic-blob-2 translate-x-1/4 translate-y-1/4 z-0"></div>
      
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden z-10">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between px-6 py-6 md:px-20">
            <div className="flex items-center gap-3 select-none"></div>
            <button className="font-bold text-secondary hover:text-primary transition-colors"><br /></button>
          </header>
          
          <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 md:py-16">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center text-center gap-6 mb-20 relative">
                <div className="absolute -top-10 right-[10%] text-accent animate-pulse hidden md:block">
                  <svg fill="currentColor" height="40" viewBox="0 0 24 24" width="40"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"></path></svg>
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm border border-secondary/10 text-secondary font-bold text-sm transform hover:scale-105 transition-transform cursor-default">
                  <span className="material-symbols-outlined text-primary text-lg">wb_sunny</span>
                  <span className="font-hand text-lg">Well Hello there!</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight max-w-4xl text-secondary">
                  Reclaim your focus with <br className="hidden md:block" />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 text-primary font-hand transform -rotate-2 inline-block">soulful productivity</span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-accent/30 -z-0 transform -rotate-1 rounded-full"></span>
                  </span>
                </h1>
                <p className="text-slate-600 text-xl max-w-xl leading-relaxed">
                  Escape the mindless scroll. Get one hand-picked, creative task, design it and make it a reality.<br />Well thats what you are here for !!
                </p>
                
                <form onSubmit={handleLogin} className="w-full max-w-xl mt-6 relative z-20">
                  <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50"></div>
                    <div className="flex items-center flex-1 px-4 py-2">
                      <span className="material-symbols-outlined text-secondary/40 mr-3">mail</span>
                      <input 
                        className="w-full border-none bg-transparent focus:ring-0 text-secondary placeholder:text-slate-400 font-medium outline-none" 
                        placeholder="Enter your email address..." 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:shadow-xl hover:-translate-y-0.5">
                      <span>Join the Magic</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                  {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-12 relative">
                <svg className="absolute top-0 left-0 -ml-12 mt-20 hidden lg:block text-primary/20" fill="none" height="200" viewBox="0 0 100 200" width="100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 0 C20 50 80 100 50 150 C30 180 60 190 80 200" stroke="currentColor" strokeDasharray="5 5" strokeWidth="2"></path>
                </svg>
                
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-secondary">Your quest</h2>
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-secondary/10">
                      <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Ends In</span>
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full border-2 border-secondary/20 flex items-center justify-center bg-paper">
                          <div className="absolute w-0.5 h-3 bg-primary bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom rotate-[45deg]"></div>
                          <div className="absolute w-0.5 h-2 bg-secondary bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom rotate-[180deg]"></div>
                        </div>
                        <div className="font-mono font-bold text-secondary text-lg">
                          {formatTime(timeLeft).split(':').map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && <span className="mx-0.5 animate-pulse text-primary">:</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group mt-4">
                    <div className="absolute top-4 left-4 w-full h-full bg-secondary rounded-3xl opacity-5 group-hover:top-6 group-hover:left-6 transition-all duration-300"></div>
                    <div className="absolute top-4 left-4 w-full h-full bg-primary rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-300 blur-xl"></div>
                    <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-secondary/5 min-h-[380px] flex flex-col justify-center overflow-hidden hand-drawn-border bg-paper-texture">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 mix-blend-multiply"></div>
                      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 w-32 h-8 bg-primary/20 rotate-1 backdrop-blur-sm transform skew-x-12 opacity-50"></div>
                      
                      <div className="relative z-10 space-y-8 text-center max-w-3xl mx-auto">
                        <div className="inline-block">
                          <span className="text-primary font-hand text-xl font-bold tracking-wider -rotate-2 inline-block">
                            Here is your quest, {userName}
                          </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold leading-[1.1] text-secondary">
                          {assignedQuestion}
                        </h3>
                        <div className="h-px w-24 bg-secondary/10 mx-auto my-6"></div>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed">
                          Don&apos;t overthink. Grab a warm cup of tea, open a fresh page. Use the energy you gained from class to let AI do the work.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                          <button 
                            onClick={() => setIsCompleted(true)}
                            className={`font-bold text-lg py-4 px-10 rounded-2xl transition-all flex items-center gap-2 group/btn ${
                              isCompleted 
                                ? 'bg-green-500 text-white shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px]' 
                                : 'bg-primary hover:bg-orange-500 text-white shadow-[0_6px_0_rgb(180,83,9)] hover:shadow-[0_3px_0_rgb(180,83,9)] hover:translate-y-[3px]'
                            }`}
                          >
                            <span className="material-symbols-outlined group-hover/btn:animate-bounce">check_circle</span>
                            <span>{isCompleted ? 'Completed!' : "I've Completed This"}</span>
                          </button>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/5 border border-secondary/5 text-secondary/60 text-sm font-medium">
                            <span className="material-symbols-outlined text-base">lock</span>
                            <span>Private & Secure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div id="rules" className="mt-24 mb-16 relative">
              <div className="absolute -top-12 -right-8 text-accent opacity-60 hidden lg:block rotate-12">
                <svg fill="currentColor" height="64" viewBox="0 0 24 24" width="64"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"></path></svg>
              </div>
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-secondary/5 relative overflow-hidden bg-paper-texture max-w-4xl mx-auto">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary opacity-30"></div>
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 text-primary font-hand text-xl font-bold">
                      <span className="material-symbols-outlined">stars</span>
                      <span>Our Ethos</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary">Rules of the contest</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">The rules for this event are simple: Never type a line of code, let the AI do it!</p>
                  </div>
                  
                  <div className="flex-1 w-full bg-paper rounded-2xl p-6 border border-secondary/5">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-lg">spa</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-secondary text-lg">Beware of the tokens</h4>
                          <p className="text-slate-500 font-hand text-lg mt-1">The more mistakes you make in your command, the more tokens the AI uses to correct it⚠️</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-lg">palette</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-secondary text-lg">You are the manager</h4>
                          <p className="text-slate-500 font-hand text-lg mt-1">Let AI do the work, you are the master not AI✌️</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-secondary text-lg">Finalise before you go home</h4>
                          <p className="text-slate-500 font-hand text-lg mt-1">You came here for something! Finish it before you go.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          <footer className="bg-white border-t border-secondary/5 py-12 relative z-10">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-[10px]">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                </div>
                <span className="font-hand font-bold text-lg text-secondary">Vibe Coding</span>
              </div>
              <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-wider">
                <a className="hover:text-primary transition-colors" href="#rules">Rules & Regulations</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
