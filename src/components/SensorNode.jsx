import React from 'react';
import { usePipeData } from '../hooks/usePipeData';
import { Activity, ShieldAlert, CheckCircle, Radio, ChevronRight } from 'lucide-react';

const SensorNode = ({ pipeId, label, onClick }) => {
  const { status, color, streak } = usePipeData(pipeId);

  // Dark Theme Colors
  const getTheme = () => {
    switch (color) {
      case 'rose': return { border: 'border-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10', shadow: 'shadow-rose-500/20' };
      case 'amber': return { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-400/10', shadow: 'shadow-amber-400/20' };
      default: return { border: 'border-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10', shadow: 'shadow-emerald-500/20' };
    }
  };
  const theme = getTheme();

  return (
    <div 
      onClick={onClick}
      className={`relative w-full h-64 bg-[#121416]/90 backdrop-blur-md border p-6 rounded-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group flex flex-col justify-between ${theme.border} ${theme.shadow}`}
    >
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-2 mb-2 opacity-50">
              <Radio size={12} className={theme.text} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{pipeId.replace('_', ' ')}</span>
           </div>
           <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">{label}</h3>
        </div>
        <div className={`p-2 rounded-full ${theme.bg} ${theme.text}`}>
          {color === 'rose' ? <ShieldAlert size={20} /> : color === 'amber' ? <Activity size={20} /> : <CheckCircle size={20} />}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${theme.text.replace('text-', 'bg-')}`}></div>
            <p className={`text-sm font-black uppercase tracking-widest ${theme.text}`}>{status}</p>
        </div>
        
        {color !== 'emerald' && (
            <div className="w-full bg-black/20 rounded-sm px-3 py-2 border border-white/5 flex justify-between items-center">
                <span className="text-[9px] uppercase font-bold text-slate-500">Streak Count</span>
                <span className="text-lg font-mono font-bold text-white">{streak}</span>
            </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">
            Tap to Analyze
        </span>
        <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
      </div>
    </div>
  );
};

export default SensorNode;