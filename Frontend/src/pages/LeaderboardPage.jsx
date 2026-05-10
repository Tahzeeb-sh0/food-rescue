import { useState, useEffect } from 'react';
import { Trophy, Leaf, Star, Loader2, Medal } from 'lucide-react';

const MEDAL_COLORS = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];
const MEDAL_BG = ['bg-yellow-50 border-yellow-200', 'bg-slate-50 border-slate-200', 'bg-amber-50 border-amber-200'];

const LeaderboardPage = () => {
  const [ngos, setNgos] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all NGOs and their donation history
    Promise.all([
      fetch('http://localhost:8080/api/users/ngos').then(r => r.json()),
    ])
      .then(async ([ngoList]) => {
        // For each NGO, fetch their completed pickups and rating
        const enriched = await Promise.all(
          ngoList.map(async (ngo) => {
            const [donationsRes, ratingRes] = await Promise.allSettled([
              fetch(`http://localhost:8080/api/donations/ngo/${ngo.id}`).then(r => r.json()),
              fetch(`http://localhost:8080/api/ratings/ngo/${ngo.id}/average`).then(r => r.json()),
            ]);

            const donations = donationsRes.status === 'fulfilled' ? donationsRes.value : [];
            const ratingData = ratingRes.status === 'fulfilled' ? ratingRes.value : { average: 0, count: 0 };

            const completed = donations.filter(d => d.status === 'COMPLETED');
            const totalMeals = completed.reduce((sum, d) => sum + d.capacity, 0);

            return {
              ...ngo,
              completedPickups: completed.length,
              totalMeals,
              rating: ratingData,
            };
          })
        );

        // Sort by total meals delivered
        enriched.sort((a, b) => b.totalMeals - a.totalMeals);
        setNgos(enriched);
      })
      .catch(() => setNgos([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary-900 py-20 border-b border-primary-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Trophy className="w-96 h-96 text-white absolute -right-20 -top-20" />
        </div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-600/20 text-accent-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <Trophy size={12} /> Community Rankings
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">NGO Leaderboard</h1>
          <p className="text-primary-200 text-lg leading-relaxed">
            Celebrating the organizations making the biggest impact in food rescue.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-12">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-slate-300">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="text-sm font-medium">Loading rankings...</p>
          </div>
        ) : ngos.length === 0 ? (
          <div className="py-32 text-center text-slate-400">
            <Trophy size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No NGOs registered yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 podium */}
            {ngos.length >= 3 && (
              <div className="hidden sm:grid grid-cols-3 gap-4 mb-8">
                {[ngos[1], ngos[0], ngos[2]].map((ngo, podiumIdx) => {
                  const rank = podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3;
                  const heights = ['h-32', 'h-44', 'h-28'];
                  return (
                    <div key={ngo.id} className={`flex flex-col items-center justify-end ${heights[podiumIdx]}`}>
                      <div className="text-center mb-2">
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{ngo.name}</p>
                        <p className="text-[10px] text-slate-500">{ngo.totalMeals.toLocaleString()} meals</p>
                      </div>
                      <div className={`w-full rounded-t-xl flex items-center justify-center py-4 border-2 ${MEDAL_BG[rank - 1]}`}>
                        <Medal size={28} className={MEDAL_COLORS[rank - 1]} />
                        <span className={`text-2xl font-bold ml-1 ${MEDAL_COLORS[rank - 1]}`}>#{rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full ranked list */}
            <div className="structured-card bg-white overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="grid grid-cols-8 sm:grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="col-span-1">Rank</span>
                  <span className="col-span-5 sm:col-span-5">Organization</span>
                  <span className="hidden sm:block col-span-2 text-right">Pickups</span>
                  <span className="col-span-2 text-right">Meals</span>
                  <span className="col-span-2 text-right">Rating</span>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {ngos.map((ngo, idx) => (
                  <div
                    key={ngo.id}
                    className={`px-4 sm:px-6 py-4 grid grid-cols-8 sm:grid-cols-12 items-center hover:bg-slate-50 transition-colors ${idx < 3 ? 'bg-gradient-to-r from-slate-50/50 to-transparent' : ''}`}
                  >
                    <div className="col-span-1">
                      {idx < 3 ? (
                        <Medal size={20} className={MEDAL_COLORS[idx]} />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">#{idx + 1}</span>
                      )}
                    </div>
                    <div className="col-span-5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                          {ngo.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{ngo.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">Verified NGO</p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block col-span-2 text-right">
                      <span className="text-sm font-bold text-slate-700">{ngo.completedPickups}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-bold text-primary-700 flex items-center justify-end gap-1">
                        <Leaf size={12} /> {ngo.totalMeals.toLocaleString()}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      {ngo.rating.count > 0 ? (
                        <span className="text-sm font-bold text-amber-600 flex items-center justify-end gap-1">
                          <Star size={12} className="fill-amber-500" /> {ngo.rating.average.toFixed(1)}
                          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({ngo.rating.count})</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-medium">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              Rankings update in real time based on completed pickups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
