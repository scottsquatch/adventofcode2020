# Day 3
## Part 1

Alright this day gave me a bit of trouble. So the problem involves taking a 2D field, mapping a route based on a slope, then looking at how many of a certain character are encountered.
As a participant of Advent of Code for the past two years, this kind of problem has become very familiar to me :). 

First challenge: The map repeats infinitely to the right. Since the map is the same we can just use modulus to "wrap around" the map. 

Second challenge: How the heck do we get the index of a collection using lodash-fp? Most of the methods just take a function with one parameter (the value). Googling led to a workaround using [convert to remove the cap on number of arguments](https://github.com/lodash/lodash/issues/2387) however I was unable to get this working with [@types/lodash](https://www.npmjs.com/package/@types/lodash). Instead I went with one of the solutions mentioned in the thread using `entries`. 

Alright now on to the meat of the problem. First thought was to map the input to an array of rows and columns, picking the ones in the path, and then filtering the tree characters (`#`). However, this proved challenging when using `entries` because it transforms an array into a 2-d array where the first entry is the index and second entry is the data.

Another thought was just to serialize the map into a 1-d array and convert the index to row and column. After an hour of this approach I realized this wouldn't work becuase there wasn't a clean way to perform the "wrap-around" logic when the path enters the duplicated map. So I decided to go back to the first approach.

So after a bunch of banging on the keyboard the solution became:
* String -> Read the file
* [String] -> split the file by newline, giving us the rows
* [[String]] -> split the rows into character array
* [[String,[String]]] -> Add the indexes for rows
* [[String,[String,[String]]]] -> Add the indexes for columns 
* [[String,[String,[String]]]] -> Take only rows for the path, which are those divisible by the `down` value given in the problem.
* [[[String,String]]] -> Okay this one gave me a bunch of trouble. What I wanted to do was simply filter the columns for the paths, but once again was running into problems. Ended up using a combination of `curry`, `filter`, and `map`. The innermost array will have row in the first position and "cell character" (i.e. tree or empty) in the second position. 
* [[[String,String]]] -> Keep only the "tree" cells, as that is what is desired by the problem.

This was all wrapped up in a `curry` so that I can set the row and column when using the method. 

Not very clean, but it gets the job done. Definitely showed I need to spend (a lot) more time studying fp.

## Part 2

This part was trivial since I decided to make part 1 usuable with different down and right values. 

* [Object {Number, Number}] -> This is the array of configurations used to pass to method from part 1.
* [[[[String,String]]]] -> The result of running part 1 for the inputs
* Number -> Simply performed a reduce which multiplies the length of the paths. Tried to make this general but struggled with Typescript typing.