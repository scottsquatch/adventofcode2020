## Day 6
## Part 1

At a high level we have groupings of strings which are separated by double newline. Withing the groupings there are subgroups separated by newline. Each member of a subgroup is a single character with value [a-z].

So first thought here is that we are looking at the union of the subgroups; simple enough. With a few tweaks to make it (hopefully) a little more efficient:

* String -> Read from file
* [String] -> Break into *groups* by splitting on double newline
* [[String]] -> Get the unique characters in the group string
* [[String]] -> Remove newline characters from match (sub-groups include newline because we didn't split them first)
* [Number] -> Get the size of the answer sets because we now have the independent characters
* Number -> Sum the size of the answer sets together to get answer.

One thing here is that instead of splitting sub-group string by newline I decided to just call uniq on the string. This saves us the extra step, thereby preventing one extra loop over the sub-groups.

## Part 2

Okay so mainly the same except here we need the intersection of the values. I am not aware of how to perform intersection of strings (lodash intersection only worked on arrays of strings), so I needed to split the sub-groups by newline and then the strings into arrays.

* String -> Read from file
* [String] -> Break into *groups* by splitting on double newline
* [[String]] -> Break into *sub-groups* by splitting on newline
* [[[String]]] -> Transform string into array of characters
* [[String]] -> Obtain the intersection of the character arrays.
* [Number] -> Get the size of the answer sets because we now have the independent characters
* Number -> Sum the size of the answer sets together to get answer.
