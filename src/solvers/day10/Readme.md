# Day 10
## Part 1

We have a series of numbers that represent adapters. Each adapter can only be in front of another adapter given `0 <= a[i]] - a[i-1] <= 3`; where a is adapter in increasing order. Reading the problem it becomes clear that in order to maximize the number of adapters we need to order them in increasing order, then look at the differences, while keeping the differences in a map of difference to number of occurrences. Using this info we can calculate the product of 1-jolt differences and 3-jolt differences.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Map elements to parseInt -> [number]
* Append 0 for outlet -> [number]
* Add 3 to maximum element to represent handheld and append -> [number] 
* Sort in ascending order -> [number]
* Get differences by reducing the adapters array. We keep a state object to keep track of previous element and the differences map -> DifferencesState
* Select the 'diffs' property -> Map<number, number>
* Calculate the product of 1-jolt differences and 3-jolt differences -> number

  `getDifferencesProduct:: String -> number`

  ## Part 2 

Okay so now we have a pathfinding problem; where we only want to calculate the number of paths. I struggled with this one a bit because I tried to come up with a solution using a decision tree but kept running into issues with memoization: even though the method would return correct numebr without it. Once I decided to create a graph and use DFS with memoization to count paths it was solved quickly. Since we are visiting the same node over, we memoize using the adapter as the key and the paths as the value.

Creating the graph was a little tricky since I'm trying to do it psuedo-functionally. Decided to utilize a state object (again lol), which stores the adapters left and the graph. We will incrementally build it up in a reduce method where we will iterate over the items to find adapters that can be connected to the current one. This is simple because the adapters are sorted in increasing order.

Here the graph I'm using is a SimpleGraph which is just a map of adapter to list of adapters that can be attached to it.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Map elements to parseInt -> [number]
* Append 0 for outlet -> [number]
* Add 3 to maximum element to represent handheld and append -> [number] 
* Sort in ascending order -> [number]
* Create graph -> SimpleGraph<number>
* Run DFS to find number of valid arrangements -> number

  `getNumValidConfigurations:: String -> number`
