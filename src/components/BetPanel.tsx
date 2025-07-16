import React, { useState } from 'react';

const difficulties = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
  { label: 'Expert', value: 'expert' },
  { label: 'Master', value: 'master' },
];

const BetPanel = ({ onConnect, onBet, isConnected, balance, onDisconnect, difficulty, setDifficulty }: any) => {
  const [nickname, setNickname] = useState('');
  const [amount, setAmount] = useState('');
  // Удаляем локальный useState для difficulty

  return (
    <div className="bg-[#232e38] p-10 rounded-2xl w-full max-w-md flex flex-col gap-8">
      {/* Поле nickname убрано */}
      <div>
        <label className="block text-gray-300 text-lg mb-2 font-bold">Bet Amount</label>
        <input
          className="w-full px-5 py-4 rounded-xl bg-[#1a232b] text-white text-xl"
          placeholder="0.00000000"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type="number"
          min="0"
        />
        {typeof balance !== 'undefined' && (
          <div className="mt-1 text-xs text-gray-400">Balance: {Number(balance).toFixed(3)} STT</div>
        )}
        {/* Quick Bet */}
        <div className="mt-2 flex flex-wrap gap-2">
          {[0.01, 0.1, 1, 5, 10].map(val => (
            <button
              key={val}
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
              onClick={() => setAmount(val.toString())}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-gray-300 text-lg mb-2 font-bold">Difficulty</label>
        <select
          className="w-full px-5 py-4 rounded-xl bg-[#1a232b] text-white text-xl"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          {difficulties.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      <button
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-xl mt-4"
        onClick={() => onBet({ amount, difficulty })}
        disabled={!isConnected || !amount}
      >
        Bet
      </button>
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded m-0"
        onClick={onConnect}
        disabled={isConnected}
        style={{ marginBottom: 0 }}
      >
        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      {isConnected && (
         <button
           className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-2 rounded -mt-2"
           style={{ marginTop: 0, marginBottom: 0 }}
           onClick={onDisconnect}
         >
           Disconnect
         </button>
      )}
    </div>
  );
};

export default BetPanel;
