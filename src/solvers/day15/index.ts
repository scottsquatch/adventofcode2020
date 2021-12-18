import * as fp from 'lodash/fp';
import { timeFunc } from '../../utils';

interface GameState 
{
    lastSpoken: Map<number, number>;
    turn: number;
    prev: number | undefined;
}

const speakNumbers = (times: number) => (prev: number, turn: number = 1, lastSpoken: Map<number, number> = new Map<number, number>()): number => {
    if (times == 0)
        return prev;

    const last = lastSpoken.get(prev);
    const speakNum = !last ? 0 : turn - last - 1;
    //console.log('turn', turn, 'speak', speakNum);
    return speakNumbers(times-1)(speakNum, turn + 1, lastSpoken.set(prev, turn - 1));
}
// Initial phase of the game where the numbers are being repeated
const speakInitialNumbers = fp.reduce(({turn, lastSpoken, prev}: GameState, num: number): GameState => {
    //console.log('turn', turn, 'speak', num);
    return {
        lastSpoken: prev === undefined 
            ? new Map<number, number>(lastSpoken) 
            : new Map<number, number>(lastSpoken).set(prev || 0, turn - 1),
        turn: turn + 1,
        prev: num,
    };
}, {lastSpoken: new Map<number, number>(), turn: 1, prev: undefined});

const getNthSaidNumber = (n: number) => fp.compose(
    ({turn, lastSpoken, prev}: GameState): number => speakNumbers(n - turn + 1)(prev || 0, turn, lastSpoken),
    speakInitialNumbers,
    fp.map(parseInt),
    fp.split(','),
);

export const solvePart1 = (input: string): void => {
    const [res, elapsed] = timeFunc(() => getNthSaidNumber(2020)(input));
    console.log('2020th number spoken is', res, 'took', elapsed, 'milliseconds');
}

export const solvePart2 = (input: string): void => {
    const getNthSaidNumberIterative = (n: number, printEveryN: number | undefined = undefined) => (str: string) => {
        let {lastSpoken, turn, prev}: GameState =  fp.compose(speakInitialNumbers, fp.map(parseInt), fp.split(','))(str);

        const print = !printEveryN ? (_j: number, _num: number) => {} : (j: number, num: number) => {
            if (j % printEveryN === 0)
                console.log('turn', j, 'speak', num);
        };
        for (let i = turn; i <= n; i++) {
            const last = lastSpoken.get(prev || 0);
            const speakNum = !last ? 0 : i - last - 1;
            print(i, speakNum);
            lastSpoken.set(prev || 0, i - 1);
            prev = speakNum; 
        }

        return prev;
    }
    const [res, elapsed] = timeFunc(() => getNthSaidNumberIterative(30000000, 1000000)(input));
    console.log('30000000th number spoken is', res, 'took', elapsed, 'milliseconds');
}