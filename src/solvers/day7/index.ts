import * as fp from 'lodash/fp';
import { splitLine } from '../../utils';

interface Node 
{
  num: number;
  color: string;
}

class Graph 
{
  public map: Map<string, Array<Node>>;
  constructor() {
    this.map = new Map<string, Array<Node>>();
  }

  public get = (key: string) => {
    return this.map.get(key) || [];
  };

  public set = (key: string, val: Array<Node>) => {
    return this.map.set(key, val);
  };
}

const breakIntoNodes = fp.curry(
  (line: string) => {
    const [color, containColors] = fp.split(' bags contain ')(line);

    const getNodes = fp.compose(
      fp.filter((arr: Array<string>) => Boolean(arr[0])),
      fp.map(fp.compose(
        (arr: Array<string>) => [parseInt(arr[0], 10), arr[1] + ' ' + arr[2]],
          fp.split(' '))),
      fp.split(/ bag[s]{0,1}[,.]{1}\s*/),
    );
    return [color, getNodes(containColors)];
  }
);
export const solvePart1 = (input: string): void => {
  const search = (map: Graph, start: string): Set<string> => {
    const search_recurse = (map: Graph, queue: Array<string>, nodes: Set<string>): Set<string> => {
      const cur = queue.pop();
      if (!cur) {
        return nodes;
      }

      const neighbors = map.get(cur)
        .filter(({ color }: Node) => !nodes.has(color))
        .map(({ color }: Node) => color);
      neighbors.forEach((n: string) => nodes.add(n));
      return search_recurse(
        map,
        [...queue, ...neighbors],
        nodes
      );
    };

    return search_recurse(map, [start], new Set());
  };
  const searchFor = fp.curry((str: string, map: Graph) => search(map, str));
  const toGraph = (graph: Graph, arr: [string, Array<[number, string]>]): Graph => 
  { 
    const [source, nodes] = arr;
  
    nodes.forEach(([num, color]: [number, string]) => graph.set(color, graph.get(color).concat([{num, color: source}])));
    return graph;
  };
  
  const getBagCombinations = fp.compose(
    searchFor('shiny gold'),
    fp.reduce(toGraph, new Graph()),
    fp.map(breakIntoNodes),
    splitLine,
  );

  const answer = (getBagCombinations(input) as Set<string>).size;
  console.log('part 1 answer', answer);
};

export const solvePart2 = (input: string): void => {
  const toGraph = (graph: Graph, arr: [string, Array<[number, string]>]): Graph => 
  { 
    const [source, nodes] = arr;
  
    nodes.forEach(([num, color]: [number, string]) => graph.set(source, graph.get(source).concat([{num, color}])));
    return graph;
  };
  
  const countBags = fp.curry((color: string, graph: Graph) => {
    const getCount = fp.memoize((c: string): number => {
      const getNodes = (s: string) => graph.get(s);
      return fp.compose(
        fp.cond([
          [fp.isEmpty, fp.constant(0)],
          [fp.stubTrue, fp.reduce((total: number, {num, color}: Node) => total + num + num * getCount(color), 0)],
        ]),
        getNodes,
      )(c);
    });

    return getCount(color);
  });
  const getBagCount = fp.compose(
    countBags('shiny gold'),
    fp.reduce(toGraph, new Graph()),
    fp.map(breakIntoNodes),
    splitLine,
  );
  const answer = getBagCount(input) as number;
  console.log('part 2 answer', answer);
};