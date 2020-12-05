import * as _ from 'lodash';

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