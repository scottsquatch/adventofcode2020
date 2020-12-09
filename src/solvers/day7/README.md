# Day 7
## Part 1

This one can be reduced to a pathfinding algorithm where we start at the end at determine all nodes that are accessible. Here the graph we are traversing is composed of bag colors, where the number is the weight. 
Initially I thought a BFS would be useful (assuming that maybe we would need to find shortest path for next question), however I realized that since we have endpoint and looking for start. Then I realized that I could just do this without and endpoint and return the colors that are accessible via endpoint. 
As always, my inspiration for these algorithms comes from [Algorithms by Robert Sedgewick and Kevin Wayne](https://algs4.cs.princeton.edu/home/). 
How to make functional? I did some reasearch and found [this](https://stackoverflow.com/questions/21074766/traversing-a-graph-breadth-first-marking-visited-nodes-in-haskell) which mentioned using inductive trees. After spending a decent amount of time wrapping my head around the concept and how to implement them in js, I decided to just "cheat". 
Basically I just created a sub method which takes the map, queue, and set of nodes which have been visited and returns the visited nodes.
For the graph to keep it simple I decided to use a map where key is a node and value is an array of [number, bag color] that reach *into* this node. This makes it easier to search from end, as we can just look at the value in the map as opposed to trying to filter a list. For type safety, I had to create a new type which serves as a wrapper for the `Map` class.

All together it becomes:
* String -> input from file
* [[String, [[number, String]]]] -> Another 'cheat' for parsing. I couldn't really figure out a clean way to handle the parsing due to the recursive nature (one color maps to multiple colors). I just created a curried method which splits on ' bags contain '. First match becomes the first element of the array, then the second becomes the result of: splitting on ` bag[s]{0,1}[,.]{1}\s*` then splitting by space, then the first match is the number but the remaining are the color values. Since the color values are multiple words (i.e. 'violet blue'), we create an array of the first element and then combine the next two with space. So we get [keycolor, [[number, valcolor]]]. 
* Graph -> Create the graph by doing graph[valcolor] = [number, keycolor].
* Set<String> -> Perform a BFS-like search that starts at 'shiny gold' and returns all the bag colors which are accessible.
* Number -> Take the size of the set.

## Part 2

Missed the prediction on this one. Here we don't need the shortest path but we need to determine the number of bags which  'shiny gold' bags can hold. Now we need to do a sum instead of returning the nodes. Now we are starting from the starting node, so to make the code simpler let's reverse the order of the graph so that it gives nodes which are *reachable* from the current node. I chose the recursive solution where we determine the bag count of the child bag(s) first. Now since I've done a couple of AoCs in the past, I just assumed that doing this the naive way would not work for part 2.
Also looking at the data I'm assuming there are a lot of duplicate bags so memoization will be an easy way to make this run faster. So this is mainly the same as the previous part with modifications for the search to return the number.

* String -> input from file
* [[String, [[number, String]]]] -> Another 'cheat' for parsing. I couldn't really figure out a clean way to handle the parsing due to the recursive nature (one color maps to multiple colors). I just created a curried method which splits on ' bags contain '. First match becomes the first element of the array, then the second becomes the result of: splitting on ` bag[s]{0,1}[,.]{1}\s*` then splitting by space, then the first match is the number but the remaining are the color values. Since the color values are multiple words (i.e. 'violet blue'), we create an array of the first element and then combine the next two with space. So we get [keycolor, [[number, valcolor]]]. 
* Graph -> Create the graph by doing graph[keycolor] = [number, valcolor].
* Set<String> -> Perform a BFS-like search that starts at 'shiny gold' and returns the sum of the child bags.
* Number -> Take the size of the set.