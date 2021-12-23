import * as fp from 'lodash/fp';
import { splitSpacedLines, timeFunc, toLinuxNewLines, splitLine, removeBlank } from '../../utils';

type Interval = [number, number];

/**
 * Parse into an array of three elements where:
 * first - Fields which is an array of field name, valid value ranges
 * second - Numbers on your ticket
 * third - Numbers for nearby tickets 
 * @param input - Ticket information from problem data.
 * @returns 
 */
const parse = ([fields, ticket, nearby]: [string, string, string]) => {
    const parseFields = fp.compose(
        fp.map(([name, values]: [string, string]) => [
            name,
            fp.compose(
                fp.map(fp.compose(
                    fp.map(parseInt),
                    fp.split('-')
                )),
                fp.split(' or ')
            )(values)
        ]),
        fp.map(fp.split(': ')),
        splitLine
    );
    const parseTickets = fp.compose(
        fp.map(fp.compose(
            fp.map(parseInt),
            fp.split(',')
        )),
            fp.tail,
            removeBlank,
            splitLine
        );
        return [
            parseFields(fields),
            parseTickets(ticket),
            parseTickets(nearby)
        ];
    };
const inIntervalRange = (intervals: Array<Interval>) => fp.memoize((value: number) =>
    fp.some(([lower, upper]: Interval) => 
        fp.inRange(lower, upper + 1, value))(intervals));

export const solvePart1 = (input: string) => {
    const getErrorRate = fp.compose(
        fp.sum,
        fp.spread(fp.useWith((intervals: Array<Interval>, ticketValues: Array<number>) => 
                fp.remove(inIntervalRange(intervals))(ticketValues),
            [fp.flatMap(fp.get(1)), fp.flatten])),
        fp.pullAt([1]),
        parse,
        splitSpacedLines,
        toLinuxNewLines,
    );
    const [res, elapsed] = timeFunc(() => getErrorRate(input));
    console.log('ticket scanning error rate', res, 'took', elapsed, 'milliseconds');
}

export const solvePart2 = (input: string) => {
    console.log(input);
}