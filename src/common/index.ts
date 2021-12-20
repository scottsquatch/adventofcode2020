import * as fp from 'lodash/fp';
import { GameOfLifeCellState, GameOfLifeState } from '../solvers/types';
import { toKeys, toValues } from '../utils';

export const getCoordinateRange = (min: Array<number>, max: Array<number>): Array<Array<number>> => {
        if (min.length === 0 || max.length === 0) return [[]];
        const minFirstDimension = min[0];
        const maxFirstDimension = max[0];
        const subsetRange = getCoordinateRange(min.slice(1), max.slice(1));

        return fp.flatMap((num: number): Array<Array<number>> => fp.map(fp.concat([num]))(subsetRange))
            (fp.range(minFirstDimension, maxFirstDimension+1));
    }

export const addCoords = (a: Array<number>, b: Array<number>): Array<number> => fp.compose(
    fp.map(fp.sum),
    fp.zip(b)
)(a);

export const runGameOfLifeSimulation = (cycles: number) => (initial: GameOfLifeState, 
        nearbyCoordinateMapGenerator: (state: GameOfLifeState) => Map<string, Array<Array<number>>>,
        nextCellState: (state: GameOfLifeCellState, activeNeighbors: number) => GameOfLifeCellState): GameOfLifeState => {
    if (initial.maxCoords.length !== initial.minCoords.length) throw new Error(`Expected max and min coordinates to have same length`);
    const dimension = initial.maxCoords.length;
    // Get all coordinates (with delta 1-unit) between two coordinates
    

    // Run simulation to determine activate/non-activated cubes at one time step
    const runSimulation = (state :GameOfLifeState, nearbyCoordinateMap: Map<string, Array<Array<number>>>): GameOfLifeState => {
        // Create a map of position => number of adjacent activated cells
        let activatedCellMap: Map<string, number> = fp.compose(
                fp.reduce(
                    (actMap: Map<string, number>, coordinate: Array<number>): Map<string, number> => {
                        const nextMap = actMap;
                        const cellState = state.pointMap.get(JSON.stringify(coordinate)); 
                        if (cellState === undefined) throw new Error(`could not find state for cell at coordinate: ${JSON.stringify(coordinate)}`);
                        
                        if (cellState !== GameOfLifeCellState.Active) return nextMap; 

                        // Take an existing map of postion to # of surrounding activated cubes and update
                        const updateActMap = (map: Map<string, number>, pos: Array<number>): Map<string, number> => {
                            const key = JSON.stringify(pos);
                            return map.set(key, (map.get(key) || 0) + 1);
                        }

                        return fp.compose(
                            fp.reduce(updateActMap, nextMap),
                            (c: Array<number>) => nearbyCoordinateMap.get(JSON.stringify(c)) || [],
                        )(coordinate);
                },
                new Map<string, number>()),
                fp.map(JSON.parse),
                toKeys,
        )(state.pointMap);

        //console.log('activated cell map',activatedCellMap, state.pointMap.get(JSON.stringify([2,2,0])));

        const nextState: GameOfLifeState = fp.compose(
            fp.reduce(({pointMap,maxCoords,minCoords}: GameOfLifeState, coordinate: Array<number>): GameOfLifeState => {
                const key = JSON.stringify(coordinate);
                const cellState = state.pointMap.has(key) 
                    ? state.pointMap.get(key) 
                    : GameOfLifeCellState.Inactive;// Since we start the search outside of current coordinates, we might not have match
                if (cellState === undefined) throw new Error(`could not find state for cube at ${JSON.stringify(coordinate)}`);
                const next = nextCellState(cellState, activatedCellMap.get(key) || 0);
                //console.log('coordinate', coordinate, 'state', state, 'next', next, 'cubes', cubes);
                if (next === GameOfLifeCellState.Active) {
                    pointMap.set(key, next);
                } else {
                    pointMap.delete(key);
                }
                return {
                    pointMap,
                    maxCoords: next === GameOfLifeCellState.Active
                        ? fp.compose(
                            fp.map(fp.max),
                            fp.zip(coordinate)
                        )(maxCoords)
                        : maxCoords,
                    minCoords: next === GameOfLifeCellState.Inactive
                        ? fp.compose(
                            fp.map(fp.min),
                            fp.zip(coordinate)
                        )(minCoords)
                        : minCoords,
                };
            }, { pointMap: new Map<string, GameOfLifeCellState>(), minCoords: fp.map(_ => parseInt('NaN'))(fp.range(0,dimension)), maxCoords: fp.map(_ => parseInt('NaN'))(fp.range(0,dimension))}),
            ({maxCoords, minCoords}: GameOfLifeState): Array<Array<number>> => getCoordinateRange(
                addCoords(minCoords, fp.times(fp.constant(-1), dimension)),
                addCoords(maxCoords, fp.times(fp.constant(1), dimension))),)
            (state);

        //console.log('after nextstate', state.pointMap.get(JSON.stringify([2,2,0])));
        return nextState;
    };

    if (cycles === 0) {
        return initial;
    }

    const numActive = fp.compose(
        fp.size,
        fp.filter(fp.equals(GameOfLifeCellState.Active)),
        toValues,
        fp.get('pointMap')
    );
    const nextStateObj = runSimulation(initial, nearbyCoordinateMapGenerator(initial));
    console.log('cycles left', cycles, 'num active before', numActive(initial), 'num active after', numActive(nextStateObj));
    return runGameOfLifeSimulation(cycles-1)(
        nextStateObj,
        nearbyCoordinateMapGenerator,
        nextCellState
    );
};