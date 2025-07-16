import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../utils/contract.ts';

interface LeaderboardPlayer {
  addr: string;
  nickname: string;
  totalWinnings: string;
}

interface LeaderboardProps {
  provider?: any;
}

const Leaderboard = ({ provider }: LeaderboardProps) => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    if (!provider) return;
    
    setLoading(true);
    try {
      const leaderboard = await getLeaderboard(provider);
      setPlayers(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Показываем пустой лидерборд при ошибке
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (provider) {
      fetchLeaderboard();
    }
    // Обновлять лидерборд при смене ника
    const handler = () => { fetchLeaderboard(); };
    window.addEventListener('refreshLeaderboard', handler);
    return () => window.removeEventListener('refreshLeaderboard', handler);
  }, [provider]);

  return (
    <div className="bg-[#232e38] p-10 rounded-2xl w-full max-w-md">
      <h3 className="text-white font-bold text-3xl mb-4">Leaderboard</h3>
      {loading ? (
        <div className="text-gray-400 text-center">Loading...</div>
      ) : players.length === 0 ? (
        <div className="text-gray-400 text-center">No players yet</div>
      ) : (
        <>
          <div className="flex justify-between items-center text-white text-base mb-2 px-1">
            <span className="font-bold">&nbsp;</span>
            <span className="font-bold text-green-400">Profit</span>
          </div>
          <div className="space-y-4">
            {players.map((player, index) => (
              <div key={player.addr} className="flex justify-between items-center text-white text-xl">
                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 font-bold text-2xl">#{index + 1}</span>
                  <span className="truncate max-w-32 font-bold">{player.nickname}</span>
                </div>
                <span className="text-green-400 font-bold text-xl">{Number(player.totalWinnings).toFixed(3)} STT</span>
              </div>
            ))}
          </div>
        </>
      )}
      <button
        onClick={fetchLeaderboard}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-4 rounded-xl font-bold"
        disabled={!provider}
      >
        Refresh
      </button>
    </div>
  );
};

export default Leaderboard;