import fs from 'fs';
import { Solver } from './types';
import * as day1 from './day1';
import * as day2 from './day2';
import * as day3 from './day3';
import * as day4 from './day4';
import * as day5 from './day5';

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