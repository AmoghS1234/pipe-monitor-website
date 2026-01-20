import React from 'react';

const LogTable = ({ history }) => {
  return (
    <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
            <thead className="text-slate-500 border-b border-white/5">
                <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Val</th>
                    <th className="px-6 py-3 text-right">Timestamp</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-400">
                {history.slice(0, 5).map(row => (
                    <tr key={row.id}>
                        <td className="px-6 py-3 text-slate-600">#{row.id.slice(-4)}</td>
                        <td className="px-6 py-3">
                            <span className={row.label === 'Leak' ? 'text-rose-500 font-bold' : 'text-emerald-500'}>{row.label.toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-3">{row.distance}</td>
                        <td className="px-6 py-3 text-right">{row.timestamp.split(' ')[1]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default LogTable;