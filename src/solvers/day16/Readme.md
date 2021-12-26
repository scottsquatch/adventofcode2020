# Day 16
## Part 1

This is an interesting one. We are given some puzzle input where we are given some information obtained from scanning some information for tickets that we cannot read. Here we have the sections separatedx by double newlines, the parsing here is kinda gnarly but let me try to make sense of it:
* split on '\n\n' -> now we have a 3 element array of strings
* On first element (format <field_name>: <low>-<high> (or <low>-<high>)*):
    * Split on newline
    * split at ': ' to separate field name from intervals
    * for firest element leave unchanged but for second split on '-' and parse integers
    * now we have type [String, [Interval]]
* For second/third elements (format (your ticket:|nearby tickets:)\n<num1>(,<numn>)*):
    * split on newline
    * skip first element (identifier)
    * split on ',' and parse integers for elements
    * now we have type [number]

Decided to go with a simple algorithm for this one, as it seemed fast enough. Basically, for each ticket: go over the values in the ticket and find one interval for which there is no match. To help with this I flatten the field intervals and ticket values into one array, now it is just a matter of simple iteration over the intervals.

```
type Interval = [number, number];
```
* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Parse using algorithm described above -> [[String, [number, number]]], [[number]], [[number]]
* Remove the first element of the array (your ticket') -> [[String, [number, number]], [[number]]]
* flatten the intervals and nearby tickets values, then iterate over all ticket values and return any that don't match any intervals -> [number]
* sum -> number

  `getErrorRate:: String -> number`

## Part 2 

Alright so the wrinkle for this problem is that we have to find the field for each column, then give a product of all departure fields on our ticket.

So the main challenge is how to determine which fields corresponds to which column. Initial idea was to take the fields, run through one column, determine which field(s) match, if one field then we found the field for this column, otherwise we put this column and fields at the back of a queue. One thing to remember is that once we know which field corresponds to a column we will need to remove it from the candidate list of other columns. But then I realized that since the number of tickets is much greater than the number of fields it would be more efficient to iterate over the tickets once.

To do this, the algorithm would be similar but we would keep an array of field candidates per column. Now we iterate over the tickets, and with each ticket we go over the candidate fields and remove any that don't match the value from a ticket. Again we will need to account for the case where we remove a field from other column's candidates once we know the column. After debugging a long time I discovered that I need to do this recursively, as if we have two candidates for a column and we remove one, now we have a scenario where we know the field corresponding to the column.

So we have the invalid ticket code from part1, we can put this together with algorithm above, and perform the filtering and product code, which is pretty trivial.

```
type Interval = [number, number];
```
* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Parse using algorithm from part 1 -> [[number],[number],[String, [number, number]]]
* Remove the invalid tickets using algorithm from part 1 -> [[number],[number], [String, [number, number]]]
* Find which field corresponds to each column (from above), and return zipped with ticket so that next step is easier -> [[number, [String, Array<Interval>]]
*  Obtain the product of only the fields that start with 'departure' from my ticket -> number

  `getDepartureFieldsProduct:: String -> number`