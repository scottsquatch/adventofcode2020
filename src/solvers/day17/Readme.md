# Day 17
## Part 1
Reading this problem we can see that this is another game of life problem, with a couple of differences:
* We are working in a 3-dimensional coordinate system
* Coordinates are unbound
* We are running a fixed amount of cycles

Actually just copy/pasted by solution from day 11 and modified it to work. One notable change is that now the method for determining when to activate/deactivate is an input to the function runNSimulations. This should help with generalization in the future.
Another notable change is that we are going 1 unit outside of the current minimum and maximum coordinates, in case we need to activate a cube outside the current range; as coordinates are unbound.

```
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
```
* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Make CubeGame -> CubeGame
* Run 6 simulations using recursion and return number of activated cubes -> number
    * Run Simulation -> CubeGame
        * Create map of position to number of activated cubes -> CubeGame
        * Loop over the cube map and determine which cubes need to be deactivated/activated -> CubeGame
* Filter activated cubes by looping over values of cubemap -> [CubeState]
* return size of array above -> number

  `getActiveCubes:: String -> number`

## Part 2 
Not much to say about this one, this time we are just doing the problem in 4 dimensions instead of 3. In order to do this I added some common code to take the coordinates as an array of numbers, in this case 0 index would be x coordinate, 1 would be y coordinate, 2 would be z coordinate, and 3 would be w coordinate. Solution was not very efficient at all (~1 minute to complete), however I ran out of steam to optimize. 

```
export enum GameOfLifeCellState {
  Active,
  Inactive
};

export interface GameOfLifeState {
  pointMap: Map<string, GameOfLifeCellState>; 
  maxCoords: Array<number>;
  minCoords: Array<number>;
}
```
* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Make GameOfLifeState -> GameOfLifeState
* Run 6 simulations using recursion and return number of activated cubes -> number
    * Run Simulation -> GameOfLifeState
        * Create map of position to number of activated cubes -> GameOfLifeState
        * Loop over the cube map and determine which cubes need to be deactivated/activated -> GameOfLifeState
* Filter activated cubes by looping over values of cubemap -> [GameOfLifeState]
* return size of array above -> number

  `getActiveCubes:: String -> number`
