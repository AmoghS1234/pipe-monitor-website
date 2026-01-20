import { ShieldAlert, Activity, CheckCircle } from 'lucide-react';

const StatusCard = ({ status }) => {
  const getTheme = () => {
    if (status.includes("CRITICAL")) return { 
      color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/50", icon: <ShieldAlert className="w-12 h-12" /> 
    };
    if (status.includes("WARNING")) return { 
      color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/50", icon: <Activity className="w-12 h-12" /> 
    };
    return { 
      color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/50", icon: <CheckCircle className="w-12 h-12" /> 
    };
  };

  const theme = getTheme();

  return (
    <div className={`p-8 rounded-2xl border transition-all duration-500 ${theme.border} ${theme.bg} flex items-center justify-between`}>
      <div>
        <p className="text-xs uppercase font-semibold opacity-60 mb-2 tracking-widest text-slate-400">Security Vector</p>
        <h2 className={`text-4xl lg:text-5xl font-black tracking-tight ${theme.color}`}>{status}</h2>
      </div>
      <div className={theme.color}>{theme.icon}</div>
    </div>
  );
};

export default StatusCard;