# Day 8
## Part 1

After a little break I'm back at it again (almost a year later). So actually, I had solved this during my last stint but forgot to commit :(, so this is more of a 'memory-check'. 

Alright so this is the classic AOC processor emulator problem. Like the year before i expect to see a lot of reuse from this code. So apparently there is a loop in the code and its our job to find it and return the value of the accumulator. I tried to make the solution in functional style, but could only get part way there. 

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split on ' ', as that separates operation from argument -> [String]
* Parse Instruction -> [Instruction]
* Find the loop using a recursive method which keeps track of visited locations and returns when completed. Will return the loop instruction index and accumulator value -> [number, number]

  `findLoop:: String -> [number, number]`

  ## Part 2 
Alright so now we need to actually fix this loop using the assumption that the final instruction pointer points to the index immediately after the last instruction. We also know that we only need to flip `nop -> jmp` or `jmp -> nop`.

So first I thought of the brute force approach, were we look for the next `jmp` or `nop` operation, swap, and retry. This turned out to be fast enough to solve the problem (gotta love the early days), but runs in the order of O(N^2); where N is the size of instructions.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split on ' ', as that separates operation from argument -> [String]
* Parse Instruction -> [Instruction]
* Recursively, find next `nop` or `jmp`, change and then run `findLoop` from above. If the ending instruction index is the lenght of the list, then we know we don't have a loop; otherwise we move doen the list. Finally return the accumulator value -> number

  `fixProgramBrute:: String -> number`

So thinking about it a little more I decided that it could be improved by utilizing the fact that we know where the end is, so we can backtrack and determine the last `jmp` or `nop` instruction from the back. This way we don't have to bother changing instructions that are not in the path. The code is similar to the fixProgramBrute, except we are taking the code path and finding the last unvisited `jmp` or `nop` operation to change. This would run in O(Nk) time, were k is the length of the code 'journey'. 

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split on ' ', as that separates operation from argument -> [String]
* Parse Instruction -> [Instruction]
* Recursively, keep calling findLoop while changing the last `jmp` or `nop` that we haven't already tried. Once we find the change that finishes exeuction we are done -> number

  `fixProgramBacktrack:: String -> number`

After more thinking about it, I started to realize that we can take this backtrack idea a step further. Essentially this becomes another pathfinding problem; where the path is the sequence of instructions that are executed. Cheating a little bit here, I assumed that a DFS would work just because this is one of the earlier problems LOL. Technically there is no guarantee for the DFS to find the shortest path, for that we would need BFS (which would also be easier to adjust for multiple instruction changes, which will probably be a problem in a later day). Instead of creating the graph I opted to just write out the negihbor code in the recursive call. The idea is that we start at the index past the last instruction and continue to search until we find the start. We also take care to make sure we are only swapping one instruction by taking that as an input to the method. Here we are defining a neighbor as code which:
    * Can reach the current node by either normal execution (`nop` or `acc`) or via a `jmp` command, where the `jmp` would result in executing current instruction
    * Can reach the current node by either swapping a `nop` to `jmp` or vice-versa. This will only be visited if we have not already used our swap for this path.

We will search until we visit the start instruction, at which point we return. Technically the implementation would be O(N^2) time, as we are going over all the instructions again (due to lazy implementation), but in reality this was MUCH faster (almost 5x against backtrack). To remedy this I would create a graph and run the search on the graph.


* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split on ' ', as that separates operation from argument -> [String]
* Parse Instruction -> [Instruction]
* Run DFS starting from instructions.length until we reach instruction 0, keeping note of the instructions we have to change. Once we get there we run the program (with the swap) and return the accum value -> number

  `fixProgramDfs:: String -> number`

Ran a quick timing comparison of the solutions, and got below:
```
Accumulator result after fixing loop (brute force): <REDACTED>. Elapsed: 140ms
Accumulator result after fixing loop (backtrack): <REDACTED>. Elapsed: 87ms
Accumulator result after fixing loop (dfs): <REDACTED>. Elapsed: 18ms
```

Quite interesting to see how fast the imperfect DFS implementation was.

## Thoughts
As someone who went to school for electrical engineering I do have a soft spot for these types of problems, so it was nice to do this. It also was a nice 'welcome back' problem that was relatively easy to solve naively but has a lot to think about optimization wise. Ultimitely I was able to get about half-way there with the functional implementation until I gave up. Hopefully in the future I can figure out a way to solve these types of problems functionally, as I assume they will be plentiful in the future.