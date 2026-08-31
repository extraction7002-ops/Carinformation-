import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  pendingCount
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top utility bar for switching Phone Frame vs Responsive Full-Width */}
      <header className="w-full max-w-5xl flex items-center justify-between px-4 py-2.5 mb-2 text-xs text-slate-500 border-b border-slate-200 bg-white/70 backdrop-blur-sm rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight">Parivahan & e-Challan Citizen Portal</span>
              <span className="hidden sm:inline-block bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                Sleek Interface
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Central Traffic Enforcement & RC Records</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-viewmode"
            onClick={() => setIsPhoneMode(!isPhoneMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors border border-slate-200 text-xs font-semibold shadow-xs cursor-pointer"
            title="Toggle Android Device Frame / Full View"
          >
            {isPhoneMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Full Display</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Android Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 ${
          isPhoneMode
            ? 'max-w-[430px] rounded-[40px] ring-12 ring-slate-900 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] overflow-hidden border border-slate-300 bg-slate-50 flex flex-col h-[90vh] max-h-[890px]'
            : 'max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 shadow-xl overflow-hidden min-h-[85vh] flex flex-col'
        }`}
      >
        {/* Android Status Bar */}
        <div className="w-full bg-white px-6 py-2 flex items-center justify-between text-xs text-slate-600 select-none z-30 border-b border-slate-100">
          <span className="font-bold tracking-tight text-slate-900 font-mono text-[13px]">{currentTime || '12:00'}</span>
          
          {/* Camera Notch on Phone Mode */}
          {isPhoneMode && (
            <div className="w-4 h-4 rounded-full bg-slate-200 ring-2 ring-slate-100 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-[10px] font-bold tracking-wider text-indigo-600">5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="font-semibold text-slate-700">96%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Scrollable App Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-50 scrollbar-thin scrollbar-thumb-slate-300">
          {children}
        </div>

        {/* Android Bottom Navigation Bar */}
        <nav aria-label="Main Navigation" className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around z-30 select-none shadow-xs">
          <button
            id="nav-tab-rc"
            onClick={() => onTabChange('rc')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'rc'
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'rc' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}>
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight">RC Details</span>
          </button>

          <button
            id="nav-tab-challans"
            onClick={() => onTabChange('challans')}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'challans'
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'challans' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[10px] tracking-tight">Challans</span>
            {pendingCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white shadow-sm animate-bounce">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-rules"
            onClick={() => onTabChange('rules')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'rules' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[10px] tracking-tight">MV Rules</span>
          </button>

          <button
            id="nav-tab-advisor"
            onClick={() => onTabChange('advisor')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'advisor'
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'advisor' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[10px] tracking-tight">AI Advisor</span>
          </button>
        </nav>

        {/* Android Gesture Bar */}
        <div className="w-full bg-white py-1 flex items-center justify-center select-none border-t border-slate-100">
          <div className="w-28 h-1 bg-slate-300 rounded-full" />
        </div>
      </main>
    </div>
  );
};
