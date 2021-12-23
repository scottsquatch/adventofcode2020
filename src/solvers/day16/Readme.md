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