import * as fp from 'lodash/fp';

const goDownSlope = fp.curry((down: number, right: number, input: string) => {
  const filterRows = fp.curry((down: number, cellWithIndex: [string, Array<Array<string>>]) => parseInt(cellWithIndex[0], 10) % down === 0)(down);
  const filterUpdateCols = fp.curry((down: number, right: number, cellWithindex: [string, Array<Array<string>>]) => {
    return filterCols(down, right, parseInt(cellWithindex[0], 10), cellWithindex[1].length)(cellWithindex[1]);
  })(down, right);
  const filterCols = fp.curry((down: number, right: number, row: number, width: number, cols: Array<Array<string>>) => {
    return fp.filter((pair: [string, string]) => ((row / down) * right) % width === parseInt(pair[0], 10))(cols);
  });
  return fp.compose(
    fp.filter((cellWithIndex: [string, Array<Array<string>>]) => cellWithIndex[0][1] === '#'),
    fp.map(filterUpdateCols),
    fp.filter(filterRows),
    fp.map(fp.update('1', fp.entries)),
    fp.entries,
    fp.map(fp.split('')),
    fp.split('\n'),
  )(input);
});

export const solvePart1 = (input: string): void => {
  console.log('part 1 answer:', goDownSlope(1, 3, input).length);
};

interface Trial 
{
  down: number;
  right: number;
}

export const solvePart2 = (input: string): void => {
  const trials: Array<Trial> = [
    {down: 1, right: 1},
    {down: 1, right: 3},
    {down: 1, right: 5},
    {down: 1, right: 7},
    {down: 2, right: 1},
  ];

  const runTrials = fp.map((trial: Trial) => goDownSlope(trial.down, trial.right, input));

  const product = fp.reduce((product, path: Array<Array<string>>) => path.length * product, 1);

  const getProductOfTrialPaths = fp.compose(
    product,
    runTrials,
  );

  console.log('part 2 answer', getProductOfTrialPaths(trials));
};