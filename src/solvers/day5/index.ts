import * as fp from 'lodash/fp';

interface BinarySearchState {
  high: number;
  low: number;
}

interface SeatingState {
  row: BinarySearchState;
  col: BinarySearchState;
}

const moveUp = (state: BinarySearchState): BinarySearchState => {
  return {
    ...state,
    low: state.high - state.low > 1 
      ? Math.ceil((state.high + state.low) / 2)
      : state.high, 
  };
};

const moveDown = (state: BinarySearchState): BinarySearchState => {
  return {
    ...state,
    high: state.high - state.low > 1
      ? Math.floor((state.high + state.low) / 2)
      : state.low,
  };
};

const binaryPartition = (state: SeatingState, char: string) => {
  switch (char) {
    case 'F':
      return { 
        ...state,
        row: moveDown(state.row),
      };
    case 'B': 
      return {
        ...state,
        row: moveUp(state.row),
      };
    case 'R':
      return {
        ...state,
        col: moveUp(state.col),
      };
    case 'L':
      return {
        ...state,
        col: moveDown(state.col),
      };
    default:
      throw new Error(`char ${char} is invalid`);
  }
};

const initialState = { row: { high: 127, low: 0}, col: { high: 7, low: 0}};

const getSeatIds = fp.compose(
  fp.map((state: SeatingState) => state.row.high * 8 + state.col.high),
  fp.map(fp.reduce(binaryPartition, initialState)),
  fp.map(fp.split('')),
  fp.split('\n'),
);

export const solvePart1 = (input: string): void => {

  const getHighestSeatId = fp.compose(
    fp.max,
    getSeatIds
  );
  const answer = getHighestSeatId(input) as number;
  console.log('part 1 answer', answer);
};

interface FindSeatState {
  prev: number | undefined;
  match: number | undefined;
}

export const solvePart2 = (input: string): void => {
  
  const findSeat = fp.compose(
    fp.result('match'),
    fp.reduce(({prev, match}: FindSeatState, val: number) => {
      return { 
        prev: val,
        match: (prev && val - prev > 1) ? val - 1 : match,  
      };
    }, { prev: undefined, match: undefined}),
    fp.sortBy(fp.identity),
    getSeatIds,
  );

  const answer = findSeat(input);
  console.log('part 2 answer', answer);
};