# Day 14
## Part 1
We are given a list of "set" instructions that are considered a program. We can either set the value of a bitmask or set a memory address (using the aforementioned bitmask) value. 

For the mask we are either setting a 1, setting a 0, or leaving the value alone. Since a bitwise and can set a 0 at a bit position and a bitwise or can set a 1 at a location, I realized this can be implemented by keeping two integers: one for setting 0's (and) and the other for setting 1's (or). This works because if we or'ing a value with 1, it will always be 1 as 1 or 0 is 1 and 1 or 1 is also one. Similarily, if and'ing a value with 0: 1 and 0 is 0 and also 0 and 0 is 0. Taking me back to my college days a young hopeful ee major.

Now we need to have a way to actually determine the or/and values. Since we have to iterate over the mask characters anyway, I'm doing this recursively from the last character. We will keep track of 4 values:
* The remaining characters of mask
* The 'or' mask value
* The 'and' mask value
* A number representing the bit to be anded (if 1) to or mask or or'd (if 0) to and mask

Alright, so the final piece is setting the memory location. This one is more simple:
`memory[location] = value & andMask | orMask`
The andMask will set the 0's and the orMask will set the 1's.

Finally to bring it all together, the values are iterated over and we run one of the above based on whether we have a mask or mem command. One note is that I'm using bigint because using number was leading to the wrong value due to overflow.

```
interface DockingProgram 
{
    memory: Map<number, bigint>;
    orMask: bigint;
    andMask: bigint;
}
```
* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split at ' = ' so that operation is 1st and value is second -> [[String, String]]
* Run the program, using the algorithm describes above -> DockingProgram
* Get the entries of the map: [memory location, value] -> [[String, String]]
* Sum the values -> number 

  `getSumMemoryValues:: String -> number`

## Part 2 
Now we learn that there is a V2 for the decoder which changes the meaning of the mask instructions as well as the meaning. So now the mask determines the addresses to be written to where:
* 0 -> Unchanged
* 1 -> Memory address bit overwritten with 1
* x -> Memory address bit is 1 AND 0

After thinking about this a while, I realized that at each 'x' bit of a mask, we are essentially creating two branches: 
* one where we set corresponding bit to 0 
* another one where we set the corresponding bit to 1

If you look at the examples we see that for 2 'x' bits we have 4 memory addresses to write to (2^2), and for 3 'x' bits we have 8 memory addresses to write to (2^3). Using my algorithm from the previous problem I realized that this can be implemented as an array of orMask and andMask. Once again orMask is for setting 1's and andMask is for setting 0's. We will iterate over the mask bits, and once we encounter an 'x' then we take the array of andMask/orMask, append 0 to andMasks, then take another copy and append 1 to orMasks, then concatenate the two arrays. Thinking about this, we will have the desired 2^n members of the array, as we are doubling the amount of elements in the array with every 'x'. 
Here is an example:
mask = x1x0
mask bit: 0 -> maskArray = [[orMask=0,andMask=1]]
mask bit: x -> maskArray = [[orMask=10,andMask=10], [orMask=00,andMask=01]]
mask bit: 1 -> maskArray = [[orMask=110,andMask=110], [orMask=100,andMask=101]]
mask bit: x -> maskArray = [[orMask=1110,andMask=1110], [orMask=1100,andMask=1101],[orMask=0110,andMask=0110], [orMask=0100,andMask=0101]]

Now that we have this, the algorithm is mostly the same, with two main differences:
* We have an array of masks, so we iterate over masks before applying them
* We apply the masks to the memory address instead of value

Overall this was a fun problem, again bringing me back to my EE days :). But I did struggle a lot with javascript's handling of numbers. This would have been much easier in compiled languages that allow for unsigned integers.

```
interface DecoderV2 
{
    memory: Map<bigint, bigint>;
    masks: Array<[bigint, bigint]>; // Array of [orMask, andMask]
}
```
* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split at ' = ' so that operation is 1st and value is second -> [[String, String]]
* Run the program, using the algorithm describes above -> DockingProgram2
* Get the entries of the map: [memory location, value] -> [[String, String]]
* Sum the values -> number 

  `getSumMemoryValuesV2:: String -> number`