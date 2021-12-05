import _ from 'lodash';
import * as fp from 'lodash/fp';
import { splitLine, removeBlank, timeFunc } from '../../utils';

type Operation = 'acc' | 'jmp' | 'nop';

interface Instruction
{
    operation: Operation;
    argument: number;
}

const runInstruction = (instructions: Array<Instruction>, ip: number, accum: number): [number, number] => {
    const inst = instructions[ip];
    switch (inst.operation) {
        case 'acc':
            return [ip + 1, accum  + inst.argument];
        case 'jmp':
            return [ip + inst.argument, accum];
        case 'nop':
            return [ip + 1, accum];
        default:
            throw new Error(`Invalid operation '${inst.operation}' at index: ${ip}`);
    };
};

const run = (instructions: Array<Instruction>, ip: number = 0, accum: number = 0): [number, number] => {
    if (ip >= instructions.length) {
        return [ip, accum];
    }

    return run(instructions, ...runInstruction(instructions, ip, accum));
}

const makeInstruction = ([op, arg]: [Operation, string]): Instruction => {
    return {
        operation: op,
        argument: parseInt(arg)
    };
};

const makeInstructions = fp.compose(
    fp.map(makeInstruction),
    fp.map(fp.split(' ')),
    removeBlank,
    splitLine
);

const findLoop = (instructions: Array<Instruction>): [number, number] => {
    const res = findLoopWithJourney(instructions);
    return [res[0], res[1]];
};

const findLoopWithJourney = (instructions: Array<Instruction>): [number, number, Array<number>] => {
    const findLoopInner = (instructions: Array<Instruction>, visited: Set<number>, journey: Array<number>, ip: number, accum: number) : [number, number, Array<number>] => {
        if (visited.has(ip) || ip >= instructions.length) {
            return [ip, accum, journey];
        }

        return findLoopInner(
            instructions, 
            new Set(visited).add(ip),
            [...journey, ip],
            ...runInstruction(instructions, ip, accum));
    }

    return findLoopInner(instructions, new Set(), [], 0, 0);
}

export const solvePart1 = (input: string): void => {
    const [ip, accum] = fp.compose(
        findLoop,
        makeInstructions
    )(input);

    console.log(`Part 1 answer is ${accum}, loop is on instruction ${ip}`);
}

export const solvePart2 = (input: string): void => {
    // Find solution by brute force: Change the next jump or nop and try again
    const fixProgramBrute = (instructions: Array<Instruction>, change: number = 0): number => {
        if (change > instructions.length) {
            throw new Error(`Program could not be fixed!`);
        }

        const inst = instructions[change];
        if (inst.operation !== 'jmp' && inst.operation !== 'nop') {
            return fixProgramBrute(instructions, change + 1);
        }

        const [ip, accum] = findLoop(
            instructions.map((v, i) => i === change 
                ? v.operation === 'nop' ? { ...v, operation: 'jmp' } :  {...v, operation: 'nop' }
                : v)
        );
        
        if (ip >= instructions.length) {
            return accum;
        }

        return fixProgramBrute(instructions, change + 1);
    }

    // Find solution by backtracking
    const fixProgramBacktrack = (instructions: Array<Instruction>, change: number = 0, changed: Set<number> = new Set()): number => {
        if (change > instructions.length) {
            throw new Error("Program could not be fixed");
            
        }

        const [ip, accum, journey] = findLoopWithJourney(
            instructions.map((v, i) => i === change 
            ? v.operation === 'nop' ? { ...v, operation: 'jmp' } :  {...v, operation: 'nop' }
            : v));
        if (ip >= instructions.length) {
            return accum;
        }

        // backtrack to find last jump
        let k = journey.pop();
        while (k && (changed.has(k) || instructions[k].operation !== 'jmp' && instructions[k].operation !== 'nop')) {
            k = journey.pop();
        }

        if (!k) {
            throw new Error("Ran out of options");
        }

        return fixProgramBacktrack(instructions, k, new Set(changed).add(change));
    }

    // Find solution by running DFS, this works on my file: it is not guaranteed to work (need to switch to BFS for guarantee).
    const fixProgramDfs = (instructions: Array<Instruction>): number => {
        const findPathRecursive = (instructions: Array<Instruction>, path: Array<[number, boolean]> = [], visited: Set<number> = new Set<number>(), swapped: boolean = false): Array<[number, boolean]> | undefined => {
            if (path[path.length - 1][0] === 0) {
                return path;
            }

            const cur = path[path.length - 1][0];
            const newVisited = new Set(visited).add(cur);
            let i:number;
            for (i = 0; i < instructions.length; i++) {
                if (newVisited.has(i)) {
                    continue;
                }
                let e = instructions[i];
                if ((e.operation === 'jmp' || (e.operation === 'nop' && !swapped)) && e.argument + i === cur) {
                    const p = findPathRecursive(instructions, [...path, [i, e.operation === 'nop']], newVisited, swapped || e.operation === 'nop');
                    if (p) {
                        return p;
                    }
                } else if ((e.operation !== 'jmp' || (e.operation === 'jmp' && !swapped)) && i + 1 === cur) {
                    const p = findPathRecursive(instructions, [...path, [i, e.operation === 'jmp']], newVisited, swapped || e.operation === 'jmp');
                    if (p) {
                        return p;
                    }
                }
            }
            return undefined;
        }

        const path = findPathRecursive(instructions, [[instructions.length, false]]);
        const swapped = path?.filter(v => v[1]);
        if (!swapped || swapped.length != 1) {
            throw new Error(`Expected number of swapped instructions to be 1, got ${swapped?.length}`);
        }
        
        return run(instructions.map((v, i) => i === swapped[0][0] 
        ? v.operation === 'nop' ? { ...v, operation: 'jmp' } :  {...v, operation: 'nop' }
        : v))[1];
    }

    const [res, bruteElapsed] = timeFunc(() => fp.compose(
        fixProgramBrute,
        makeInstructions
    )(input));

    const [resBack, backElapsed] = timeFunc(() => fp.compose(
        fixProgramBacktrack,
        makeInstructions
    )(input));

    const [resDfs, smartElapsed] = timeFunc(() => fp.compose(
        fixProgramDfs,
        makeInstructions
    )(input));

    console.log(`Accumulator result after fixing loop (brute force): ${res}. Elapsed: ${bruteElapsed}ms`);
    console.log(`Accumulator result after fixing loop (backtrack): ${resBack}. Elapsed: ${backElapsed}ms`);
    console.log(`Accumulator result after fixing loop (dfs): ${resDfs}. Elapsed: ${smartElapsed}ms`);
}