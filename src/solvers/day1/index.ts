import * as _ from 'lodash';

const target = 2020;

export const solvePart1 = (input: string): void => {
  const nums = _.map(_.split(input, '\n'), x => parseInt(x, 10));
  const numDict = _.keyBy(nums);

  const ans1 = nums.find((x: number) => numDict[target-x]);
  if (!ans1) {
    throw new Error(`could not find pair summing to ${target}`);
  }
  const ans2 = target - ans1;
  console.log('part 1 answer:', ans1 * ans2);
};

export const solvePart2 = (input: string): void => {
  const nums = _.map(_.split(input, '\n'), x => parseInt(x, 10));
  const numDict = _.keyBy(nums);

  const pairs = _.flatten(
    _.map(nums, (x: number, i: number) => 
      _.map(
        _.filter(nums, (_y: number, j: number) => j !== i ),
        (y: number) => [x, y]
      )
  )
  );

  const answers = pairs.find((pairs: Array<number>) => numDict[target - pairs[0] - pairs[1]]);
  if (!answers) {
    throw new Error(`could not find triplet that sums to ${target}`);
  }
  const [answer1, answer2] = answers;
  console.log('part 2 answer:', answer1 * answer2 * (target - answer1 - answer2));
};