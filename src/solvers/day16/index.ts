import * as fp from 'lodash/fp';
import { splitSpacedLines, timeFunc, toLinuxNewLines, splitLine, removeBlank, includesAny } from '../../utils';

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

/**
 * Take an array of fields, ticket values, nearby ticket values and return the invalid values in the tickets
 */
const getInvalidValues = fp.compose(
            fp.spread(fp.useWith((intervals: Array<Interval>, ticketValues: Array<number>) => 
                        fp.remove(inIntervalRange(intervals))(ticketValues),
                    [fp.flatMap(fp.get(1)), fp.flatten])),
            fp.pullAt([1]));

export const solvePart1 = (input: string) => {
    const getErrorRate = fp.compose(
        fp.sum,
        getInvalidValues,
        parse,
        splitSpacedLines,
        toLinuxNewLines,
    );
    const [res, elapsed] = timeFunc(() => getErrorRate(input));
    console.log('ticket scanning error rate', res, 'took', elapsed, 'milliseconds');
}

export const solvePart2 = (input: string) => {
    const findValidFields = (tickets: Array<Array<number>>, columnFields: Array<Array<[string, Array<Interval>]>>): Array<Array<[string, Array<Interval>]>> => {
        //console.log('tickets', tickets, 'columnfields',  columnFields);
        if (tickets.length === 0) {
            return columnFields;
        }

        const [head, tail] = [tickets[0], tickets.slice(1)];
        const zippedTicketIntervals: Array<[number | undefined, Array<[string, Array<Interval>]> | undefined]> = fp.zip(head)(columnFields);
        // Narrow down the valid fields for the given columns
        const validFields = fp.map(([value, fields]: [number | undefined, Array<[string, Array<Interval>]> | undefined]) => 
            fp.filter(([_name, intervals]: [string, Array<Interval>]) => 
                fp.some(([low, high]: [number, number]) => 
                    fp.inRange(low, high + 1, value || 0))(intervals))(fields))(zippedTicketIntervals);
        //console.log('validfields', validFields);
        // Any column which has only one potential field means we know which column this field belongs to.
        // Need to run recursively as there is a case where removing one field means we have one field left.
        const eliminateFields = (colFields: Array<Array<[string, Array<Interval>]>>): Array<Array<[string, Array<Interval>]>> => {
            const singleFieldNames: Array<string> = fp.compose(
                fp.map((fields: Array<[string, Array<Interval>]>) => fields[0][0]),
                fp.filter((fields: Array<[string, Array<Interval>]>) => fields.length === 1)
            )(colFields);
            const next = colFields.map((fields: Array<[string, Array<Interval>]>) => fields.length === 1
                ? fields
                : fp.remove(([name, _intervals]: [string, Array<Interval>]) => fp.some((n: string) => 
                    n === name)(singleFieldNames))(fields));

            if (JSON.stringify(next) === JSON.stringify(colFields)) {
                return next;
            }

            return eliminateFields(next);
        };
        const finalFields = eliminateFields(validFields);
        //console.log('final', finalFields);
        return findValidFields(tail, finalFields); 
    };
    const getDepartureFieldsProduct = fp.compose(
        fp.reduce((product: number, [ticketValue, [name, _intervals]]: [number, [string, Array<Interval>]]) => name.startsWith('departure ')
            ? ticketValue * product
            : product, 1),
        ([fields, ticket,nearby]: [Array<[string, Array<Interval>]>, Array<Array<number>>, Array<Array<number>>]) => {
            const columnFields = findValidFields(
                        fp.concat(ticket)(nearby),
                        fp.times(fp.constant(fp.cloneDeep(fields)), ticket[0].length)
                );

            console.log('fields by column', columnFields);
            return fp.zip( 
                fp.flatten(ticket))(
                fp.flatten(columnFields)
            );
        },
        (state: [Array<[String, Array<Interval>]>, Array<Array<number>>,Array<Array<number>>]) =>{
            const invalidValues = getInvalidValues(state);
            return [
                state[0],
                state[1],
                fp.remove(includesAny(invalidValues))(state[2]),
            ]
        },
        parse,
        splitSpacedLines,
        toLinuxNewLines,
    )
    const [res, elapsed] = timeFunc(() => getDepartureFieldsProduct(input));
    console.log('product of multiplying departure field values for my ticket', res, 'took', elapsed, 'milliseconds');
}