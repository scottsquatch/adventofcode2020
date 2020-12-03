# adventofcode2020
Solutions to puzzles for [Advent of Code 2020](https://adventofcode.com/2020/)

## Goal
Goal for this year is to implement solutions using functional programming. Since I'm new it will probably be more functional-ish programming :D. [lodash-fp](https://github.com/lodash/lodash/wiki/FP-Guide) will see heavy use.

## Running
Simple command line utility with one option: `-d {day}`

Project requires node installed. To run:

```
npm install
npm run ts-node -- -d 1
```

## Project structure
All code is placed under `src` directory.

Code for solving the problems of the day can be found in the `day {n}` directiory in the `solvers` folder; file is `index.ts`.

Each solution is implemented as a function that takes a string and returns void, the idea here is that the answer will be printed to the screen.
 