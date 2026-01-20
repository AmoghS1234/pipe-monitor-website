import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue, query, limitToLast } from 'firebase/database';

export const usePipeData = (pipeId) => {
  const [data, setData] = useState({ 
    status: "SYSTEM IDLE", 
    color: "gray", 
    history: [], 
    chartData: [],
    streak: 0 
  });

  useEffect(() => {
    const pipeRef = query(ref(database, `pipes/${pipeId}/readings`), limitToLast(100));

    return onValue(pipeRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convert to array and sort by time
        const historyArray = Object.keys(val).map(k => ({ id: k, ...val[k] })).reverse();
        
        // Prepare data for the graph (needs to be chronological)
        const chartData = [...historyArray].reverse().map(item => ({
          time: item.timestamp.split(' ')[1], // Just HH:MM:SS
          value: item.distance > 0 ? item.distance : 0, // Plot distance
          isLeak: item.label === 'Leak'
        }));

        // Streak Logic
        const last10 = historyArray.slice(0, 10);
        let maxStreak = 0;
        let currentStreak = 0;
        
        // Calculate max streak in recent window
        last10.forEach(r => {
          if (r.label === 'Leak') {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });

        let status = "SYSTEM NOMINAL";
        let color = "emerald"; // green

        if (maxStreak >= 5) { 
          status = "CRITICAL FAILURE"; 
          color = "rose"; // red
        } else if (maxStreak >= 2) { 
          status = "ANOMALY DETECTED"; 
          color = "amber"; // yellow
        } else if (maxStreak > 0) {
            status = "ANALYZING";
            color = "blue";
        }

        setData({ status, color, history: historyArray, chartData, streak: maxStreak });
      }
    });
  }, [pipeId]);

  return data;
};