import fs from 'fs';
import { Solver } from './types';
import * as day1 from './day1';
import * as day2 from './day2';
import * as day3 from './day3';
import * as day4 from './day4';
import * as day5 from './day5';
import * as day6 from './day6';
import * as day7 from './day7';
import * as day8 from './day8';
import * as day9 from './day9';
import * as day10 from './day10';
import * as day11 from './day11';
import * as day12 from './day12';
import * as day13 from './day13';
import * as day14 from './day14';
import * as day15 from './day15';
import * as day16 from './day16';
import * as day17 from './day17';

const solve = async (day: number): Promise<void> => {
  switch (day) {
    case 1:
      await doSolve(1, day1.solvePart1, day1.solvePart2);
      break;
    case 2:
      await doSolve(2, day2.solvePart1, day2.solvePart2);
      break;
    case 3:
      await doSolve(3, day3.solvePart1, day3.solvePart2);
      break;
    case 4:
      await doSolve(4, day4.solvePart1, day4.solvePart2);
      break;
    case 5:
      await doSolve(5, day5.solvePart1, day5.solvePart2);
      break;
    case 6:
      await doSolve(6, day6.solvePart1, day6.solvePart2);
      break;
    case 7:
      await doSolve(7, day7.solvePart1, day7.solvePart2);
      break;
    case 8:
      await doSolve(8, day8.solvePart1, day8.solvePart2);
      break;
    case 9:
      await doSolve(9, day9.solvePart1, day9.solvePart2);
      break;
    case 10:
      await doSolve(10, day10.solvePart1, day10.solvePart2);
      break;
    case 11:
      await doSolve(11, day11.solvePart1, day11.solvePart2);
      break;
    case 12:
      await doSolve(12, day12.solvePart1, day12.solvePart2);
      break;
    case 13:
      await doSolve(13 ,day13.solvePart1, day13.solvePart2);
      break;
    case 14:
      await doSolve(14, day14.solvePart1, day14.solvePart2);
      break;
    case 15:
      await doSolve(15, day15.solvePart1, day15.solvePart2);
      break;
    case 16:
      await doSolve(16, day16.solvePart1, day16.solvePart2);
      break;
    case 17:
      await doSolve(17, day17.solvePart1, day17.solvePart2);
      break;
    default:
      console.log(`Day ${day} is currently not handled`);
  }
};

const getFilePath = (day: number, part: number): string => `${__dirname}/../data/day${day}/part${part}.txt`;

const readFile = (path: string): Promise<string> => {
  return fs.promises.readFile(path, { encoding: 'utf-8' });
};

const doSolve = async (day: number, s1: Solver, s2: Solver): Promise<void> => {
  try {
    const [input1, input2] = await Promise.all([
      readFile(getFilePath(day, 1)),
      readFile(getFilePath(day, 2))
    ]);

    s1(input1);
    s2(input2);
  } catch (e) {
    console.error(e);
  }
};

export default solve;