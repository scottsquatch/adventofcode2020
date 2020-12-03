# Day 1
## Part 1
Ah the classic sum-of-pairs interview question. This one I have seen so many times that I immediatly spit out a solution: using a HashSet, iterate over the list once storing the numbers, then iterate over the list a second time and look for `target - a`. If this value exists, we know that we have a pair that sums to the taget value. Since the problem does not say anything about order, I'm assuming that it does not matter; and in fact there was only one pair that summed to the desired value.

Trying to solve this with functional programming was giving me quite the challenge. One idea was to obtain the combinations and check the pairs. Eventuallly I gave up and just solved this using the HashSet strategy detailed above.

## Part 2
Now the ante is upped, instead of pairs we are looking for triplets that sum to a value. Once again I was not able to determine a functional way to solve this problem and ended up solving somewhat naively by creating combinations of size 2 and then using the HashSet strategy above to check for the value `target - a - b`. 

## Thoughts
So I already failed my functional journey on day 1 XD. That's okay it's a learning process and there are bound to be some bumps along the way. 

After obtaining the solutions I browsed the reddit solutions thread for day 1 and noticed that all the functional solutions were using the approach of :
* Generate all the combinations of size 2 for day 1 and size 3 for day 2
* Find the first combintation for which the sum equals 2020

This was interesting to me, maybe that was the way to do it functionally? I googled around for a more efficient approach to this problem but was unsuccessful. During the night however, I arose from my sleep with a solution: **use reduce and make the accumulator a map!**. This would have the advantage of being efficient (only traversing the list once for the pairs case) and also being functional-ish? I think it's still pure even when modifying the accumulator, because it is a method parameter. This would not work for day 2, but it did reveal a more generic algorithm:

Given `n` as the number of items which are to sum to a value (i.e. 2 for pairs or 3 for triplets).
* Generate the combinations of size `n-1`
* Call reduce, with the accumulator being of a custom type with:
  * Dictionary values (frequency map)
  * Array of size `n` which values sum to 2020. This property will be called answer.
* Add each of the items in the combination to the dictionary.
* If the answer property is filled, we are done with this pair, move onto the next.
* Check the dictionary for the value `2020 - sum(combination)`. If it is found, then we have our answer, populate the property.

Since `combinations(1)` is just the source array, this will work for both part 1 and part 2. For a more efficient solution, there is probably a way to stop the search early but I left as is so that the frequency dictionary is returned complete.

Personally I like to think of functional solutions like "pipelines", probably due to previous Linq experice. Here is the "pipeline" for the general solution going from top to bottom:

* Read string from file 
* Split string by newline
* Map to parseInt, now we have array of integers
* Generate combinations of size `n-1`. This is a curried function which is passed the combination size.
* Call the reducer to find the numbers that sum to 2020
* extract the answer field

Taking a shot at Hindley-Milner:

`nSum:: Number -> Number -> String -> [Number]`