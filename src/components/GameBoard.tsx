import React from 'react';

const BOARD_SIZE = 4;

const ProgressDots = ({ step }: { step: number }) => (
  <div className="flex justify-center gap-2 mt-4">
    {[0, 1, 2, 3, 4].map(i => (
      <span
        key={i}
        className={`w-3 h-3 rounded-full ${i < step ? 'bg-green-400' : 'bg-gray-500'}`}
      />
    ))}
  </div>
);

interface GameBoardProps {
  step?: number;
  board?: any[][];
  path?: { x: number; y: number }[];
  position?: number;
  lost?: boolean;
  dice1?: number | null;
  dice2?: number | null;
}

const GameBoard = ({ step = 0, board, path, position = 0, lost, dice1, dice2 }: GameBoardProps) => {
  const cells = board || Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
  let playerPos: { x: number; y: number } | null = null;
  if (path && typeof position === 'number' && position < path.length) {
    playerPos = path[position];
  }
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-4 bg-[#232e38] p-10 rounded-2xl">
        {cells.flat().map((cell, idx) => {
          const x = idx % BOARD_SIZE;
          const y = Math.floor(idx / BOARD_SIZE);
          const isPlayer = playerPos && playerPos.x === x && playerPos.y === y;
          // Для пустых клеток — делаем их прозрачными
          const isEmpty = cell.type === 'empty';
          return (
            <div
              key={idx}
              className={`w-20 h-20 flex items-center justify-center rounded-xl text-white font-bold text-2xl
                ${isEmpty ? 'bg-transparent border-none opacity-30' :
                  cell.type === 'snake' ? 'bg-red-700' :
                  cell.type === 'mult' ? 'bg-[#2c3947]' :
                  cell.type === 'start' ? 'bg-blue-700' :
                  'bg-[#1a232b]'}
                ${isPlayer ? (lost ? 'ring-4 ring-red-400' : 'ring-4 ring-green-400') : ''}
              `}
            >
              {isEmpty ? '' : isPlayer ? (
                <span className="flex flex-col items-center">
                  {dice1 !== null && dice2 !== null ? (
                    <>
                      <span className="text-2xl">{dice1}</span>
                      <span className="text-2xl">{dice2}</span>
                    </>
                  ) : (
                    <span className="text-2xl">🎲</span>
                  )}
                </span>
              ) : cell.type === 'snake' ? <span className="text-3xl">🐍</span>
                : cell.type === 'mult' ? cell.value
                : cell.type === 'start' ? <span className="text-2xl">Start</span>
                : ''}
            </div>
          );
        })}
      </div>
      <ProgressDots step={step} />
    </div>
  );
};

export default GameBoard;
