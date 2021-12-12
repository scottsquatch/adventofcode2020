export interface Solver {
 (input: string): void;
}

export class Graph<V>
{
  public map: Map<V, Array<V>>;
  constructor() {
    this.map = new Map<V, Array<V>>();
  }

  public get = (key: V): Array<V> => {
    return this.map.get(key) || [];
  };

  public set = (key: V, val: Array<V>) => {
    this.map.set(key, val);
    return this;
  };

  public keys = (): Array<V> => {
      let keys: Array<V> = [];
      let iterator = this.map.keys();
      let it = iterator.next();
      while (!it.done) {
          keys.push(it.value);
          it = iterator.next();
      }

      return keys;
  }

  public copy = (): Graph<V> => {
      let other: Graph<V> = new Graph<V>();
      let it = this.map.entries();
      let e;
      while (!(e = it.next()).done) {
        other.set(e.value[0], [...e.value[1]]);
      }

      return other;
  }
}

export interface Point {
  x: number;
  y: number;
}