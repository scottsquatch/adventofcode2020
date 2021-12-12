# Day 13
## Part 1
Ah so this is the first math question. So for the first question we want to find the bus that departs closest to a given timestamp.

We can get the first departure after timestamp by:
timestamp - (timestamp mod bus) + bus

Where timestamp is the timestamp for which we have to leave after and bus is the bus ID, which is also the amount of time it takes to run their route. 

To break this down:
* (timestamp mod bus) gives us the minutes before timestamp that the last bus left, since bus leaves at multiples of ID
* timestamp - (timestamp mod bus) gives us the timestamp that the bus last left
* timestamp - (timestamp mod bus) + bus gives us the next departure time

However for the product we find that we only need the minutes from departure, so we return bus - (timestamp mod bus) 

Now we can find the minimum value to give us the next bus that departs after a timestamp. Using an array of size 3 so that we can keep the timestamp and bus values to determine the product.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Take the two lines, pass them to a function that parses the values into ints and skips the 'x' character. Then apply equation above and return the value along with the bus and the timestamp -> [[number,number]]
* find the minimum timestamp departure value -> [number, number]
* return the product of minutes from departure time and bus -> number

  `getEarliestBusMinutesProduct:: String -> number`

## Part 2 
Now we want to find a timestamp that meets the constraint that each bus leaves at an offset indicated by their index in the input. It was nice of the author to point out that this problem could not be brute forced :).

After trying to figure out the math and looking at some outputs I was unable to come up with a solution. Thanks to [this](https://www.reddit.com/r/adventofcode/comments/kc60ri/2020_day_13_can_anyone_give_me_a_hint_for_part_2/) hint (first comment) I was able to see that we can use the product of the previous buses to help speed up the search. 

This will be a "divide and conquer" algorithm where we find the desired timestamp for a subset, then use the product of that subset to incrementally find the timestamp for the current set. Using the example:
* We start with 7, since this is the first entry we increment by 1 to find 7 as the first timestamp
* Now looking at bus 13, we know that the timestamp has to be a multiple of 7, as the 7 bus needs to depart at the timestamp. We increment by 7 until we find 77 which satisfies the offset conditions (7xa = t, and 13xb = t+1 where a and b are some integers greater than 0). 
* If we write out the equation for bus 13, we get 59xc = t + 4 = 77 + (13x7)n + 4. We know this because after the initial timestamp, the pair (7,13) will satisfy the offset condition at timestamps that are multiples of the product. The rationale behind this is that since the input is all numbers the next common multiple will be the two numbers multiplied by each other. 
* So,we can run another search where we take the last valid timestamp and increment by 13x7, until we find a new valid timestamp.
* We can continue this until we have found the result


The code for this is actually not too bad, which makes sense for this type of mathy problem.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Take the two lines, pass them to a function that parses the values into ints and skips the 'x' character -> [[number,number]]
* Run the algorithm described above, returning an array where the first element is the timestamp and the second is the product of the previous elements -> [number,number]
* return the first element -> number

  `getTimestampFoMatchingBusOffset:: String -> number`