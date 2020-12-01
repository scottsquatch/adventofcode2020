import fs from 'fs';
import { Solver } from './types';

const solve = async (day: number): Promise<void> => {
  switch (day) {
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