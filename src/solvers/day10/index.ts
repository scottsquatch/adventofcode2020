import { assert } from 'console';
import * as fp from 'lodash/fp';
import { splitLine, removeBlank, timeFunc, print } from '../../utils';
import { Graph as SimpleGraph } from '../types';

const addToMax = fp.curry(
    (num: number, arr: Array<number>) => fp.concat((fp.max(arr) || 0) + num)(arr)
);

const parseAdapters = fp.compose(
    addToMax(3),
    fp.concat(0),
    fp.map(parseInt),
    removeBlank,
    splitLine
);

interface DifferencesState {
    prev: number;
    diffs: Map<number, number>;
}
export const solvePart1 = (input: string): void => {
    const getDifferences = ({prev, diffs}: DifferencesState, val: number): DifferencesState => {
        var diff = val - prev;
        return {
            prev: val,
            diffs: new Map(diffs).set(diff, (diffs.get(diff) || 0) + 1)
        };
    }

    const diffProduct = (m: Map<number, number>): number => (m.get(1) || 0) * (m.get(3) || 0);

    const getDifferencesProduct = fp.compose(
        diffProduct,
        print,
        fp.get('diffs'),
        fp.reduce(getDifferences, {prev: 0, diffs: new Map()}),
        fp.sortBy(fp.identity),
        parseAdapters
    );

    const [res, elapsed] = timeFunc(
        () => getDifferencesProduct(input)
    );

    console.log('Number of 1-jolt differences multiplied by number of 3-jolt differences ', res, 'Elapsed ms', elapsed);
}

interface CreateGraphState {
    items: Array<number>;
    graph: SimpleGraph<number>;
}

export const solvePart2 = (input: string): void => {
    const getNumValidConfigurations = (graph: SimpleGraph<number>): number => {
        let memo = new Map<number, number>();
        const numPaths = (node: number, end: number, graph: SimpleGraph<number>): number => {
            if (node === undefined) {
                return 0;
            } else if (node === end) {
                return 1;
            }

            console.log('visit', node);
            if (memo.has(node)) {
                const val = (memo.get(node) || 0);
                console.log('already visited, num paths:', val);
                return val;
            }
            const neighbors = graph.get(node);
            let paths = 0;
            for (let i = 0; i < neighbors.length; i++) {
                paths += numPaths(neighbors[i], end, graph);
            }

            memo.set(node, paths);
            return paths;
        }

        const adapters = graph.keys();
        return numPaths(adapters[0], adapters[adapters.length-1], graph);
    }

    const createGraph = (adapters: Array<number>): SimpleGraph<number> => {
        const reduceToState = (state: CreateGraphState, val: number): CreateGraphState => {
            assert(val === state.items[0], 'expected first element of items to be current val');
            const c = state.items[0];
            const items = state.items.slice(1);

            let neighbors = [];
            let i = 0;
            while (items[i] - c < 4 && items[i] - c > 0) {
                neighbors.push(items[i]);
                i++;
            }

            return {
                items,
                graph: state.graph.copy().set(c, neighbors)
            };
        }

        return fp.compose(
            fp.get('graph'),
            fp.reduce(reduceToState, {items: adapters, graph: new SimpleGraph<number>()}) 
        )(adapters);
    }

    const [res, elapsed] = timeFunc(() => fp.compose(
        getNumValidConfigurations, 
        createGraph,
        fp.sortBy(fp.identity),
        parseAdapters)(input));


    console.log('Number of combinations (DFS)', res, 'Elapsed ms', elapsed);
}