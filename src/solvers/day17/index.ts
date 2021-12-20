import * as fp from 'lodash/fp';
import { explodeChars, splitLine, timeFunc, /*toEntries,*/ toKeys, toLinuxNewLines, toValues } from '../../utils';
import { 
    getCoordinateRange as getCoordinateRangeN,
    addCoords as addCoordsN,
    runGameOfLifeSimulation
 } from '../../common';
import { GameOfLifeCellState, GameOfLifeState } from '../types';

interface Coordinate3D {
    x: number;
    y: number;
    z: number;
}

type CubeState = '#' | '.';


interface CubeGame {
    cubes: Map<string, CubeState>;
    minCoordinates: Coordinate3D ; // Minimum values for corrdinates of cubes map
    maxCoordinates: Coordinate3D; // Maximum values for corrdinates of cubes map
}

const getCubeState = (char: string): CubeState => {
    if (char !== '.' && char !== '#') {
        throw new Error(`Invalid character for cube state ${char}`);
    }

    return char as CubeState;
}

const toCubesMap = fp.reduce((seats: Map<string, CubeState>, [coordinate, char]: [Coordinate3D, string]): Map<string, CubeState> => {
            return new Map(seats).set(JSON.stringify(coordinate), getCubeState(char));
        }, 
        new Map<string, CubeState>());

const addCoordinateToCube = fp.reduce((arr2d: Array<Array<[Coordinate3D, string]>>, line: string): Array<Array<[Coordinate3D, string]>> => {
        const y = (arr2d.length === 0 ? -1 : arr2d[arr2d.length - 1][0][0].y) + 1;
        const cells = fp.compose(
            fp.reduce((arr: Array<[Coordinate3D, string]>, seat: string): Array<[Coordinate3D, string]> => {
                const x = (arr.length === 0 ? -1 : arr[arr.length-1][0].x) + 1;
                return arr.concat([[
                    {
                        x,
                        y,
                        z: 0 // For initial game we start in 2d-plane
                    },
                    seat
                ]]);
            }, new Array<[Coordinate3D, string]>()),
            explodeChars
        )(line);

        return arr2d.concat([
            cells
        ]);
    }, new Array<Array<[Coordinate3D, string]>>());

const makeCubeGame = (lines: Array<string>): CubeGame => {
    const cubes = fp.compose(
        toCubesMap,
        fp.flatten,
        addCoordinateToCube
    )(lines);
    const coords: Array<Coordinate3D> = fp.map(JSON.parse)(Array.from(cubes.keys()));
    const minCoordinates: Coordinate3D = {
        x: fp.minBy((coord: Coordinate3D) => coord.x)(coords)?.x || 0,
        y: fp.minBy((coord: Coordinate3D) => coord.y)(coords)?.y || 0,
        z: fp.minBy((coord: Coordinate3D) => coord.z)(coords)?.z || 0,
    };
    const maxCoordinates: Coordinate3D = {
        x: fp.maxBy((coord: Coordinate3D) => coord.x)(coords)?.x || 0,
        y: fp.maxBy((coord: Coordinate3D) => coord.y)(coords)?.y || 0,
        z: fp.maxBy((coord: Coordinate3D) => coord.z)(coords)?.z || 0,
    };
    return {
        minCoordinates,
        maxCoordinates,
        cubes
    };
}
// Get all coordinates (with delta 1-unit) between two coordinates
const getCoordinateRange = ({x: minX, y: minY, z: minZ}: Coordinate3D, {x: maxX, y: maxY, z: maxZ}: Coordinate3D): Array<Coordinate3D> => 
fp.flatMap((x: number) => 
    fp.flatMap((y: number) => 
        fp.map((z: number) => { return {x,y,z};})
        (fp.range(minZ,maxZ+1)))
    (fp.range(minY,maxY+1)))
(fp.range(minX,maxX+1))

const getCubesString = ({cubes,minCoordinates, maxCoordinates}: CubeGame) => {
    return '\n' + fp.compose(
        fp.join('\n'),
        fp.map(([z, coords]: [string, Array<Coordinate3D>]): string => {
            return `z=${z}\n` + fp.compose(
                    fp.join('\n'),
                    fp.flatMap(
                        fp.compose(
                            fp.join(''),
                            fp.map((coord: Coordinate3D): CubeState | undefined => { 
                                return cubes.get(JSON.stringify(coord));
                            })
                        )
                    ),
                    fp.groupBy('y'))(coords) + '\n\n';
        }),
        fp.toPairs,
        fp.groupBy('z'),
        fp.sortBy([
            ({z}: Coordinate3D) => z,
            ({y}: Coordinate3D) => y,
            ({x}: Coordinate3D) => x,
        ])
    )(getCoordinateRange(minCoordinates, maxCoordinates));
}
// All coordinates for a 1 unit space around point
const DIRS: Array<Coordinate3D> = fp.filter(({x,y,z}: Coordinate3D) => x !== 0 || y !== 0 || z !== 0)
(getCoordinateRange({x: -1, y: -1, z: -1}, {x: 1, y: 1, z: 1}));

const isValidPoint = (_c: Coordinate3D) => true;

const addCoords = ({x, y, z}: Coordinate3D, {x: dx, y: dy, z: dz}: Coordinate3D): Coordinate3D => {
    return {
        x: x + dx,
        y: y + dy,
        z: z + dz,
    };
}
// Create a map of coordinate to adjacent coordinates
const getAdjacentCoordinates = ({minCoordinates, maxCoordinates}: CubeGame): Map<string, Array<Coordinate3D>> => {
    const getAdjacent = (coord: Coordinate3D): Array<Coordinate3D> => fp.compose(
        fp.filter(isValidPoint),
        fp.map((delta: Coordinate3D): Coordinate3D => addCoords(coord, delta)),
    )(DIRS);

    const addAdjacentToMap = (map: Map<string, Array<Coordinate3D>>, coord: Coordinate3D): Map<string, Array<Coordinate3D>> => 
        map.set(JSON.stringify(coord), getAdjacent(coord));

    return fp.compose(
        fp.reduce(addAdjacentToMap, new Map<string, Array<Coordinate3D>>()),
    )(getCoordinateRange(minCoordinates, maxCoordinates));
}

const runNSimulations = (times: number, nearbyCoordinateMapGenerator: (game: CubeGame) => Map<string, Array<Coordinate3D>>, nextCubeState: (state: CubeState, activatedNieghbors: number) => CubeState) => (lines: Array<string>): number => {
        if (!lines || lines.length == 0) return 0;

        // Run simulation to determine activate/non-activated cubes at one time step
        const runSimulation = (game :CubeGame, nearbyCoordinateMap: Map<string, Array<Coordinate3D>>): CubeGame => {
            // Create a map of position => number of adjacent activated cubes
            let activatedCubeMap: Map<string, number> = fp.compose(
                    fp.reduce(
                        (actMap: Map<string, number>, coordinate: Coordinate3D): Map<string, number> => {
                            const nextMap = actMap;
                            const state = game.cubes.get(JSON.stringify(coordinate)); 
                            if (!state) throw new Error(`could not find state for cube at (${coordinate.x},${coordinate.y},${coordinate.z})`);
                            
                            if (state !== '#') return nextMap; 

                            // Take an existing map of postion to # of surrounding activated cubes and update
                            const updateActMap = (map: Map<string, number>, pos: Coordinate3D): Map<string, number> => {
                                const key = JSON.stringify(pos);
                                return map.set(key, (map.get(key) || 0) + 1);
                            }

                            return fp.compose(
                                fp.reduce(updateActMap, nextMap),
                                (c: Coordinate3D) => nearbyCoordinateMap.get(JSON.stringify(c)) || [],
                            )(coordinate);
                    },
                    new Map<string, number>()),
                    fp.map(JSON.parse),
                    toKeys,
            )(game.cubes);

            const nextState: CubeGame = fp.compose(
                fp.reduce(({cubes,maxCoordinates,minCoordinates}: CubeGame, coordinate: Coordinate3D): CubeGame => {
                    const key = JSON.stringify(coordinate);
                    const state = game.cubes.get(key) || '.'; // Since we start the search outside of current coordinates, we might not have match
                    if (!state) throw new Error(`could not find state for cube at (${coordinate.x},${coordinate.y},${coordinate.z})`);
                    const next = nextCubeState(state, activatedCubeMap.get(key) || 0);
                    //console.log('coordinate', coordinate, 'state', state, 'next', next, 'cubes', cubes);
                    return {
                        cubes: cubes.set(key, next),
                        maxCoordinates: {
                            x: isNaN(maxCoordinates.x) || coordinate.x > maxCoordinates.x ?  coordinate.x : maxCoordinates.x,
                            y: isNaN(maxCoordinates.y) || coordinate.y > maxCoordinates.y ?  coordinate.y : maxCoordinates.y,
                            z: isNaN(maxCoordinates.z) || coordinate.z > maxCoordinates.z ?  coordinate.z : maxCoordinates.z,
                        },
                        minCoordinates: {
                            x: isNaN(minCoordinates.x) || coordinate.x < minCoordinates.x ?  coordinate.x : minCoordinates.x,
                            y: isNaN(minCoordinates.y) || coordinate.y < minCoordinates.y ?  coordinate.y : minCoordinates.y,
                            z: isNaN(minCoordinates.z) || coordinate.z < minCoordinates.z ?  coordinate.z : minCoordinates.z,
                        }
                    };
                }, { cubes: new Map<string, CubeState>(), minCoordinates: {x: parseInt('NaN'), y: parseInt('NaN'), z: parseInt('NaN')}, maxCoordinates: {x: parseInt('NaN'), y: parseInt('NaN'), z: parseInt('NaN')}}),
                ({maxCoordinates, minCoordinates}: CubeGame): Array<Coordinate3D> => getCoordinateRange(
                    addCoords(minCoordinates, {x:-1,y:-1,z:-1}),
                    addCoords(maxCoordinates, {x:1,y:1,z:1})))
                (game)

            return nextState;
        }

        const numActivatedCubes = ({cubes}: CubeGame) => fp.compose(
            fp.size,
            fp.filter(fp.equals('#')),
            toValues,
        )(cubes);

        const runNSimulationRecurse = (n: number) => (game :CubeGame): CubeGame => {
            if (n <= 0) {
                return game;
            }

            return runNSimulationRecurse(n-1)(
                runSimulation(game, nearbyCoordinateMapGenerator(game)),
            );
        };

        return fp.compose(
            numActivatedCubes,
            (game: CubeGame) => { console.log(getCubesString(game)); return game; },
            runNSimulationRecurse(times),
            makeCubeGame,
        )(lines);
    };

export const solvePart1 = (input: string): void => {
    const nextCubeState = (state: CubeState, nearbyActive: number): CubeState => {
        if (state === '#') {
            return [2,3].includes(nearbyActive) ? '#' : '.';
        } else {
            return nearbyActive === 3 ? '#' : '.';
        }
    }
    const getActiveCubes = (cycles: number) => fp.compose(
        runNSimulations(cycles, getAdjacentCoordinates, nextCubeState),
        splitLine,
        toLinuxNewLines
    )
    const [res, elapsed] = timeFunc(() => getActiveCubes(6)(input));
    console.log('Cubes left after six cycles', res, 'took', elapsed, 'milliseconds');
}

const makeGameOfLifeState = (dimension: number) => (lines: Array<string>): GameOfLifeState => {
    const addCoordinateToCell = fp.reduce((arr2d: Array<Array<[Array<number>, string]>>, line: string): Array<Array<[Array<number>, string]>> => {
        const y = (arr2d.length === 0 ? -1 : arr2d[arr2d.length - 1][0][0][1]) + 1;
        const cells = fp.compose(
            fp.reduce((arr: Array<[Array<number>, string]>, cellState: string): Array<[Array<number>, string]> => {
                const x = (arr.length === 0 ? -1 : arr[arr.length-1][0][0]) + 1;
                return arr.concat([[
                    fp.concat([x, y])(fp.times(fp.constant(0), dimension - 2)),
                    cellState
                ]]);
            }, new Array<[Array<number>, string]>()),
            explodeChars
        )(line);

        return arr2d.concat([
            cells
        ]);
    }, new Array<Array<[Array<number>, string]>>());
    const toGameOfLifeState = fp.reduce((pointMap: Map<string, GameOfLifeCellState>, [coordinate, char]: [Array<number>, string]): Map<string, GameOfLifeCellState> => {
            if (char === '.') { 
                return pointMap;
            }
            return new Map(pointMap).set(JSON.stringify(coordinate), GameOfLifeCellState.Active);
        }, 
        new Map<string, GameOfLifeCellState>());
    const pointMap = fp.compose(
        toGameOfLifeState,
        fp.flatten,
        addCoordinateToCell
    )(lines);
    const coords: Array<Array<number>> = fp.map(JSON.parse)(Array.from(pointMap.keys()));
    const minCoords: Array<number> =
        fp.map(
            (idx: number): number => (fp.minBy((c: Array<number>) => c[idx])(coords)|| [])[idx]
        )(fp.range(0, dimension));
    const maxCoords: Array<number> =
        fp.map(
            (idx: number): number => (fp.maxBy((c: Array<number>) => c[idx])(coords)|| [])[idx]
        )(fp.range(0, dimension));

    return {
        minCoords,
        maxCoords,
        pointMap
    };
};

export const solvePart2 = (input: string): void => {
    const getAdjacentCoordinatesNDimension = (dimension: number) => ({minCoords, maxCoords}: GameOfLifeState): Map<string, Array<Array<number>>> => {
        const getAdjacent = fp.memoize((coord: Array<number>): Array<Array<number>> => {
            const dirs = fp.filter(
                fp.any(fp.negate(fp.equals(0))))(
                    getCoordinateRangeN(
                        fp.times(fp.constant(-1), dimension),
                        fp.times(fp.constant(1), dimension)));
            const coords = fp.map((dir: Array<number>) => addCoordsN(coord, dir))(dirs as Array<Array<number>>);
            return coords;
        });

        const addAdjacentToMap = (map: Map<string, Array<Array<number>>>, coord: Array<number>): Map<string, Array<Array<number>>> => 
            map.set(JSON.stringify(coord), getAdjacent(coord));

        return fp.compose(
            fp.reduce(addAdjacentToMap, new Map<string, Array<Array<number>>>()),
        )(getCoordinateRangeN(minCoords, maxCoords));
    };

    const nextCellState = (state: GameOfLifeCellState, activeNeighbors: number): GameOfLifeCellState => {
        if (state === GameOfLifeCellState.Active) {
            return [2, 3].includes(activeNeighbors) ? GameOfLifeCellState.Active : GameOfLifeCellState.Inactive;
        } else {
            return activeNeighbors === 3 ? GameOfLifeCellState.Active : GameOfLifeCellState.Inactive;
        }
    }
    /*
    const getGameOfLifeString = ({pointMap,minCoords, maxCoords}: GameOfLifeState) => {
        return '\n' + fp.compose(
            fp.join('\n'),
            fp.map(([z, coords]: [string, Array<Array<number>>]): string => {
                return `z=${z}\n` + fp.compose(
                        fp.join('\n'),
                        fp.flatMap(
                            fp.compose(
                                fp.join(''),
                                fp.map((coord: Array<number>): string | undefined => { 
                                    return pointMap.get(JSON.stringify(coord)) === GameOfLifeCellState.Active ? '#': '.';
                                })
                            )
                        ),
                        fp.groupBy('1'))(coords) + '\n\n';
            }),
            fp.toPairs,
            fp.groupBy('2'),
            fp.sortBy([
                '2',
                '1',
                '0'
            ])
        )(getCoordinateRangeN(minCoords, maxCoords));
    }
    */
    const getActiveCubes = (cycles: number) => fp.compose(
        fp.size,
        fp.filter(fp.equals(GameOfLifeCellState.Active)),
        toValues, 
        fp.get('pointMap'),
        (state: GameOfLifeState) => runGameOfLifeSimulation(cycles)(state, getAdjacentCoordinatesNDimension(4), nextCellState),
        makeGameOfLifeState(4),
        splitLine,
        toLinuxNewLines,
    );

    const [res, elapsed] = timeFunc(() => getActiveCubes(6)(input));
    console.log('Cubes left after six cycles (4-D case)', res, 'took', elapsed, 'milliseconds');
}