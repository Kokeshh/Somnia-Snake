import React, { useState, useEffect } from 'react';
import BetPanel from './components/BetPanel.tsx';
import GameBoard from './components/GameBoard.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import { generateBoard, generatePath, BoardCell } from './utils/gameLogic.ts';
import { connectWallet, placeBet, cashout, getContractBalance, resetBet, changeNickname } from './utils/contract.ts';
import { ethers } from 'ethers';

export default function App() {
  return <div style={{color: 'red', fontSize: 32, textAlign: 'center', marginTop: 100}}>Test render</div>;
}