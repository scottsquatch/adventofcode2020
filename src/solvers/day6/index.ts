import * as fp from 'lodash/fp';
import { except, splitLine, splitSpacedLines, reduceFirstElement } from '../../utils';

export const solvePart1 = (input: string): void => {
  const getCounts = fp.map(
    fp.compose(
      fp.size,
      except('\n'),
      fp.uniq,
    ),
  );
  const getSumOfCounts = fp.compose(
    fp.sum,
    getCounts,
    splitSpacedLines,
  );

  const answer = getSumOfCounts(input);
  console.log(answer);
};

export const solvePart2 = (input: string): void => {
  const reduceIntersect = reduceFirstElement((accum: Array<string>, val: Array<string>) => fp.intersection(accum, val));
  const getCounts = fp.map(
    fp.compose(
      fp.size,
      reduceIntersect,
      fp.map(fp.toArray),
      splitLine,
    ),
  );
  const getSumOfCounts = fp.compose(
    fp.sum,
    getCounts,
    splitSpacedLines,
  );

  const answer = getSumOfCounts(input);
  console.log(answer);
};

