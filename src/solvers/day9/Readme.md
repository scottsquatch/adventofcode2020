# Day 9
## Part 2

Okay so this is where I got stuck last year. I could figure out a good solution, but was having trouble translating into a functional answer. So this is a class of problem that is very common in interviewing: find x numbers that sum to value. The idea is to store the values in a map/set, iterate over elements, subtract the current value from the iterand and see if the value is in the map/set. We will need to make sure that we account for not double-counting values. Which can be done by using a frequency map to hold them: [number] -> [times that number appears in sequence]

Will need to combine above with the "sliding window" technique which prevents us from need to reiterate over list. What this means is that as we move down the list, we will remove the last value from the map and replace with the current value before moving on to check the next number. Trying an illustration here:
```
Sequence: 1->2->3->4->5->6
Current: 3, map: {1: 1,2: 1}
Check to see if 3-1 is in map (it is). Before moving onto next number we update the map to be: {2:1, 3:1}
```

As for efficiency, this would run in O(kN) time, where k is the length of the sequence (25 for this problem) and N is the length of the input. 

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Map elements to parseInt -> [number]
* Reduce elements with method findInvalidNumbers(preambleLength) -> InvalidNumberState
* Obtain the value of property `invalid` -> [number]
* Get first element -> number

  `findFirstInvalidNumber:: number -> String -> number`

  ## Part 2 
This is another common interview problem where we are finding the first sequence of length > 1 that adds to a certain number. The only difference is that at the end we need to add the minimum and maximum value. The idea is that we keep track of a 'left' pointer (index num), a 'right' pointer (index num), and the sum. Then we iterate over the array, adding the current value to the sequence (i.e. moving 'right' pointer). If the new sum is greater than target, we move the 'left' pointer to the right until the sum is equal to or less than the target. Once we have found a sum that equals the target, we are finished.

In my case I am keeping an array of the sequence in place of 'left' and 'right' pointers. Surprisingly, the code for this section is much simpler.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Split on ' ', as that separates operation from argument -> [String]
* Find the first range which sums to first invalid number -> [number]
* Add the minimum and maximum values -> number

  `findEncryptionWeakness:: Number -> String -> number`
