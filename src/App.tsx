import React, { useState, useEffect } from 'react';
import BetPanel from './components/BetPanel.tsx';
import GameBoard from './components/GameBoard.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import { generateBoard, generatePath, BoardCell } from './utils/gameLogic.ts';
import { connectWallet, placeBet, cashout, getContractBalance, resetBet, changeNickname, checkNetwork } from './utils/contract.ts';
import { ethers } from 'ethers';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toFixed18(val: number | string) {
  return Number(val).toFixed(18).replace(/0+$/, '').replace(/\.$/, '');
}

const getStoredNickname = (address: string) => {
  if (!address) return '';
  return localStorage.getItem(`nickname_${address}`) || '';
};
const setStoredNickname = (address: string, nickname: string) => {
  if (!address) return;
  localStorage.setItem(`nickname_${address}`, nickname);
};

const clearActiveGame = () => {
  localStorage.removeItem('activeGame');
};

function HistoryPanel({ history, currentPage, setCurrentPage, totalPages }: {
  history: any[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}) {
  if (!history.length) return null;
  return (
    <div className="mt-8 w-full max-w-xl bg-[#232e38] rounded-xl p-4">
      <div className="text-white font-bold mb-2 text-lg">Game History</div>
      <div className="space-y-2">
        {history.slice().reverse().map((h, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-200">
            <span>{h.date}</span>
            <span>{h.difficulty.charAt(0).toUpperCase() + h.difficulty.slice(1)}</span>
            <span>Bet: {h.bet}</span>
            <span>Mult: {h.mult}</span>
            <span>Profit: {h.profit}</span>
            <span className={h.result === 'win' ? 'text-green-400' : 'text-red-400'}>{h.result === 'win' ? 'Win' : 'Lose'}</span>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
            onClick={() => setCurrentPage((p: number) => Math.max(1, p-1))}
            disabled={currentPage === 1}
          >Prev</button>
          <span className="text-white">Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
            onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p+1))}
            disabled={currentPage === totalPages}
          >Next</button>
        </div>
      )}
    </div>
  );
}

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [nickname, setNickname] = useState('');
  const [bet, setBet] = useState('');
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'|'expert'|'master'>('easy');
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState<BoardCell[][] | null>(null);
  const [path, setPath] = useState<{x:number, y:number}[] | null>(null);
  const [position, setPosition] = useState(0);
  const [profit, setProfit] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [lost, setLost] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [dice1, setDice1] = useState<number | null>(null);
  const [dice2, setDice2] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [cashoutPending, setCashoutPending] = useState(false);
  const [canBet, setCanBet] = useState(true);
  const [editingNickname, setEditingNickname] = useState(false);
  const [inputNickname, setInputNickname] = useState('');
  const [accumulatedMult, setAccumulatedMult] = useState(1);
  const [multHistory, setMultHistory] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>('');
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem('gameHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [contractBalance, setContractBalance] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showWarning, setShowWarning] = useState(true);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const GAMES_PER_PAGE = 10;
  const totalPages = Math.ceil(gameHistory.length / GAMES_PER_PAGE) || 1;
  const paginatedHistory = gameHistory.slice((currentPage-1)*GAMES_PER_PAGE, currentPage*GAMES_PER_PAGE);

  useEffect(() => {
    const saved = localStorage.getItem('gameHistory');
    setGameHistory(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

  useEffect(() => {
    const saved = localStorage.getItem('activeGame');
    if (saved) {
      const state = JSON.parse(saved);
      setBoard(state.board);
      setPath(state.path);
      setPosition(state.position);
      setStep(state.step);
      setLost(state.lost);
      setDice1(state.dice1);
      setDice2(state.dice2);
      setDifficulty(state.difficulty);
      setBet(state.bet);
      setAccumulatedMult(state.accumulatedMult);
      setMultHistory(state.multHistory);
      setGameActive(state.gameActive);
    }
  }, []);

  useEffect(() => {
    if (gameActive) {
      localStorage.setItem('activeGame', JSON.stringify({
        board, path, position, step, lost, dice1, dice2, difficulty, bet, accumulatedMult, multHistory, gameActive
      }));
    } else {
      localStorage.removeItem('activeGame');
    }
  }, [board, path, position, step, lost, dice1, dice2, difficulty, bet, accumulatedMult, multHistory, gameActive]);

  useEffect(() => {
    const saved = localStorage.getItem('activeGame');
    if (saved) {
      const state = JSON.parse(saved);
      if (state.gameActive && state.step === 0 && signer) {
        resetBet(signer).finally(() => {
          localStorage.removeItem('activeGame');
          setBoard(null);
          setPath(null);
          setPosition(0);
          setStep(0);
          setLost(false);
          setDice1(null);
          setDice2(null);
          setGameActive(false);
          setAccumulatedMult(1);
          setMultHistory([]);
          setBet('');
        });
      }
    }
  }, [signer]);

  const fetchBalance = async (provider: any, account: string) => {
    if (!provider || !account) return;
    try {
      const raw = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(raw));
    } catch (e) {
      setBalance('');
    }
  };

  const fetchContractBalance = async (provider: any) => {
    if (!provider) return;
    try {
      const bal = await getContractBalance(provider);
      setContractBalance(bal);
    } catch (e) {
      setContractBalance('');
    }
  };

  useEffect(() => {
    if (account && provider) {
      fetchBalance(provider, account);
      const stored = getStoredNickname(account);
      setNickname(stored);
      setInputNickname(stored);
      setEditingNickname(!stored);
    }
  }, [account, provider]);

  useEffect(() => {
    if (!account || !provider) return;
    const interval = setInterval(async () => {
      fetchBalance(provider, account);
      
              // Also check network status periodically
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setIsWrongNetwork(chainId !== '0xc488');
        } catch (error) {
          console.error('Error checking network in interval:', error);
        }
    }, 10000);
    return () => clearInterval(interval);
  }, [account, provider]);

  useEffect(() => {
    if (!provider) return;
    fetchContractBalance(provider);
    const interval = setInterval(() => fetchContractBalance(provider), 10000);
    return () => clearInterval(interval);
  }, [provider]);

  // Auto-hide warning banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWarning(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Listen for network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = async () => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Chain changed to:', chainId);
        console.log('Expected chain:', '0xc488');
        console.log('Is wrong network:', chainId !== '0xc488');
        setIsWrongNetwork(chainId !== '0xc488');
      } catch (error) {
        console.error('Error checking chain ID:', error);
      }
    };

    const handleAccountsChanged = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log('Accounts changed, chain ID:', chainId);
          setIsWrongNetwork(chainId !== '0xc488');
        }
      } catch (error) {
        console.error('Error checking accounts:', error);
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    // Check initial network
    handleChainChanged();

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    async function checkConnection() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const { provider, signer } = await connectWallet();
          const address = await signer.getAddress();
          setSigner(signer);
          setProvider(provider);
          setAccount(address);
          setIsConnected(true);
          fetchBalance(provider, address);
          
          // Check network
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setIsWrongNetwork(chainId !== '0xc488');
        }
      }
    }
    checkConnection();
  }, []);

  const handleSaveNickname = async () => {
    setNickname(inputNickname);
    if (account) {
      setStoredNickname(account, inputNickname);
    }
    setEditingNickname(false);
    if (signer && inputNickname) {
      try {
        await checkNetwork();
        await changeNickname(signer, inputNickname);
        setTxStatus('Nickname updated on blockchain');
        if (typeof window !== 'undefined') {
          const ev = new CustomEvent('refreshLeaderboard');
          window.dispatchEvent(ev);
        }
      } catch (e: any) {
        if (e.message.includes('Somnia Testnet')) {
          setTxStatus('Please switch to Somnia Testnet');
        } else {
          setTxStatus('Error updating nickname: ' + (e.message || 'Unknown error'));
        }
      }
    }
  };

  const handleConnect = async () => {
    try {
      setTxStatus('Connecting wallet and switching to Somnia Testnet...');
      const { provider, signer } = await connectWallet();
      const address = await signer.getAddress();
      setSigner(signer);
      setProvider(provider);
      setAccount(address);
      setIsConnected(true);
      fetchBalance(provider, address);
      
      // Проверяем, на какой сети мы подключились
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === '0xc488') {
        setTxStatus('Connected! Successfully switched to Somnia Testnet.');
        setIsWrongNetwork(false);
      } else {
        setTxStatus('Connected! Please switch to Somnia Testnet manually for full functionality.');
        setIsWrongNetwork(true);
      }
      setTimeout(() => setTxStatus(null), 3000);
    } catch (e: any) {
      console.error('Connection error:', e);
      if (e.message.includes('Somnia Testnet')) {
        setTxStatus('Please switch to Somnia Testnet in MetaMask');
      } else if (e.message.includes('MetaMask not found')) {
        setTxStatus('Please install MetaMask');
      } else {
        setTxStatus('Connection error: ' + (e.message || 'Unknown error'));
      }
    }
  };

  const handleBet = async ({ amount, difficulty }: any) => {
    setBet(amount);
    setDifficulty(difficulty);
    setTxStatus('Checking network...');
    try {
      await checkNetwork();
      setTxStatus('Sending transaction...');
      await placeBet(signer, nickname, amount);
      setTxStatus('Bet placed!');
      const b = generateBoard(difficulty);
      const p = generatePath();
      setBoard(b);
      setPath(p);
      setPosition(0);
      setStep(0);
      setProfit(0);
      setAccumulatedMult(1);
      setMultHistory([]);
      setGameActive(true);
      setLost(false);
      setDice1(null);
      setDice2(null);
      setMessage(null);
      setCanBet(false);
      if (account) {
        fetchBalance(provider, account);
      }
    } catch (e) {
      setTxStatus('Transaction error');
    }
  };

  const animateMove = async (from: number, move: number, path: {x:number, y:number}[], board: BoardCell[][]) => {
    let lose = false;
    let msg = '';
    let finalPos = from;
    for (let i = 1; i <= move; i++) {
      const pos = (from + i) % path.length;
      setPosition(pos);
      finalPos = pos;
      await new Promise(res => setTimeout(res, 400));
    }
    const { x, y } = path[finalPos];
    const cell = board[y][x];
    let newMultHistory = [...multHistory];
    if (cell.type === 'mult') {
      newMultHistory.push(cell.value);
    }
    let newAccumulatedMult = 1;
    const multCounts: Record<string, number> = {};
    newMultHistory.forEach(val => {
      multCounts[val] = (multCounts[val] || 0) + 1;
    });
    let sumPrir = 0;
    let count2x = 0;
    Object.entries(multCounts).forEach(([val, count]) => {
      const mult = parseFloat(val.replace('x', ''));
      if (mult === 2) {
        count2x += count;
      } else {
        sumPrir += (mult - 1) * count;
      }
    });
    if (count2x > 0) {
      newAccumulatedMult = (1 + sumPrir) + Math.pow(2, count2x) - 1;
    } else {
      newAccumulatedMult = 1 + sumPrir;
    }
    let newProfit = 0;
    if (cell.type === 'snake') {
      try { new Audio('/sounds/Snake.mp3').play(); } catch {}
      lose = true;
      msg = 'You landed on a snake! Bet lost.';
      setLost(true);
      setGameActive(false);
      setProfit(0);
      setAccumulatedMult(1);
      setMultHistory([]);
      setMessage(msg);
      clearActiveGame();
      setGameHistory(h => [...h, {
        date: new Date().toLocaleString(),
        bet,
        difficulty,
        mult: accumulatedMult.toFixed(2),
        profit: 0,
        result: 'lose',
      }]);
    } else {
      setAccumulatedMult(newAccumulatedMult);
      setMultHistory(newMultHistory);
      newProfit = Number(bet) * newAccumulatedMult;
      setProfit(newProfit);
      setMessage('');
    }
    return { lose, newProfit, msg };
  };

  const handleRoll = async () => {
    if (!gameActive || !path || !board || rolling) return;
    setRolling(true);
    try { new Audio('/sounds/Roll.mp3').play(); } catch {}
    let final1 = getRandomInt(1, 6);
    let final2 = getRandomInt(1, 6);
    for (let i = 0; i < 10; i++) {
      setDice1(getRandomInt(1, 6));
      setDice2(getRandomInt(1, 6));
      await new Promise(res => setTimeout(res, 60));
    }
    setDice1(final1);
    setDice2(final2);
    let move = final1 + final2;
    const { lose, newProfit, msg } = await animateMove(position, move, path, board);
    setStep(s => s + 1);
    setLost(lose);
    setGameActive(!lose && step + 1 < 5);
    setMessage(lose ? msg : (step + 1 >= 5 ? `Round finished! Your profit: ${newProfit.toFixed(4)} STT` : `Rolled: ${final1} + ${final2} = ${move}`));
    setRolling(false);
  };

  const handleCashout = async () => {
    setGameActive(false);
    setTxStatus('Checking network...');
    setCashoutPending(true);
    try {
      await checkNetwork();
      setTxStatus('Payout...');
      const roundedProfit = Number(profit).toFixed(3);
      const tx = await cashout(signer, roundedProfit);
      setTxStatus('Waiting for transaction confirmation...');
      await tx.wait();
      setTxStatus('Payout sent successfully!');
      try { new Audio('/sounds/Cashout.mp3').play(); } catch {}
      setMessage(`You cashed out: ${roundedProfit} STT. Place a new bet to continue playing.`);
      setCanBet(true);
      if (account) {
        fetchBalance(provider, account);
      }
      fetchContractBalance(provider);
      clearActiveGame();
      setGameHistory(h => [...h, {
        date: new Date().toLocaleString(),
        bet,
        difficulty,
        mult: accumulatedMult.toFixed(2),
        profit: roundedProfit,
        result: 'win',
      }]);
    } catch (e: any) {
      setTxStatus('Payout error: ' + (e?.reason || e?.message || ''));
    } finally {
      setCashoutPending(false);
    }
  };



  const handleDisconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setBalance('');
  };

  const difficulties: Array<'easy'|'medium'|'hard'|'expert'|'master'> = ['easy','medium','hard','expert','master'];
  const difficultyLabels: Record<string, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    master: 'Master',
  };

  return (
    <div className="min-h-screen bg-[#1a232b] flex flex-col items-center justify-center">
      {/* Network Warning */}
      {isWrongNetwork && isConnected && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-bold transition-opacity duration-500 flex items-center gap-2">
            <span>⚠️</span>
            <span>Please switch to Somnia Testnet (Chain ID: 50312) to play</span>
            <button 
              onClick={async () => {
                try {
                  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                  console.log('Manual check - Chain ID:', chainId);
                  setIsWrongNetwork(chainId !== '0xc488');
                } catch (error) {
                  console.error('Manual check error:', error);
                }
              }}
              className="ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              Check
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-5xl p-8 flex flex-row items-start gap-12">
        <div className="flex flex-col items-center w-full max-w-xs">
          {editingNickname ? (
            <div className="mb-2 flex gap-2 items-center">
              <input
                className="px-3 py-2 rounded bg-[#1a232b] text-white"
                placeholder="Enter nickname"
                value={inputNickname}
                onChange={e => setInputNickname(e.target.value)}
                maxLength={20}
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveNickname}
                disabled={!inputNickname}
              >
                Save
              </button>
            </div>
          ) : (
            <div className="mb-2 flex gap-2 items-center">
              <span className="text-white font-bold">{nickname || 'No nickname'}</span>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded"
                onClick={() => setEditingNickname(true)}
              >
                Change nickname
              </button>
            </div>
          )}
          <BetPanel
            onConnect={handleConnect}
            onBet={handleBet}
            isConnected={isConnected}
            balance={balance}
            onDisconnect={handleDisconnect}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="mb-2 text-sm text-blue-300 font-bold">Contract Balance: {contractBalance ? Number(contractBalance).toFixed(3) : '—'} STT</div>
          {account && (
            <div className="mb-2 text-xs text-gray-400">
              {account.slice(0, 5)}...{account.slice(-5)}
            </div>
          )}
          <div className="mb-4 text-2xl font-bold text-yellow-300">Current Multiplier: {accumulatedMult.toFixed(2)}x</div>
          {message && (
            <div className={`mb-4 text-lg font-bold ${lost ? 'text-red-400' : 'text-green-300'}`}>{
              message.replace(/(\d+\.\d{3})\d*/g, '$1')
            }</div>
          )}
          {!gameActive ? (
            <div className="mb-12">
              <div className="mb-6 text-center text-white font-bold text-lg">Preview: {difficultyLabels[difficulty]}</div>
              <div className="flex flex-col items-center">
                <GameBoard
                  board={generateBoard(difficulty)}
                  step={0}
                  position={-1}
                  path={generatePath()}
                />
              </div>
            </div>
          ) : (
            <>
              <GameBoard
                step={step}
                board={board ?? undefined}
                path={path ?? undefined}
                position={position}
                lost={lost}
                dice1={dice1}
                dice2={dice2}
              />
              {gameActive && (
                <div className="flex gap-4 mt-6">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded text-lg"
                    onClick={handleRoll}
                    disabled={step >= 5 || lost || rolling}
                  >
                    {rolling ? 'Rolling...' : 'Roll'}
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded text-lg"
                    onClick={handleCashout}
                    disabled={step === 0 || lost || rolling || cashoutPending || canBet}
                  >
                    Cashout
                  </button>
                </div>
              )}
            </>
          )}
          {txStatus && <div className="mb-2 text-sm text-yellow-300">{txStatus}</div>}

        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <HistoryPanel history={paginatedHistory} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        <div className="mt-16 flex justify-center w-full">
          <Leaderboard provider={provider} />
        </div>
      </div>
    </div>
  );
};

export default App;