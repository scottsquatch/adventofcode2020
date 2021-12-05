import { assert } from 'console';
import * as fp from 'lodash/fp';
import { splitLine, removeBlank, timeFunc, sum } from '../../utils';

interface InvalidNumbersState {
    preamble: Array<number>;
    // Dictionary map of preamble for quicker searching
    preambleMap: Map<number, number>;
    invalid: Array<number>;
}

const initialState = () => {
    return {
        preamble: new Array<number>(),
        preambleMap: new Map(),
        invalid: new Array<number>(),
    }
};

const findInvalidNumbers = fp.curry(
        (premableLength: number, {preamble, preambleMap, invalid}: InvalidNumbersState, val: number): InvalidNumbersState => {
        let clonedMap = new Map(preambleMap);
        if (preamble.length < premableLength) {
            clonedMap.set(val, (preambleMap.get(val) || 0) + 1);
            return {
                preamble: preamble.concat(val),
                preambleMap: clonedMap,
                invalid
            };
        }

        const hasComplement = (v: number): boolean => {
            const comp = val - v;
            const mapVal = preambleMap.get(comp)
            return mapVal !== undefined && mapVal > 0 && (mapVal > 1 || comp !== val);
        }
        if (!preamble.some(hasComplement)) {
            invalid = invalid.concat(val);
        }

        // Remove first val
        const first = preamble[0];
        clonedMap.set(first, (clonedMap.get(first) || 0) - 1);
        const firstMapVal = clonedMap.get(first);
        if (firstMapVal !== undefined && firstMapVal < 1) {
            clonedMap.delete(first);
        }

        return {
            preamble: preamble.slice(1).concat(val),
            preambleMap: clonedMap.set(val, (clonedMap.get(val) || 0) + 1),
            invalid
        };
    });

const findFirstInvalidNumber = fp.curry(
    (preambleLength: number) => fp.compose(
        fp.first,
        fp.get('invalid'),
        fp.reduce(findInvalidNumbers(preambleLength), initialState()),
        fp.map(parseInt),
        removeBlank,
        splitLine
    )
);
export const solvePart1 = (input: string): void => {
    const [res, elapsed] = timeFunc(() => findFirstInvalidNumber(25)(input));

    console.log(`First number that is not the sum of two preamble numbers is ${res}, which took ${elapsed}ms to determine`);
}

interface WeaknessState {
    range: Array<number>;
    sum: number;
}
const initialWeaknessState = () => {
    return {
        range: [],
        sum: 0
    };
};
export const solvePart2 = (input: string): void => {
    // First need to find answer from part 1:
    const parse = fp.compose(
        fp.map(parseInt),
        removeBlank,
        splitLine
    );

    const findRange = fp.curry((target: number, state: WeaknessState, val: number) => {
        if (state.sum === target) {
            return {...state}; // We found it!
        }

        let sum = state.sum + val;
        let range = [...state.range, val];
        //console.log('val', val, 'target', target, 'next sum', sum);
        while (sum > target && range.length > 0) {
            const removed = range.shift() || 0;
            sum -= removed;
            //console.log('remove', removed, 'sum is now', sum);
        }
        //console.log('final sum for step', sum);
        return {
            sum,
            range
        };
    })

    const addMinMax = ({range}: WeaknessState): number => {
        if (!range || range.length < 2) {
            throw new Error(`range is invalid, expected more than 2 elements got ${range}`);
        }
        const min = fp.min(range) || 0;
        const max = fp.max(range) || 0;
        //console.log('min', min, 'max', max, 'sum', sum(range));
        return min + max;
    }

    const assertSum = fp.curry((target: number, state: WeaknessState) => {
            //console.log(state);
            assert(state.range.length > 1);
            assert(sum(state.range) === target);
            return state;
        });

    const firstInvalid: number | undefined = findFirstInvalidNumber(25)(input);
    if (firstInvalid == undefined) {
        throw new Error("could not find first invalid number");
    }

    const findEncryptionWeakness = fp.curry(
        (firstInvalid: number) => {
            return fp.compose(
                addMinMax,
                assertSum(firstInvalid),
                fp.reduce(findRange(firstInvalid), initialWeaknessState()),
                parse
            );
        }
    )

    const [res, elapsed]: [number, number] = timeFunc(() => findEncryptionWeakness(firstInvalid)(input));
    console.log(`Encryption weakness: ${res}, which took ${elapsed}ms.`);
}