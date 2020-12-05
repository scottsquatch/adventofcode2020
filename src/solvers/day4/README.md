# Day 4
## Part 1

This problem was a pretty fun one. It involves a series of passport data seperated by a blank line. Pretty straightforward problem with a minor challenge is handling newlines in the data and checking for missing fields.

Functional solution:
* String -> Data from file
* [String] -> Separate entries by double newline
* [[String]] -> Seperate key value pairs by newline or space
* [[[String]]] -> Separate keys and values by colon
* [Passport a] -> Turn array of pairs into passport object
* [Passport a] -> Filter out passports that are missing props

In order to filter the passports, we are using `every` and ` in `.

## Part 2

This one was also pretty straightforward, just needed to make sure to be strict on the rules. I had accidentally seen some posts on reddit about cases not being shown in the example so I made **very** sure to pay attention to the rules. For example the rules that have 4 digits and {other_rule}, the code makes sure the digits are correct before going on. Meaning that something like 01983 would fail even though 1983 was valid.

In order to simplify the logic, I  just re-used the pipeline from part 1 with an additional check on all fields.