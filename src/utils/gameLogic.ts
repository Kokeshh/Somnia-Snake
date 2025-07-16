// Генерирует маршрут: 5 вправо, 5 вниз, 5 влево, 5 вверх
export type PathCell = { x: number; y: number };
export type BoardCell =
  | { type: 'empty' }
  | { type: 'snake' }
  | { type: 'mult'; value: string }
  | { type: 'start' };

export const BOARD_SIZE = 4;

export function generatePath(): PathCell[] {
  const path: PathCell[] = [];
  // 4 вправо (y=0, x=0..3)
  for (let x = 0; x < 4; x++) path.push({ x, y: 0 });
  // 3 вниз (x=3, y=1..3)
  for (let y = 1; y < 4; y++) path.push({ x: 3, y });
  // 4 влево (y=3, x=3..0)
  for (let x = 3; x >= 0; x--) path.push({ x, y: 3 });
  // 2 вверх (x=0, y=2..1)
  for (let y = 2; y >= 1; y--) path.push({ x: 0, y });
  console.log('generatePath length:', path.length, path);
  return path;
}

function getRandomUnique(arr: number[], count: number): number[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function generateBoard(difficulty: 'easy'|'medium'|'hard'|'expert'|'master'): BoardCell[][] {
  if (difficulty === 'easy') {
    // Фиксированная структура для easy
    // Индексы path: 0..12 по часовой стрелке, начиная сверху слева
    // 0: старт, 1: 2.00x, 2: 1.30x, 3: 1.20x, 4: 1.10x, 5: 1.01x, 6: змея, 7: 1.01x, 8: 1.10x, 9: 1.20x, 10: 1.30x, 11: 2.00x, 12: 1.01x
    const fixed: BoardCell[] = [
      { type: 'start' as const },
      { type: 'mult', value: '2.00x' },
      { type: 'mult', value: '1.30x' },
      { type: 'mult', value: '1.20x' },
      { type: 'mult', value: '1.10x' },
      { type: 'mult', value: '1.01x' },
      { type: 'snake' as const }, // снова змея в правом нижнем углу
      { type: 'mult', value: '1.01x' },
      { type: 'mult', value: '1.10x' },
      { type: 'mult', value: '1.20x' },
      { type: 'mult', value: '1.30x' },
      { type: 'mult', value: '2.00x' },
      { type: 'mult', value: '1.01x' }, // снова множитель
    ];
    const board: BoardCell[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
    const path = generatePath();
    for (let i = 0; i < path.length; i++) {
      const { x, y } = path[i];
      // Если это правый нижний угол, ставим змею
      if (x === 3 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 2 && y === 3) {
        board[y][x] = { type: 'mult', value: '1.01x' };
      } else if (x === 1 && y === 3) {
        board[y][x] = { type: 'mult', value: '1.10x' };
      } else if (x === 0 && y === 3) {
        board[y][x] = { type: 'mult', value: '1.20x' };
      } else if (x === 0 && y === 2) {
        board[y][x] = { type: 'mult', value: '1.30x' };
      } else if (x === 0 && y === 1) {
        board[y][x] = { type: 'mult', value: '2.00x' };
      } else {
        board[y][x] = fixed[i];
      }
    }
    return board;
  }
  if (difficulty === 'medium') {
    const board: BoardCell[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
    const path = generatePath();
    for (let i = 0; i < path.length; i++) {
      const { x, y } = path[i];
      if (x === 1 && y === 0) {
        board[y][x] = { type: 'mult', value: '4.00x' };
      } else if (x === 2 && y === 0) {
        board[y][x] = { type: 'mult', value: '2.5x' };
      } else if (x === 3 && y === 0) {
        board[y][x] = { type: 'mult', value: '1.4x' };
      } else if (x === 3 && y === 1) {
        board[y][x] = { type: 'mult', value: '1.11x' };
      } else if (x === 3 && y === 2) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 2 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 1 && y === 3) {
        board[y][x] = { type: 'mult', value: '1.11x' };
      } else if (x === 0 && y === 3) {
        board[y][x] = { type: 'mult', value: '1.4x' };
      } else if (x === 0 && y === 2) {
        board[y][x] = { type: 'mult', value: '2.5x' };
      } else if (x === 0 && y === 1) {
        board[y][x] = { type: 'mult', value: '4.00x' };
      } else {
        board[y][x] = { type: 'start' };
      }
    }
    return board;
  }
  if (difficulty === 'hard') {
    const board: BoardCell[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
    const path = generatePath();
    for (let i = 0; i < path.length; i++) {
      const { x, y } = path[i];
      if (x === 1 && y === 0) {
        board[y][x] = { type: 'mult', value: '7.50x' };
      } else if (x === 2 && y === 0) {
        board[y][x] = { type: 'mult', value: '3.00x' };
      } else if (x === 3 && y === 0) {
        board[y][x] = { type: 'mult', value: '1.38x' };
      } else if (x === 3 && y === 1) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 2) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 2 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 1 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 0 && y === 3) {
        board[y][x] = { type: 'mult', value: '1.38x' };
      } else if (x === 0 && y === 2) {
        board[y][x] = { type: 'mult', value: '3.00x' };
      } else if (x === 0 && y === 1) {
        board[y][x] = { type: 'mult', value: '7.50x' };
      } else {
        board[y][x] = { type: 'start' };
      }
    }
    return board;
  }
  if (difficulty === 'expert') {
    const board: BoardCell[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
    const path = generatePath();
    for (let i = 0; i < path.length; i++) {
      const { x, y } = path[i];
      if (x === 1 && y === 0) {
        board[y][x] = { type: 'mult', value: '10.00x' };
      } else if (x === 2 && y === 0) {
        board[y][x] = { type: 'mult', value: '3.82x' };
      } else if (x === 3 && y === 0) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 1) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 2) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 2 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 1 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 0 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 0 && y === 2) {
        board[y][x] = { type: 'mult', value: '3.82x' };
      } else if (x === 0 && y === 1) {
        board[y][x] = { type: 'mult', value: '10.00x' };
      } else {
        board[y][x] = { type: 'start' };
      }
    }
    return board;
  }
  if (difficulty === 'master') {
    const board: BoardCell[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
    const path = generatePath();
    for (let i = 0; i < path.length; i++) {
      const { x, y } = path[i];
      if (x === 1 && y === 0) {
        board[y][x] = { type: 'mult', value: '17.64x' };
      } else if (x === 2 && y === 0) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 0) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 1) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 2) {
        board[y][x] = { type: 'snake' };
      } else if (x === 3 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 2 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 1 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 0 && y === 3) {
        board[y][x] = { type: 'snake' };
      } else if (x === 0 && y === 2) {
        board[y][x] = { type: 'snake' };
      } else if (x === 0 && y === 1) {
        board[y][x] = { type: 'mult', value: '17.64x' };
      } else {
        board[y][x] = { type: 'start' };
      }
    }
    return board;
  }
  // Новые параметры по таблице
  const snakesCount = { easy: 1, medium: 3, hard: 5, expert: 7, master: 9 }[difficulty];
  const multiplierRanges: Record<string, [number, number]> = {
    easy: [1.01, 2.00],
    medium: [1.11, 4.00],
    hard: [1.38, 7.50],
    expert: [3.82, 10.00],
    master: [17.64, 18.00],
  };
  const [minMult, maxMult] = multiplierRanges[difficulty];
  const board: BoardCell[][] = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill({ type: 'empty' }));
  const path = generatePath();

  // Случайно выбрать клетки для змей по маршруту (кроме старта)
  const snakePositions = getRandomUnique([...Array(path.length - 1).keys()].map(i => i + 1), Math.min(snakesCount, path.length - 1));

  // Генерация случайного множителя в диапазоне
  function randomMultiplier() {
    const val = Math.random() * (maxMult - minMult) + minMult;
    return val.toFixed(2) + 'x';
  }

  for (let i = 0; i < path.length; i++) {
    const { x, y } = path[i];
    if (i === 0) {
      board[y][x] = { type: 'start' };
    } else if (snakePositions.includes(i)) {
      board[y][x] = { type: 'snake' };
    } else {
      board[y][x] = { type: 'mult', value: randomMultiplier() };
    }
  }
  return board;
}

// TEMP DEBUG: Print path indices and coordinates
if (typeof globalThis !== 'undefined' && !(globalThis as any).window) {
  const path = generatePath();
  path.forEach((cell, idx) => {
    console.log(`Index ${idx}: (${cell.x},${cell.y})`);
  });
}

// TEMP: Preview all boards for all difficulties
if (typeof globalThis !== 'undefined' && !(globalThis as any).window) {
  const difficulties = ['easy', 'medium', 'hard', 'expert', 'master'] as const;
  for (const diff of difficulties) {
    // @ts-ignore
    const board = generateBoard(diff);
    console.log(`\n${diff.toUpperCase()}:`);
    for (let y = 0; y < BOARD_SIZE; y++) {
      let row = '';
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = board[y][x];
        if (cell.type === 'start') row += ' S ';
        else if (cell.type === 'snake') row += ' 🐍 ';
        else if (cell.type === 'mult') row += cell.value.padStart(5, ' ');
        else row += '   ';
      }
      console.log(row);
    }
  }
}
