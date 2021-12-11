import * as fp from 'lodash/fp';
import { splitLine, timeFunc, removeBlank, explodeChars, toLinuxNewLines, getRowColRange, toMap } from '../../utils';
//import { stdout } from 'process';

interface Position {
    row: number;
    column: number;
}

type SeatState = 'L' | '.' | '#';
interface Seat {
    position: Position;
    state: SeatState;
}

/*
const printSeats = (seats: Array<Seat>): void => {
    seats.forEach(({position: { row, column }, state}: Seat): void => {
        if (row !== 0 && column === 0) {
            stdout.write('\n');
        }
        stdout.write(state);
    });
    stdout.write('\n');
}
*/

interface Plane {
    seats: Map<string, Seat>;
    rows: number;
    columns: number;
}

const getSeatState = (char: string): SeatState => {
    if (char !== '.' && char !== '#' && char !== 'L') {
        throw new Error(`Invalid character for seat state ${char}`);
    }

    return char as SeatState;
}

const toSeatMap = fp.reduce((seats: Map<string, Seat>, [position, char]: [Position, string]): Map<string, Seat> => {
            return new Map(seats).set(JSON.stringify(position), { position, state: getSeatState(char)});
        }, 
        new Map<string, Seat>());

const addPositionToSeat = fp.reduce((arr2d: Array<Array<[Position, string]>>, line: string): Array<Array<[Position, string]>> => {
        const row = (arr2d.length === 0 ? -1 : arr2d[arr2d.length - 1][0][0].row) + 1;
        const cells = fp.compose(
            fp.reduce((arr: Array<[Position, string]>, seat: string): Array<[Position, string]> => {
                const column = (arr.length === 0 ? -1 : arr[arr.length-1][0].column) + 1;
                return arr.concat([[
                    {
                        row,
                        column
                    },
                    seat
                ]]);
            }, new Array<[Position, string]>()),
            explodeChars
        )(line);

        return arr2d.concat([
            cells
        ]);
    }, new Array<Array<[Position, string]>>());

const makePlane = (lines: Array<string>): Plane => {
    let rows:number = lines.length;
    let columns:number = lines[0].length;
    console.log('seating with rows', rows, 'and columns', columns);
    return {
        rows,
        columns,
        seats: fp.compose(
            toSeatMap,
            fp.flatten,
            addPositionToSeat
        )(lines)
    };
}
const DIRS: Array<Position> = [{row: -1, column: -1}, {row: -1, column: 0}, {row: -1, column: 1},
    {row: 0, column: -1}, {row: 0, column: 1},
    {row: 1, column: -1}, {row: 1, column: 0}, {row: 1, column: 1}];
const isValidPoint = (rows: number, columns: number) => ({row, column}: Position): boolean => row >= 0 && row < rows && column >= 0 && column < columns;
// Create a map of seat to adjacent seats
const getAdjacentSeats = ({rows, columns}: Plane): Map<string, Array<Position>> => {
    const getAdjacent = ({row, column}: Position): Array<Position> => fp.compose(
        fp.filter(isValidPoint(rows, columns)),
        fp.map(({row: drow, column: dcolumn}: Position): Position => { return {row: row + drow, column: column + dcolumn}})
    )(DIRS);

    const addAdjacentToMap = (map: Map<string, Array<Position>>, pos: Position): Map<string, Array<Position>> => 
        map.set(JSON.stringify(pos), getAdjacent(pos));

    return fp.compose(
        fp.reduce(addAdjacentToMap, new Map<string, Array<Position>>()),
    )(getPositions(rows, columns));
}

const getSeatsString = (rows: number, columns: number) => 
        fp.compose(
            fp.join('\n'),
            fp.map(fp.join('')),
            fp.chunk(columns),
            (m: Map<string, Seat>): Array<string> => fp.map(([row, column]: [number, number]): string => m.get(JSON.stringify({row, column}))?.state || '')(getRowColRange(rows, columns))
        );

const getPositions = (rows: number, columns: number) => fp.map(
    ([row, column]: [number, number]) => { return {row, column}; }
)(getRowColRange(rows, columns));
// Obtain the number of occupied seats once everyone finds their seat. 
// seatMapGenerator -> function which returns map of serialized position to positions which will be looked at when determining whether to occupy/de-occupy a seat
const getOccupiedSeats = fp.curry((nearbySeatsMapGenerator: (plane: Plane) => Map<string, Array<Position>>, maxOccupiedVisibleSeats: number, lines: Array<string>): number => {
        if (!lines || lines.length == 0) return 0;

        let rows:number = lines.length;
        let columns:number = lines[0].length;
        let positions = getPositions(rows, columns);
        console.log('seating with rows', rows, 'and columns', columns);
        
        // Run a simulation step which will update occupied seats
        const runSimulation = (seats: Map<string, Seat>, seatMap: Map<string, Array<Position>>): Map<string, Seat> => {
            // Create a map of position => number of adjacent occupied seats
            let occupiedSeatMap: Map<string, number> = fp.reduce(
                (adjMap: Map<string, number>, position: Position): Map<string, number> => {
                    const nextMap = adjMap;
                    const state = seats.get(JSON.stringify(position))?.state; 
                    if (!state) throw new Error(`could not find state for seat with row ${position.row} and column ${position.column}`);
                    
                    if (state !== '#') return nextMap; 

                    // Take an existing map of postion to # of surrounding occupied seats and update
                    const updateAdjacentMap = (map: Map<string, number>, pos: Position): Map<string, number> => {
                        const key = JSON.stringify(pos);
                        return map.set(key, (map.get(key) || 0) + 1);
                    }

                    return fp.compose(
                        fp.reduce(updateAdjacentMap, nextMap),
                        (p: Position) => seatMap.get(JSON.stringify(p)) || [],
                    )(position);
                },
                new Map<string, number>()
            )(positions);

            const nextSeats: Map<string, Seat> = fp.reduce((map: Map<string, Seat>, position: Position): Map<string, Seat> => {
                const key = JSON.stringify(position);
                const state = seats.get(key)?.state;
                if (!state) throw new Error(`could not find state for seat with row ${position.row} and column ${position.column}`);
                let next: Seat;
                if (state === 'L' && (occupiedSeatMap.get(key) || 0) === 0) {
                    next =  { position, state: '#' }; // No adjacent occupied seats
                } else if (state === '#' && (occupiedSeatMap.get(key) || 0) >= maxOccupiedVisibleSeats) {
                    next = { position, state: 'L' }; // Too many adjacent occupied seats
                } else {
                    next =  { position, state };
                }
                return map.set(key, next);
            }, new Map<string, Seat>())(positions);

            return nextSeats;
        }

        const numOccupiedSeats = (seats: Map<string, Seat>) => fp.compose(
            fp.size,
            fp.filter((position: Position) => seats.get(JSON.stringify(position))?.state === '#')
        )(positions)

        const findStasis = (plane: Plane, seatMap: Map<string, Array<Position>>, seen: Set<string> = new Set<string>()): Map<string,Seat> => {
            console.log('\nrun simulation');
            console.log('num taken seats before', numOccupiedSeats(plane.seats), '\n');
            const nextSeats = runSimulation(plane.seats, seatMap);
            console.log('num taken seats after', numOccupiedSeats(nextSeats), '\n');
            const currentState = getSeatsString(rows, columns)(plane.seats);
            const nextState = getSeatsString(rows, columns)(nextSeats);
            //printSeats(nextSeats);
            if (currentState === nextState) { // Found stasis
                return nextSeats;
            } else if (seen.has(nextState)) {
                throw new Error("Found duplicate, something is wrong");
            }
            return findStasis({...plane, seats: nextSeats}, seatMap, new Set(seen).add(nextState));
        }


        return fp.compose(
            numOccupiedSeats,
            (plane: Plane): Map<string,Seat> => findStasis(plane, nearbySeatsMapGenerator(plane)),
            makePlane,
        )(lines);
    });


const getFirstSeatLOSMap = ({seats, rows, columns}: Plane): Map<string, Array<Position>> => {
    const getFirstSeatInDirections = (seatMap: Map<string, Seat>) => { 
        const getFirstSeatInDirectionsRecurses = (position: Position, dirs: Array<Position> = DIRS): Array<Position> => {
            if (!dirs || dirs.length === 0) return [];

            const getFirstSeatInDirection = (p: Position, dir: Position): Position | undefined => {
                if (!p || !dir) return undefined; 

                const state = seatMap.get(JSON.stringify(p))?.state;
                if (!state) return undefined;  // We have out of bounds position, no seat
                if (state !== '.') return p; // Found seat

                // Found floor, continue searching in direction
                return getFirstSeatInDirection({row: p.row + dir.row, column: p.column + dir.column}, dir);
            };

            const nextDir = dirs[0];
            const nextSeat = getFirstSeatInDirection({row: position.row + nextDir.row, column: position.column + nextDir.column}, nextDir);
            const ans = nextSeat ? [nextSeat] : [];
            return ans.concat(getFirstSeatInDirectionsRecurses(position, dirs.slice(1)));
        }

        return getFirstSeatInDirectionsRecurses;
    }

    return fp.compose(
        toMap(JSON.stringify, getFirstSeatInDirections(seats)),
    )(getPositions(rows, columns));
}

export const solvePart1 = (input: string) => {
    const [res, elapsed] = timeFunc(() => fp.compose(
        getOccupiedSeats(getAdjacentSeats, 4),
        removeBlank,
        splitLine
    )(input));
    console.log('Number of occupied seats: ', res, 'Elapsed time in ms', elapsed);
}

export const solvePart2 = (input: string) => {
    const [res, elapsed] = timeFunc(() => fp.compose(
        getOccupiedSeats(getFirstSeatLOSMap, 5),
        removeBlank,
        splitLine,
        toLinuxNewLines,
    )(input));
    console.log('Number of occupied seats using line of sight rules', res, 'Elapsed time in ms', elapsed);
}