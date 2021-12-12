import _ from 'lodash';
import * as fp from 'lodash/fp';
import { removeBlank, splitLine, timeFunc, toLinuxNewLines } from '../../utils'

export const solvePart1 = (input: string): void => {
    const calculateTimeDeparturePair = (time: number) => (bus: number): [number, number] => [ bus, bus - time % bus];
    const calcBusMinutesProduct = ([bus, departure]: [number, number]): number => departure * bus;
    const getEarliestBusMinutesProduct = fp.compose(
        calcBusMinutesProduct,
        fp.minBy(fp.last),
        fp.spread(fp.useWith((time: number, busses: Array<number>): Array<[number,number]> => fp.map(calculateTimeDeparturePair(time))(busses), [parseInt, fp.compose(
            fp.map(parseInt),
            fp.filter(fp.negate(fp.equals('x'))),
            fp.split(',')
        )])),
        removeBlank,
        splitLine,
        toLinuxNewLines
    );
    const [res, elapsed] = timeFunc(() => getEarliestBusMinutesProduct(input));
    console.log('ID of earliest bus multiplied by the number of minutes',res, 'took', elapsed, 'milliseconds');
}

export const solvePart2 = (input: string): void => {
    const getTimestampFoMatchingBusOffset = fp.compose(
        fp.first,
        fp.reduce(([time, step]: [number, number], [index, bus]: [number,number]) => {
            time ||= 0;
            step ||= 1;
            console.log('finding next timestamp of offset match for', 'time', time, 'step', step, 'bus', bus, 'index', index);
            const findNextTimestamp = (timestamp: number, modifier: number, routeTime: number): number => {
                if ((timestamp + modifier) % routeTime === 0) {
                    return timestamp;
                }

                return findNextTimestamp(timestamp + step, modifier, routeTime);
            }
            const nextTime = findNextTimestamp(time + step, index, bus);
            console.log('found next timestamp for offset match', 'of bus', bus, 'at', nextTime);
            return [nextTime, step*bus];
        }, []),
        fp.map(([idx,val]: [number, string]): [number, number] => [idx, parseInt(val)]),
        fp.filter(([_idx, val]: [number, string]) => val !== 'x'),
        fp.reduce((arr: Array<[number, string]>, val: string) => arr.concat([
            [
                (fp.last(arr) || [-1])[0]  + 1,
                val
            ]]), []),
        fp.split(','),
        fp.get('1'),
        removeBlank,
        splitLine,
        toLinuxNewLines,
    );
    const [res, elapsed] = timeFunc(() => getTimestampFoMatchingBusOffset(input));
    console.log('Earliest timestamp such that all bus IDs depart at offsets matching thier positions in list', res, 'took', elapsed, 'milliseconds');
}