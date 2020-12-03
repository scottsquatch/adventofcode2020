import * as _ from 'lodash';
import * as fp from 'lodash/fp';
import { combinations } from '../../utils';


/**
 * Returns a solution to the n-sum problem (i.e. find 2 numbers that sum up to 2020).
 * 
 * @param target - the target sum
 * @param n - the number of items which are required to sum to target
 */
const nSum = _.curry((target: number, n: number) => {
  interface ReduceResult {
    answer: Array<number>;
    dict: Map<number, number>;
  }
  const combos = fp.curry((n: number, arr: Array<number>) => combinations(n, arr))(n - 1);
  const reducer = (acc: ReduceResult, values: Array<number>): ReduceResult => {
    values.forEach(value => acc.dict.set(value, (acc.dict.get(value) || 0) + 1));
    const inverse = target - _.sum(values);
    if (acc.answer.length === 0 && acc.dict.get(inverse)) {
      acc.answer = values.concat(inverse);
    }
    return acc;
  };
  return fp.compose(
    fp.prop('answer'),
    fp.reduce(reducer, { answer: [], dict: new Map<number, number>() }),
    combos,
    fp.map(parseInt),
    fp.split('\n'),
  );
});

export const solvePart1 = (input: string): void => {
  const solver = nSum(2020, 2); 
  const answers = solver(input) as Array<number>;
  const answer = fp.reduce(fp.multiply, 1)(answers); 
  console.log(`part 1 answer is ${answer}`);
};

export const solvePart2 = (input: string): void => {
  const solver = nSum(2020, 3);
  const answers = solver(input) as Array<number>;
  const answer = fp.reduce(fp.multiply, 1)(answers); 
  console.log(`part 2 answer is ${answer}`);
};