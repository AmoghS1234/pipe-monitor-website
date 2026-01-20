import React, { useState, useMemo } from 'react';
import { Calendar, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react';

const Reports = ({ history = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const dailyReports = useMemo(() => {
    const groups = {};
    history.forEach(reading => {
      const dateStr = reading.timestamp.split(' ')[0]; 
      if (!groups[dateStr]) groups[dateStr] = { date: dateStr, events: [] };
      
      // Store ONLY Leaks
      if (reading.label === 'Leak') {
        groups[dateStr].events.push(reading);
      }
    });
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [history]);

  // --- DETAIL VIEW ---
  if (selectedDate) {
    const report = dailyReports.find(r => r.date === selectedDate);
    const events = report ? report.events : [];

    return (
      <div className="animate-in slide-in-from-right-8 fade-in duration-300 max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedDate(null)} 
          className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors mb-8"
        >
          <ChevronLeft size={14} /> Back to List
        </button>

        <div className="bg-[#121416] border border-white/10 rounded-sm overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/5">
            <h2 className="text-3xl font-black text-white tracking-tighter">Incident Report</h2>
            <p className="text-cyan-500 font-bold uppercase tracking-widest text-xs mt-2">{selectedDate}</p>
          </div>
          
          <div className="divide-y divide-white/5">
            {events.length === 0 ? (
               <div className="p-8 text-center text-slate-500 italic">No irregularities found.</div>
            ) : (
              events.map((ev, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-sm ${ev.distance > 10 ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                        {ev.distance > 10 ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                      </div>
                      <div>
                        <div className={`font-bold text-sm uppercase tracking-wider ${ev.distance > 10 ? 'text-rose-500' : 'text-amber-500'}`}>
                          {ev.distance > 10 ? 'Suspected Leak' : 'Irregularity'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase mt-1">
                          Sensor: Pipe_1
                        </div>
                      </div>
                   </div>
                   <div className="font-mono text-sm font-bold text-slate-400">
                      {ev.timestamp.split(' ')[1]}
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
        <h1 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-6 text-center">Audit Logs</h1>
        
        <div className="space-y-3">
            {dailyReports.map((report) => (
                <div 
                    key={report.date} 
                    onClick={() => setSelectedDate(report.date)}
                    className="bg-[#121416] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 p-6 rounded-sm cursor-pointer transition-all flex justify-between items-center group"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-500/10 text-cyan-500 p-3 rounded-sm">
                            <Calendar size={20} />
                        </div>
                        <span className="text-lg font-bold text-slate-300 group-hover:text-white font-mono">
                            {report.date}
                        </span>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
            ))}
        </div>
    </div>
  );
};

export default Reports;