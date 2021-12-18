import * as fp from 'lodash/fp';
import { removeBlank, splitLine, timeFunc, toLinuxNewLines, bigLeftShift } from '../../utils';

interface DockingProgram 
{
    memory: Map<number, bigint>;
    orMask: bigint;
    andMask: bigint;
}
const memLocationRegex = new RegExp(/mem[[]([0-9]+)]/);

export const solvePart1 = (input: string) => {
    const runProgram = (prog: DockingProgram, [command, value]: [string ,string]): DockingProgram => {
        const getMasks = (mask: string, orMask: bigint = BigInt(0), andMask: bigint = BigInt(~0), bitIterator: number = 1): [bigint,bigint] => {
            const last = fp.last(mask);
            if (!last) {
                return [orMask, andMask];
            }

            const rest = mask.slice(0,-1);
            //console.log('getMasks', mask, last, orMask, andMask, num, rest);
            if (last == '1') {
                return getMasks(rest, orMask | BigInt(bitIterator), andMask, bitIterator * 2);
            } else if (last == '0') {
                return getMasks(rest, orMask, andMask & BigInt(~bitIterator), bitIterator * 2);
            }

            return getMasks(rest, orMask, andMask, bitIterator * 2);
        };

        if (command === 'mask') {
            const [orMask, andMask] = getMasks(value);
            console.log('detected mask instruction');
            console.log('orMask', prog.orMask, '->',orMask);
            console.log('andMask', prog.andMask, '->', andMask);
            return {...prog, orMask, andMask};
        }

        const match = memLocationRegex.exec(command);
        if (!match) {
            throw new Error(`command ${command} is not value`);
        }
        const loc = parseInt(match[1]);
        const num: bigint = BigInt(parseInt(value));
        const maskedVal: bigint = num & prog.andMask | prog.orMask;
        console.log('setting memory', 'loc', loc, ' to val', num, 'with mask', maskedVal);
        return {...prog,
            memory: new Map<number, bigint>(prog.memory).set(loc, maskedVal)
        };
    };
    const getSumMemoryValues = fp.compose(
        fp.sumBy('1'),
        ({memory}: DockingProgram) => Array.from(memory.entries()),
        fp.reduce(runProgram,{ memory: new Map<number, bigint>(), orMask: BigInt(0), andMask: BigInt(~0)}),
        fp.map(fp.split(' = ')),
        removeBlank,
        splitLine,
        toLinuxNewLines,
    );

    const [res, elapsed] = timeFunc(() => getSumMemoryValues(input));
    console.log('sum of all values left in memory', res, 'took', elapsed, 'milliseconds');
}

interface DecoderV2 
{
    memory: Map<bigint, bigint>;
    masks: Array<[bigint, bigint]>; // Array of [orMask, andMask]
}

export const solvePart2 = (input: string) => {
    const getMasks = (mask: string, masks: Array<[bigint, bigint]>, index: number): Array<[bigint, bigint]> => {
        if (!mask || mask.length === 0) 
            return masks;

        const last = mask.slice(-1);
        const rest = mask.slice(0, -1);
        //console.log('getMasks', mask, index, masks.map(([o, a]: [bigint,bigint]): [string,string] => [o.toString(2), a.toString(2)]));
        if (last === '0') {
            return getMasks(rest, masks, index + 1);
        } else if (last === '1') {
            return getMasks(rest, 
                !masks || masks.length === 0 
                    ? [[bigLeftShift(1, index), BigInt(~0)]]
                    : masks.map(([orMask, andMask]: [bigint, bigint]) => [orMask | bigLeftShift(1, index), andMask]),
                index + 1);
        } else {
            return getMasks(rest,
                    !masks || masks.length === 0
                        ? [[bigLeftShift(1, index), BigInt(~0)], [BigInt(0), ~bigLeftShift(1, index)]]
                        : masks.map(([orMask, andMask]: [bigint, bigint]): [bigint, bigint] => [orMask, andMask & ~bigLeftShift(1, index)]) // Set 0's at index
                            .concat(masks.map(([orMask, andMask]: [bigint, bigint]): [bigint, bigint] => [orMask | bigLeftShift(1, index), andMask])), // Set 1's at index
                    index + 1);
        }
    }
    const getSumMemoryValuesV2 = fp.compose(
        fp.sumBy('1'),
        ({memory}: DecoderV2) => { console.log(memory); return Array.from(memory.entries()); },
        fp.reduce((decoder: DecoderV2, [command, value]:[string, string]) =>{
            if (command === 'mask')  {
                const newMasks: Array<[bigint, bigint]> = getMasks(value, [], 0);        
                return { ...decoder, masks: newMasks}
            }

            const match = memLocationRegex.exec(command);
            if (!match) {
                throw new Error(`command ${command} is not value`);
            }
            const loc: bigint = BigInt(parseInt(match[1]));
            const val: bigint = BigInt(parseInt(value));
            const newMemory = new Map<bigint, bigint>(decoder.memory);
            decoder.masks.forEach(([orMask, andMask]: [bigint, bigint]) => {
                const mappedLoc: bigint = BigInt(loc) & andMask | orMask;
                if (mappedLoc < BigInt(0)) {
                    throw new Error('mapped location cannot be less than 0');
                }
                console.log('setting memory', 'loc', mappedLoc, 'to val', val);
                newMemory.set(mappedLoc, val);
            })
            return { ...decoder, memory: newMemory};
        }, { memory: new Map<bigint, bigint>(), masks: new Array<[bigint, bigint]>()}),
        fp.map(fp.split(' = ')),
        removeBlank,
        splitLine,
        toLinuxNewLines
    ) 
    const [res, elapsed] = timeFunc(() => getSumMemoryValuesV2(input));
    console.log('sum of all values left in memory using v2 of decoder', res, 'took', elapsed, 'milliseconds');
}
