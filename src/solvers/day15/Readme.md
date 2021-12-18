# Day 15
## Part 1
Part 1 is a simple game where we one player says all of the words in the input, then afterwards the word spoken will be according to:
* 0 if the previous number had not been spoken before
* the difference of the previous two turns for which the number had been spoken

Since I'm doing more functional-ish code, I decided to split the game into two "phases". First we will say all the numbers in the input, and create a map of previous number to last turn they were spoken. Then we will take this and run the rules above: basically we just check the lastSpoken dictionary to determine the new number to be spoken. 

Holy mother of 1 off errors! The theory is not too bad, but since we are looking back at the previously spoken number there is a lot of subtraction by 1 (e.g. subtract one from turn - lastSpoken turn because we are looking at previous). After ironing this out, the solution looks like:

```
interface GameState 
{
    lastSpoken: Map<number, number>;
    turn: number;
    prev: number | undefined;
}
```
* Split input at ',' -> [String]
* Parse the strings to numbers  -> [number]
* Perform the first "phase" of the game (say the number and record prev to turn map) -> InitialGameState
* Perform the second "phase" of the game -> number

  `getNthSaidNumber:: String -> number`

## Part 2 
Alright, this is the "just do it" problem. When I saw that the number was large, I did a quick calculation on the runtime of my first problem and saw it would take about 39 minutes! Spent about an hour looking at the data and realized, hey maybe the runtime is being affected greately by the print statements and lo and behold removing them made it much faster!

However my initial implementation ran into a maximum stack depth exceeded error, so I took this to mean it couldn't be brute forced. Spent a lot of time thinking about it, then went to reddit and realized 'hey maybe I should just use a while loop'. Did that, ran it and it only took about 5 seconds with printing every 100000 entries. Technically it's kind of cheating because I'm using a while loop, however this is just to work around the limitation of nodejs, I believe many compiled languages would not run into this issue as I was using tail recursion which would most likely be transformed into a loop in the compiled code.

```
interface GameState 
{
    lastSpoken: Map<number, number>;
    turn: number;
    prev: number | undefined;
}
```
* Split input at ',' -> [String]
* Parse the strings to numbers  -> [number]
* Perform the first "phase" of the game (say the number and record prev to turn map) -> InitialGameState
* Perform the second "phase" of the game -> number

  `getNthSaidNumber:: String -> number`