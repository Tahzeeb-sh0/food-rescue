import { useState, useEffect } from 'react';
import { Trophy, Leaf, Package, TrendingUp, Loader2, Medal } from 'lucide-react';

const MEDAL_COLORS = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];
const MEDAL_BG = ['bg-yellow-50 border-yellow-200', 'bg-slate-50 border-slate-200', 'bg-amber-50 border-amber-200'];

const LeaderboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/leaderboard?limit=20')
      .then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then(data => setEntries(data))
      .catch(() => setError('Could not load leaderboard. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary-900 py-20 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <Trophy className="w-96 h-96 translate-x-20 -translate-y-20" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 rounded-full text-primary-200 text-xs font-bold uppercase tracking-widest mb-6">
            <Trophy size={14} /> Community Rankings
          </div>
          <h1 className="text-5xl font-bold font-serif mb-4">NGO Leaderboard</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Celebrating the organizations making the biggest impact in food rescue. Rankings are based on total meals delivered.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-16 relative z-10">
        {isLoading ? (
          <div className="structured-card bg-white p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-primary-300 mb-4" />
            <p className="text-slate-400 text-sm font-medium">Loading rankings...</p>
          </div>
        ) : error ? (
          <div className="structured-card bg-white p-12 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="structured-card bg-white p-20 text-center">
            <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">No rankings yet</h3>
            <p className="text-slate-500">Rankings will appear once NGOs start completing pickups.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 podium */}
            {entries.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
                  const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                  const heights = ['h-32', 'h-40', 'h-28'];
                  const h = heights[podiumIdx];
                  return (
                    <div key={entry.ngoId} className={`structured-card bg-white p-6 flex flex-col items-center text-center border-2 ${MEDAL_BG[rank - 1]}`}>
                      <Medal size={28} className={`mb-3 ${MEDAL_COLORS[rank - 1]}`} />
                      <p className={`text-2xl font-bold font-serif mb-1 ${MEDAL_COLORS[rank - 1]}`}>#{rank}</p>
                      <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">{entry.ngoName}</h3>
                      <p className="text-2xl font-bold font-serif text-primary-700">{entry.totalMeals.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">meals</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div className="structured-card bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] w-16">Rank</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Organization</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Meals</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Pickups</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">CO₂ Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {entries.map((entry, idx) => (
                      <tr key={entry.ngoId} className={`hover:bg-slate-50 transition-colors ${idx < 3 ? 'bg-primary-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <span className={`text-lg font-bold font-serif ${idx < 3 ? MEDAL_COLORS[idx] : 'text-slate-400'}`}>
                            {idx < 3 ? <Medal size={20} className="inline" /> : `#${idx + 1}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                              {entry.ngoName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900">{entry.ngoName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-primary-700 text-base">{entry.totalMeals.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium text-slate-600">{entry.completedPickups}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-medium text-green-600">{entry.co2SavedKg.toLocaleString()} kg</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Progress bars for top 5 */}
              <div className="p-8 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Top 5 — Meals Delivered</h3>
                <div className="space-y-4">
                  {entries.slice(0, 5).map((entry, idx) => {
                    const pct = entries[0].totalMeals > 0
                      ? (entry.totalMeals / entries[0].totalMeals) * 100
                      : 0;
                    return (
                      <div key={entry.ngoId}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className={`text-xs font-bold ${idx < 3 ? MEDAL_COLORS[idx] : 'text-slate-400'}`}>#{idx + 1}</span>
                            {entry.ngoName}
                          </span>
                          <span className="text-sm font-bold text-primary-700">{entry.totalMeals.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 font-medium pt-4">
              Rankings update in real-time as pickups are completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
