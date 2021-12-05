import * as _ from 'lodash';
import * as fp from 'lodash/fp';

export const combinations = <T>(n: number, arr: Array<T>): Array<Array<T>> => {
  const combinationsRecurse = (n: number, arr: Array<T>): Array<Array<T>> => {
    if (n === 0) return [[]];
    else if (n === 1) return _.chunk(arr, 1);

    return _.flatten(
      _.map(arr,(ele, idx) => {
        const prevcombinations = combinationsRecurse(n-1, _.slice(arr, idx + 1, arr.length));
        const combined = _.map(prevcombinations, (el) => el.concat([ele]));
        return combined; 
      })
    );
  };

  return combinationsRecurse(n, arr);
};

export const hasAllProperties = <T extends unknown>(props: Array<string>, obj: T): boolean => props.every((prop: string) => prop in obj);

export const except = fp.curry(<T extends unknown>(item: T) => fp.reject(fp.eq(item)));

export const splitLine = fp.split('\n');

export const removeBlank = fp.remove((line: string): boolean => !line || line === '');

export const splitSpacedLines = fp.split('\n\n');

export const reduceFirstElement = <T extends unknown>(accumulator: (accum: T, val: T) => T): fp.LodashReduce1x3<T, T | undefined> => fp.reduce((a: T | undefined, v: T) => a ? accumulator(a, v) : v, undefined);

export const print = <T extends unknown>(val: T): T => {
  console.log(val);
  return val;
}

export const sum = (arr: Array<number>): number => arr.reduce((t: number, v: number) => v + t);

export const timeFunc = <T extends unknown>(func: () => T): [T, number] => {
  const start = new Date().getTime();
  var res = func();
  const elapsed = new Date().getTime() - start;
  return [res, elapsed];
}