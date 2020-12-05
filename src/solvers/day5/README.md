# Day 5
## Part 1
This was another fun one! So this time we are basically using binaary search to find our position. Performing the binary search required a little thought but I realized this can be done with a reducer. 

Using a separate state object to keep track of the `high` and `low` values for binary search. Then we can have two of these objects: one for the row and another for the column. One interesting tidbit shown in the example is that the number is rounded up when setting the low value (`upper half`) and rounding down when setting the high value (`lower half`). Maybe this is always the way it is? The other interesting thing is handling the case where there are only two values left. Couldn't think of an elegant way to do this (probably revisit in the future), so I just used an if statement.

Here are the state objects
```
interface BinarySearchState {
  high: number;
  low: number;
}

interface SeatingState {
  row: BinarySearchState;
  col: BinarySearchState;
}
```

Here is a description for solution:
* String -> Read string from file
* [String] -> Split into lines
* [[String]] -> split into characters, these will be our directions
* [Object] -> Using an object in reducer, keep track of the high and low values for the binary search.
* [Number] -> convert the objects into seating IDs
* Number -> Take the maximum value.

## Part 2
Now we need to find the missing id to determine our seat. Again, couldn't think of an elegant solution so I just went with the sort and reduce. 
The accumulator will store the previous value and a match. Once we find the value that is more than 1 above the previous value.
Now I missed this part at first, but we have to subtract 1 from the current value, as that is the missing value. 

The only difference from the part 1 solution is that the final step is replace by 
* [Object] -> Value from reducer which stores the previous value and current match.
* Number -> extract the match value from the reducer object.

## Thoughts
Overall a good problem. Not trivial but not something that I was bashing my head agains the keyboard for hours. 
Also I feel like there are some interesting ways to solve this problem efficiently and look forward to reading solutions thread.