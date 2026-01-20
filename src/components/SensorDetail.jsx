import React from 'react';
import { 
  Activity, BarChart3, Database, ChevronLeft, MapPin 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { usePipeData } from '../hooks/usePipeData';
import LogTable from './LogTable';

const SensorDetail = ({ pipeId, label, onBack }) => {
  const { status, color, streak, history } = usePipeData(pipeId);

  // --- 1. Average Distance Logic ---
  const leakEvents = history.filter(r => r.label === 'Leak' && r.distance > 0);
  let avgDistance = 0;
  if (leakEvents.length > 0) {
    const total = leakEvents.reduce((acc, curr) => acc + parseFloat(curr.distance), 0);
    avgDistance = (total / leakEvents.length).toFixed(1);
  }

  // --- 2. NEW SCORING LOGIC (+10 / -5 in a 10-sample window) ---
  const recentHistory = [...history].reverse().slice(-30); // Show last 30 points on graph

  const chartData = recentHistory.map((item, index, array) => {
    // 1. Define the window (Current point + previous 9 points)
    const start = Math.max(0, index - 9);
    const window = array.slice(start, index + 1);
    
    // 2. Count events in this window
    const leakCount = window.filter(i => i.label === 'Leak').length;
    const safeCount = window.length - leakCount;

    // 3. Apply your Formula: (Leaks * 10) + (Safes * -5)
    // Max Score: 10 leaks * 10 = 100
    // Min Score: 10 safes * -5 = -50
    let score = (leakCount * 10) + (safeCount * -5);

    return {
      time: item.timestamp.split(' ')[1],
      severity: score,
      rawLabel: item.label
    };
  });

  const getTheme = () => {
    switch(color) {
      case 'rose': return { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', fill: '#f43f5e' };
      case 'amber': return { bg: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-400', fill: '#fbbf24' };
      default: return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', fill: '#10b981' };
    }
  };
  const theme = getTheme();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500 pb-20">
      
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
      >
        <ChevronLeft size={14} /> Return to Grid
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">Live Telemetry</h1>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">{label}</h2>
          <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">Node ID: {pipeId}</p>
        </div>
        <div className={`self-start md:self-auto px-4 py-2 rounded-sm border ${theme.border} ${theme.bg} bg-opacity-10 backdrop-blur-sm text-xs font-black uppercase tracking-widest ${theme.text} flex items-center gap-2 shadow-lg`}>
            <Activity size={14} /> {status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPH */}
        <div className="lg:col-span-2 bg-[#121416]/80 backdrop-blur-md border border-white/10 rounded-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={12} className="text-cyan-400" /> Net Severity Index (Window: 10)
                </div>
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                    Score: <span className={`${chartData[chartData.length-1]?.severity > 0 ? 'text-rose-500' : 'text-emerald-500'} text-lg font-mono ml-2`}>
                        {chartData[chartData.length-1]?.severity || 0}
                    </span>
                </div>
            </div>
            
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.fill} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={theme.fill} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        
                        {/* Reference Line at 0 (The Baseline) */}
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

                        {/* Thresholds */}
                        <ReferenceLine y={50} stroke="#fbbf24" strokeDasharray="3 3" strokeOpacity={0.5} />

                        <XAxis dataKey="time" hide />
                        
                        {/* Y-Axis fixed to your new range: -50 to 100 */}
                        <YAxis hide domain={[-50, 100]} />
                        
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '12px', textTransform: 'uppercase' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [value, "Severity Score"]}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="severity" 
                            stroke={theme.fill} 
                            fillOpacity={1} 
                            fill="url(#colorSev)" 
                            strokeWidth={3}
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
            
            {color !== 'emerald' ? (
                <div className="bg-[#121416]/80 border border-white/10 p-6 rounded-sm relative overflow-hidden animate-in zoom-in-95">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={64} /></div>
                    <p className="text-[9px] uppercase font-black text-rose-500 tracking-[0.2em] mb-2">Est. Leak Origin</p>
                    <p className="text-4xl font-mono font-bold text-white tracking-tighter">
                        {avgDistance}<span className="text-sm text-slate-600 ml-1">cm</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-2 italic">Avg of {leakEvents.length} confirmed readings</p>
                </div>
            ) : (
                <div className="bg-[#121416]/80 border border-white/5 p-6 rounded-sm flex flex-col items-center justify-center text-center opacity-50 h-[140px]">
                    <CheckCircle size={32} className="text-emerald-500 mb-2"/>
                    <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">No Active Leaks</p>
                </div>
            )}

            <div className="bg-[#121416]/80 border border-white/10 p-6 rounded-sm">
                 <p className="text-[9px] uppercase font-black text-slate-500 tracking-[0.2em] mb-2">Confidence Streak</p>
                 <p className={`text-4xl font-mono font-bold tracking-tighter ${theme.text}`}>
                    {streak}
                 </p>
                 <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                    <div className={`h-full ${theme.bg} transition-all duration-500`} style={{ width: `${Math.min(streak * 20, 100)}%` }}></div>
                 </div>
            </div>
        </div>
      </div>

      <div className="bg-[#121416]/90 border border-white/10 rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
            <Database size={14} /> Event Log
        </div>
        <LogTable history={history} />
      </div>
    </div>
  );
};

const CheckCircle = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default SensorDetail;