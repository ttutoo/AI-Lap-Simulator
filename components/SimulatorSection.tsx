
import React, { useState } from 'react';
import { Play, RotateCcw, ShieldAlert, CheckCircle, Terminal, Bot, Info, Activity } from 'lucide-react';
import { simulateHandlerLogic } from '../geminiService';

interface LogEntry {
  handler: string;
  decision: 'PASS' | 'FAIL';
  reason: string;
  logs: string;
}

const SimulatorSection: React.FC = () => {
  const handlers = [
    { id: 'auth', name: 'Authentication', desc: 'Xác minh danh tính người dùng (JWT/API Key)' },
    { id: 'ratelimit', name: 'Rate Limiter', desc: 'Kiểm soát số lượng yêu cầu trong 1 giây' },
    { id: 'validation', name: 'Payload Validator', desc: 'Kiểm tra cấu trúc và kiểu dữ liệu JSON' },
    { id: 'firewall', name: 'WAF Firewall', desc: 'Lọc các chuỗi độc hại (SQLi, XSS, Script)' }
  ];

  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [requestType, setRequestType] = useState('Standard GET Request');

  const startSimulation = async () => {
    setLogs([]);
    setIsSimulating(true);
    
    for (let i = 0; i < handlers.length; i++) {
      setActiveStep(i);
      
      const result = await simulateHandlerLogic(handlers[i].name, requestType);
      
      const newLog: LogEntry = {
        handler: handlers[i].name,
        decision: result.decision,
        reason: result.reason,
        logs: result.logs
      };

      setLogs(prev => [...prev, newLog]);

      if (result.decision === 'FAIL') {
        setIsSimulating(false);
        return;
      }
      
      await new Promise(r => setTimeout(r, 1000)); // Delay để khán giả kịp quan sát
    }
    
    setIsSimulating(false);
    setActiveStep(handlers.length);
  };

  const reset = () => {
    setActiveStep(-1);
    setLogs([]);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">5. AI Lab: Request Pipeline Simulator</h2>
          <p className="text-slate-500 text-sm">Trực quan hóa nguyên tắc "Phòng thủ chiều sâu" của Handler Pattern.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={startSimulation}
             disabled={isSimulating}
             className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95 font-medium"
           >
             <Play className="w-4 h-4" /> Chạy luồng xử lý
           </button>
           <button 
             onClick={reset}
             className="flex items-center gap-2 bg-white text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-medium"
           >
             <RotateCcw className="w-4 h-4" /> Làm mới
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Pipeline */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 h-full relative overflow-hidden shadow-sm">
            <h3 className="font-bold text-slate-400 mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] relative z-10">
               {/* Added missing Activity import from lucide-react */}
               <Activity className="w-4 h-4 text-indigo-500" /> Pipeline Visualization
            </h3>
            
            <div className="flex flex-col gap-8 relative z-10">
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-100 z-0"></div>

              {handlers.map((h, idx) => (
                <div key={h.id} className="flex items-start gap-5 z-10 group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 shadow-sm shrink-0 ${
                    activeStep === idx 
                      ? 'bg-indigo-600 text-white border-indigo-100 animate-pulse scale-110'
                      : logs[idx]?.decision === 'FAIL'
                        ? 'bg-rose-500 text-white border-rose-100'
                        : logs[idx]?.decision === 'PASS'
                          ? 'bg-emerald-500 text-white border-emerald-100'
                          : 'bg-white text-slate-300 border-slate-50'
                  }`}>
                    {logs[idx]?.decision === 'FAIL' ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : logs[idx]?.decision === 'PASS' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-bold text-sm">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col pt-1">
                    <h4 className={`font-bold text-sm transition-colors ${activeStep === idx ? 'text-indigo-600' : 'text-slate-700'}`}>{h.name}</h4>
                    <p className="text-[10px] text-slate-400 italic mt-0.5">{h.desc}</p>
                  </div>
                </div>
              ))}

              <div className={`flex items-center gap-5 z-10 transition-all duration-700 ${activeStep === handlers.length ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}>
                 <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-emerald-200 shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-emerald-700 uppercase tracking-tighter">Request Accepted</h4>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">Success Destination</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Console / Log Analyzer */}
        <div className="lg:col-span-7">
           <div className="bg-slate-900 rounded-3xl overflow-hidden flex flex-col h-[580px] shadow-2xl border border-slate-800">
              <div className="bg-slate-800/80 px-6 py-4 flex items-center justify-between border-b border-slate-700/50 backdrop-blur-md">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></div>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 font-bold tracking-widest uppercase">
                    <Terminal className="w-3 h-3" /> Security_Agent.log
                 </div>
              </div>

              <div className="p-6 overflow-y-auto font-mono text-[11px] flex-1 space-y-6">
                 <div className="flex items-center gap-2 text-indigo-400/60 text-[10px]">
                    <Info className="w-3 h-3" /> 
                    <span>INITIALIZING HANDLER CHAIN PIPELINE...</span>
                 </div>
                 
                 {logs.map((log, i) => (
                   <div key={i} className="animate-in slide-in-from-left-4 duration-500 border-l border-slate-800 pl-6 py-1 relative">
                      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-indigo-500/40"></div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-slate-600 text-[9px] font-bold">[{new Date().toLocaleTimeString()}]</span>
                        <span className="text-indigo-400 font-black uppercase tracking-tighter">{log.handler}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${log.decision === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {log.decision}
                        </span>
                      </div>
                      <div className="space-y-2">
                         <div className="text-slate-300 leading-relaxed font-sans text-[13px] bg-slate-800/30 p-4 rounded-2xl border border-white/5 shadow-inner">
                           <span className="text-indigo-300/60 font-bold block text-[10px] uppercase mb-1">AI Decision Reason:</span>
                           {log.reason}
                         </div>
                         <div className="text-slate-600 text-[9px] italic flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                            <Bot className="w-3 h-3" /> System Logs: {log.logs}
                         </div>
                      </div>
                   </div>
                 ))}

                 {activeStep === handlers.length && (
                   <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 text-emerald-300 mt-6 animate-in zoom-in duration-700">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest mb-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" /> HÀNH TRÌNH HOÀN TẤT
                      </div>
                      <p className="font-sans text-xs opacity-80 leading-relaxed">Request đã vượt qua tất cả các lớp bảo mật thành công. Dữ liệu hiện đang được xử lý bởi Business Controller.</p>
                   </div>
                 )}

                 {logs.some(l => l.decision === 'FAIL') && (
                   <div className="bg-rose-500/5 p-6 rounded-2xl border border-rose-500/20 text-rose-300 mt-6 animate-in zoom-in duration-700">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest mb-2 text-rose-400">
                        <ShieldAlert className="w-4 h-4" /> CẢNH BÁO AN NINH
                      </div>
                      <p className="font-sans text-xs opacity-80 leading-relaxed">Phát hiện hành vi không hợp lệ. Chuỗi xử lý đã được ngắt tự động để bảo vệ tài nguyên hệ thống (Short-circuiting).</p>
                   </div>
                 )}

                 {isSimulating && (
                   <div className="flex items-center gap-3 text-indigo-400/80 mt-6">
                      <div className="flex gap-1 animate-bounce">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                        <div className="w-1 h-1 bg-indigo-500 rounded-full delay-75"></div>
                        <div className="w-1 h-1 bg-indigo-500 rounded-full delay-150"></div>
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-black">Gemini AI Engine Analyzing...</span>
                   </div>
                 )}
              </div>
              
              <div className="p-6 bg-slate-950/50 border-t border-slate-800 backdrop-blur-xl">
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Chọn loại yêu cầu thử nghiệm:</label>
                    <div className="flex items-center gap-4">
                        <span className="text-indigo-500 font-black text-lg">$</span>
                        <select 
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        disabled={isSimulating}
                        className="bg-slate-900 text-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-full cursor-pointer py-3.5 px-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all appearance-none font-sans shadow-inner"
                        >
                        <optgroup label="Yêu cầu hợp lệ" className="bg-slate-900">
                            <option value="Standard GET Request">Standard GET Request (Hợp lệ)</option>
                        </optgroup>
                        <optgroup label="Yêu cầu độc hại" className="bg-slate-900">
                            <option value="Expired JWT Token">Expired JWT Token (Lỗi Authentication)</option>
                            <option value="DDoS Attack / High Traffic">High Frequency Traffic (Lỗi Rate Limit)</option>
                            <option value="Missing Required JSON Fields">Malformed Payload (Lỗi Validation)</option>
                            <option value="SQL Injection 'OR 1=1'">SQL Injection Attempt (Lỗi Firewall)</option>
                        </optgroup>
                        </select>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorSection;
