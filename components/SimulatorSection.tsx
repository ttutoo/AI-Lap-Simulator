
import React, { useState } from 'react';
import { Play, RotateCcw, ShieldAlert, CheckCircle, Terminal, Bot, Activity, Server, ArrowRight, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { simulateHandlerLogic } from '../geminiService';
import { LogEntry, Handler } from '../types';

const SimulatorSection: React.FC = () => {
  const handlers: Handler[] = [
    { id: 'auth', name: 'Authentication', desc: 'Identity & JWT Security' },
    { id: 'ratelimit', name: 'Rate Limiter', desc: 'DDoS & Traffic Control' },
    { id: 'validation', name: 'Payload Validator', desc: 'Data Schema Integrity' },
    { id: 'firewall', name: 'WAF Firewall', desc: 'Malicious Script Filtering' }
  ];

  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenario, setScenario] = useState('Standard GET Request');

  const runSimulation = async () => {
    setLogs([]);
    setIsSimulating(true);
    
    for (let i = 0; i < handlers.length; i++) {
      setActiveStep(i);
      const result = await simulateHandlerLogic(handlers[i].name, scenario);
      
      const newLog: LogEntry = {
        handler: handlers[i].name,
        decision: result.decision,
        reason: result.reason,
        logs: result.logs,
        timestamp: new Date().toLocaleTimeString()
      };

      setLogs(prev => [...prev, newLog]);

      if (result.decision === 'FAIL') {
        setIsSimulating(false);
        return;
      }
      
      await new Promise(r => setTimeout(r, 800)); 
    }
    
    setIsSimulating(false);
    setActiveStep(handlers.length);
  };

  const resetSimulation = () => {
    setActiveStep(-1);
    setLogs([]);
    setIsSimulating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      
      {/* Cột trái: Luồng Pipeline */}
      <div className="lg:col-span-5 space-y-10">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Live Pipeline
             </h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Visualizing Request Chain</p>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={runSimulation} 
                disabled={isSimulating} 
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-3 text-xs font-black px-6 border border-indigo-400/50"
              >
                <Play className="w-4 h-4 fill-current" /> EXECUTE LAB
              </button>
              <button 
                onClick={resetSimulation} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-2xl active:scale-95 transition-all border border-white/5"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="bg-slate-900/60 rounded-[3rem] p-10 lg:p-12 border border-white/5 space-y-12 relative overflow-hidden shadow-inner">
          <div className="absolute left-[67px] top-28 bottom-28 w-[1px] bg-gradient-to-b from-indigo-500/50 via-slate-700 to-transparent"></div>
          
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800 shadow-xl group">
                <Server className="w-6 h-6 group-hover:text-indigo-400 transition-colors" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Entry Point</div>
                <div className="text-sm font-black text-slate-200">{scenario}</div>
             </div>
          </div>

          {handlers.map((h, idx) => (
            <div key={h.id} className="flex items-center gap-6 relative z-10 transition-all duration-500">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 border-2 ${
                activeStep === idx 
                  ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse scale-110 shadow-[0_0_25px_rgba(79,70,229,0.4)]'
                  : logs[idx]?.decision === 'FAIL'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_25px_rgba(225,29,72,0.4)]'
                    : logs[idx]?.decision === 'PASS'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
              }`}>
                {logs[idx]?.decision === 'FAIL' ? <ShieldAlert className="w-6 h-6" /> : 
                 logs[idx]?.decision === 'PASS' ? <CheckCircle className="w-6 h-6" /> : 
                 <span className="text-sm font-black italic">{idx + 1}</span>}
              </div>
              <div className="flex-1">
                 <div className={`font-black text-base tracking-tight ${activeStep === idx ? 'text-indigo-400' : 'text-slate-300'}`}>{h.name}</div>
                 <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black mt-1 opacity-60">{h.desc}</div>
              </div>
              {activeStep === idx && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>}
            </div>
          ))}

          <div className={`flex items-center gap-6 relative z-10 transition-all duration-1000 ${activeStep === handlers.length ? 'opacity-100 translate-x-0' : 'opacity-10 -translate-x-4'}`}>
             <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-7 h-7" />
             </div>
             <div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Final Status</div>
                <div className="text-sm font-black text-white">PIPELINE_RESOLVED_OK</div>
             </div>
          </div>
        </div>

        <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 space-y-6">
           <div className="flex items-center gap-2">
             <Code2 className="w-4 h-4 text-indigo-400" />
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Attack Scenario</label>
           </div>
           <div className="relative group">
             <select 
               value={scenario}
               onChange={(e) => setScenario(e.target.value)}
               disabled={isSimulating}
               className="w-full bg-slate-950 border border-white/10 text-slate-200 text-sm rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer transition-all hover:bg-slate-900 disabled:opacity-50 font-bold"
             >
               <option value="Standard GET Request">Safe: Standard Request</option>
               <option value="Expired JWT Token Auth Attempt">Fail: Expired JWT Token</option>
               <option value="DDoS Burst - 50k requests/sec">Fail: DDoS Traffic Burst</option>
               <option value="Malformed JSON with Missing Schema">Fail: Malformed Schema</option>
               <option value="SQL Injection Attempt 'OR 1=1' --">Fail: SQL Injection Pattern</option>
             </select>
             <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
               <ArrowRight className="w-4 h-4 rotate-90" />
             </div>
           </div>
        </div>
      </div>

      {/* Cột phải: Terminal */}
      <div className="lg:col-span-7 flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between mb-6">
           <div className="space-y-1">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Intelligence Console
             </h3>
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Deciphering AI Logic</p>
           </div>
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
           </div>
        </div>

        <div className="bg-slate-950 rounded-[3rem] border border-white/10 flex-1 overflow-hidden flex flex-col shadow-2xl relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          
          <div className="flex-1 p-8 lg:p-12 overflow-y-auto font-mono text-xs space-y-10 scrollbar-hide relative z-10">
            {logs.length === 0 && !isSimulating && (
              <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-6 animate-pulse">
                <Bot className="w-24 h-24 stroke-[0.5]" />
                <div className="text-center space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black text-slate-700">Listening for Pipeline signals...</p>
                  <p className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">Select a scenario to begin deep analysis</p>
                </div>
              </div>
            )}

            {logs.map((log, i) => (
              <div key={i} className="animate-in slide-in-from-bottom-4 duration-700 border-l border-indigo-500/30 pl-10 relative">
                <div className={`absolute left-[-4.5px] top-3 w-2 h-2 rounded-full border border-slate-950 ${log.decision === 'PASS' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]'}`}></div>
                
                <div className="flex items-center gap-4 mb-4">
                   <span className="text-[9px] text-slate-600 font-black tracking-tighter">[{log.timestamp}]</span>
                   <span className="text-indigo-500 font-black uppercase tracking-widest text-[11px]">{log.handler}</span>
                   <span className={`text-[8px] px-3 py-1 rounded-md font-black tracking-[0.2em] border ${log.decision === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                     {log.decision}_EXECUTED
                   </span>
                </div>

                <div className="bg-[#0a0f1e] p-8 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
                   <div className="text-slate-300 font-sans leading-relaxed text-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-3 h-3 text-indigo-400" />
                        <span className="text-indigo-400/80 text-[10px] font-black uppercase tracking-[0.2em]">Neural Engine Insight:</span>
                      </div>
                      <span className="text-slate-300 italic opacity-90 leading-loose">"{log.reason}"</span>
                   </div>
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[9px] text-slate-500 flex items-center gap-2 font-bold tracking-widest uppercase">
                         Log Hash: <span className="text-indigo-400/60 font-mono">{Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                      </div>
                      <div className="text-[9px] text-slate-600 font-black uppercase">
                        Code: <span className="text-indigo-500">{log.logs}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}

            {isSimulating && (
              <div className="flex items-center gap-4 text-indigo-400 py-10 pl-10">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60">AI is deep-scanning protocol layers...</span>
              </div>
            )}

            {activeStep === handlers.length && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[2.5rem] text-emerald-400 animate-in zoom-in-95 duration-700 mx-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.3em]">PIPELINE_STABLE</h4>
                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Transmission Successful</p>
                  </div>
                </div>
                <p className="text-xs font-sans opacity-80 leading-relaxed font-medium">
                  Yêu cầu an toàn đã vượt qua toàn bộ chuỗi Handler thành công. Không phát hiện dấu hiệu bất thường. Dữ liệu hiện đang được xử lý bởi Business Controller.
                </p>
              </div>
            )}
            
            {logs.some(l => l.decision === 'FAIL') && (
              <div className="bg-rose-500/5 border border-rose-500/20 p-10 rounded-[2.5rem] text-rose-400 animate-in zoom-in-95 duration-700 mx-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-rose-500 p-2 rounded-xl text-slate-950">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.3em]">SHORT_CIRCUIT_TRIPPED</h4>
                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Unauthorized Activity Detected</p>
                  </div>
                </div>
                <p className="text-xs font-sans opacity-80 leading-relaxed font-medium">
                  Hệ thống AI đã phát hiện mối đe dọa. Handler Pattern đã thực thi ngắt chuỗi ngay lập tức để cô lập yêu cầu độc hại, bảo toàn tính vẹn toàn của cơ sở dữ liệu.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorSection;

