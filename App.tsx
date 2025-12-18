
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import IntroSection from './components/IntroSection';
import DetailsSection from './components/DetailsSection';
import QualitySection from './components/QualitySection';
import DiagramSection from './components/DiagramSection';
import SimulatorSection from './components/SimulatorSection';
import { Section } from './types';
import { ShieldCheck, Zap, Terminal, Activity, Cpu } from 'lucide-react';

const App: React.FC = () => {
  // Fixed: Added state to manage active section navigation
  const [activeSection, setActiveSection] = useState<Section>(Section.AI_SIMULATOR);

  const renderContent = () => {
    switch (activeSection) {
      case Section.INTRODUCTION:
        return <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-200 text-slate-900 shadow-xl"><IntroSection /></div>;
      case Section.PATTERN_DETAILS:
        return <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-200 text-slate-900 shadow-xl"><DetailsSection /></div>;
      case Section.QUALITY_ATTRIBUTES:
        return <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-200 text-slate-900 shadow-xl"><QualitySection /></div>;
      case Section.DIAGRAMS:
        return <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-200 text-slate-900 shadow-xl"><DiagramSection /></div>;
      case Section.AI_SIMULATOR:
        return (
          <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
            <div className="bg-slate-950/40 rounded-[2.8rem] p-6 lg:p-12 border border-white/5">
              <SimulatorSection />
            </div>
          </div>
        );
      default:
        return <SimulatorSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Sidebar integration for full app navigation */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Background glass and lighting effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
        </div>

        <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-white flex items-center gap-2">
                  HANDLER <span className="text-indigo-500">AI LAB</span>
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 font-black">V2.0</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" /> Architecture Security Simulator
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <Activity className="w-3 h-3 text-emerald-500" />
                Gemini 3 Flash Engine
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 w-full">
          <div className="mb-12 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Real-time Pattern Analysis
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight lg:text-6xl max-w-4xl">
              {activeSection === Section.AI_SIMULATOR ? (
                <>Giả lập chuỗi bảo mật <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Thông minh tích hợp AI</span></>
              ) : (
                <>Kiến trúc bảo mật <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Nền tảng tri thức</span></>
              )}
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-medium opacity-80">
              Khám phá sức mạnh của Handler Pattern thông qua việc trực quan hóa các kịch bản tấn công thực tế và cách hệ thống tự động ngăn chặn bằng AI.
            </p>
          </div>

          {/* Main Content Area */}
          {renderContent()}

          <footer className="mt-24 py-12 border-t border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 opacity-40">
              <div className="flex flex-col items-center gap-2">
                <Terminal className="w-5 h-5"/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Pipeline Console</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5"/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Defense Layer</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Activity className="w-5 h-5"/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Latency Check</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-5 h-5"/>
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Short-Circuit</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-center uppercase tracking-[0.5em] text-slate-600">
              System Design & AI Education • Topic 08 • 2024
            </p>
          </footer>
        </main>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default App;

