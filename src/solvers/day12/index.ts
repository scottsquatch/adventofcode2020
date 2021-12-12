import * as fp from 'lodash/fp';
import { removeBlank, splitLine, timeFunc, toLinuxNewLines } from '../../utils';
import { Point } from '../types';

type Action = 'N' | 'S' | 'E' | 'W' | 'L' | 'R' | 'F';
interface Instruction 
{
    action: Action;
    value: number;
}

const toAction: (char: string) => Action = fp.cond([
    [(char: string) => ['N', 'S', 'E', 'W', 'L', 'R', 'F'].includes(char), (char: string): Action => char as Action],
    [fp.stubTrue, (char: string) => { throw new Error(`${char} is not a valid action`)}]
]);

const makeInstruction = (action: Action, value: number): Instruction => {
    return {
        action, 
        value
    };
};

const splitFirstLast = (line: string) => fp.concat(fp.first(line))(fp.join('')(fp.tail(line)));
const toInstruction = fp.compose(
    fp.spread(fp.useWith(makeInstruction, [toAction, parseInt])),
    fp.map(fp.join('')),
    splitFirstLast,
);

// Store points as vectors of magnitude one, here we are using a point where:
// East -> increasing along x axis
// West -> decreasing along x axis
// North -> increasing along y axis
// South -> decreasing along y axis
const EAST: Point = {x: 1, y: 0};
const WEST: Point = {x: -1, y: 0};
const NORTH: Point = {x: 0, y: 1};
const SOUTH: Point = {x: 0, y: -1};
// population directions array such that adding 90 degress is the same as adding one to index
const DIRECTIONS: [Point, Point, Point, Point] = [EAST, SOUTH, WEST, NORTH];  
interface BoatState 
{
    point: Point;
    directionIndex: number; // Index of DIRECTIONS which represents position vector
}
export const solvePart1 = (input: string): void => {
    const executeInstructions = fp.reduce(({directionIndex, point: {x, y}}: BoatState, {action, value}: Instruction) => {
        //console.log('directionIndex', directionIndex, 'x', x, 'y', y, 'action', action, 'value', value);
        switch (action) {
            case 'N': return { directionIndex, point: {x, y: y + value}};
            case 'S': return { directionIndex, point: {x, y: y - value}};
            case 'E': return { directionIndex, point: {x: x + value, y}};
            case 'W': return { directionIndex, point: {x: x - value, y}};
            case 'R': return { directionIndex: (directionIndex + value / 90) % DIRECTIONS.length, point: {x, y}};
            case 'L': return { directionIndex: Math.abs((directionIndex - value / 90 + DIRECTIONS.length) % DIRECTIONS.length), point: {x, y}};
            case 'F': return { directionIndex, point: {x: x + (DIRECTIONS[directionIndex].x * value), y: y + (DIRECTIONS[directionIndex].y * value)}};
        }
    }, {point: {x: 0, y: 0}, directionIndex: 0});

    const getManhattanDistanceFromOrigin = fp.compose(
            ({point: {x, y}}: BoatState): number => Math.abs(x) + Math.abs(y),
            executeInstructions,
            fp.map(toInstruction),
            removeBlank,
            splitLine,
            toLinuxNewLines,
        )
    const [res, elapsed] = timeFunc(() => getManhattanDistanceFromOrigin(input));

    console.log("distance from ship's starting location", res, "took", elapsed, 'milliseconds');
}

interface BoatWithWaypointState
{
    boatPoint: Point;
    waypoint: Point;
}

const rotateRight90 = (times: number) => (point: Point): Point => {
    if (times === 0) return {...point};
    return rotateRight90(times-1)({x: point.y, y: -point.x});
}
export const solvePart2 = (input: string): void => {
    const executeInstructions = fp.reduce(({boatPoint, waypoint: {x, y}}: BoatWithWaypointState, {action, value}: Instruction): BoatWithWaypointState => {
        switch (action) {
            case 'N': return { boatPoint: {...boatPoint}, waypoint: {x, y: y + value}};
            case 'S': return { boatPoint: {...boatPoint}, waypoint: {x, y: y - value}};
            case 'E': return { boatPoint: {...boatPoint}, waypoint: {x: x + value, y}};
            case 'W': return { boatPoint: {...boatPoint}, waypoint: {x: x - value, y}};
            case 'R': return { boatPoint: {...boatPoint}, waypoint: rotateRight90(value / 90)({x, y})};
            case 'L': return { boatPoint: {...boatPoint},waypoint: rotateRight90((360 - value)/90)({x, y})};
            case 'F': return { boatPoint: {x: boatPoint.x + x*value, y: boatPoint.y + y*value}, waypoint: {x, y}};
        }
    }, {boatPoint: {x: 0, y: 0}, waypoint: {x: 10, y: 1}});
    const getManhattanDistanceFromOrigin = fp.compose(
            ({boatPoint: {x, y}}: BoatWithWaypointState): number => Math.abs(x) + Math.abs(y),
            executeInstructions,
            fp.map(toInstruction),
            removeBlank,
            splitLine,
            toLinuxNewLines,
    );
    const [res, elapsed] = timeFunc(() => getManhattanDistanceFromOrigin(input));

    console.log("distance from ship's starting location", res, "took", elapsed, 'milliseconds');
}