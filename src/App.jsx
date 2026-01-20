import React, { useState, useEffect } from 'react';
import { Waves, LayoutDashboard, FileText } from 'lucide-react';
import SensorNode from './components/SensorNode';
import SensorDetail from './components/SensorDetail';
import Reports from './components/Reports';
import { usePipeData } from './hooks/usePipeData';

const App = () => {
  // --- 1. PERSISTENCE LOGIC: Read from Storage on Load ---
  const [view, setView] = useState(() => {
    return localStorage.getItem('pipe_monitor_view') || 'dashboard';
  });
  
  const [activePipeId, setActivePipeId] = useState(() => {
    return localStorage.getItem('pipe_monitor_active_id') || null;
  });

  // --- 2. SYNC LOGIC: Save to Storage and History API ---
  useEffect(() => {
    // Save to LocalStorage
    localStorage.setItem('pipe_monitor_view', view);
    if (activePipeId) {
      localStorage.setItem('pipe_monitor_active_id', activePipeId);
      // Update Browser History for Alt + Arrow support
      window.history.pushState({ view, pipeId: activePipeId }, '');
    } else {
      localStorage.removeItem('pipe_monitor_active_id');
      window.history.replaceState({ view, pipeId: null }, '');
    }
  }, [view, activePipeId]);

  // Handle Browser Back Button (Alt + Arrow)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setView(event.state.view || 'dashboard');
        setActivePipeId(event.state.pipeId || null);
      } else {
        setActivePipeId(null);
        setView('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- CONFIG ---
  const sensors = [
    { id: 'pipe_1', label: 'Sensor #1' },
    { id: 'pipe_2', label: 'Sensor #2' },
    { id: 'pipe_3', label: 'Sensor #3' },
  ];
  
  const activeSensorLabel = sensors.find(s => s.id === activePipeId)?.label || 'Unknown Node';
  const globalData = usePipeData('pipe_1'); 

  const goToDashboard = () => {
    setActivePipeId(null);
    setView('dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0B0C10] text-slate-300 font-sans selection:bg-cyan-500/30">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#121416] border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col justify-between md:justify-start z-50 sticky top-0 md:relative">
        <div className="p-4 md:p-8 cursor-pointer flex items-center gap-3" onClick={goToDashboard}>
          <div className="bg-cyan-500/20 p-2 rounded-sm text-cyan-400 border border-cyan-500/30">
            <Waves size={20} />
          </div>
          <div>
            <span className="font-black text-lg tracking-tighter uppercase italic text-white block">Pipe Monitor</span>
            <span className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.3em] hidden md:block">Industrial Uplink</span>
          </div>
        </div>

        <nav className="flex md:flex-col items-center md:items-stretch p-2 md:p-4 gap-2">
          <button 
            onClick={goToDashboard}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 md:border-l-2 border-cyan-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={16} /> <span className="hidden md:inline">Monitor</span>
          </button>
          <button 
            onClick={() => {setView('reports'); setActivePipeId(null)}}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${view === 'reports' ? 'bg-cyan-500/10 text-cyan-400 md:border-l-2 border-cyan-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <FileText size={16} /> <span className="hidden md:inline">Audit Logs</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto h-[calc(100vh-80px)] md:h-screen">
        <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
          {view === 'dashboard' ? (
            !activePipeId ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-end">
                   <div>
                     <h1 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">Overview</h1>
                     <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">Sensor Network</h2>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {sensors.map((sensor) => (
                     <SensorNode 
                        key={sensor.id}
                        pipeId={sensor.id}
                        label={sensor.label}
                        onClick={() => setActivePipeId(sensor.id)} 
                     />
                   ))}
                </div>
              </div>
            ) : (
              <SensorDetail 
                pipeId={activePipeId} 
                label={activeSensorLabel} 
                onBack={() => {
                  window.history.back(); // Triggers popstate to update activePipeId
                }} 
              />
            )
          ) : (
            <Reports history={globalData.history} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;