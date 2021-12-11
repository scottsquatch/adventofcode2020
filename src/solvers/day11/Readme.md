# Day 11
## Part 1

Ah the good ol game of life problem!
Here the difference is that instead of organisms we have seats on a plane. Had a lot of trouble getting around the need for having the rows and columns, so I made a psuedo-functional solution.
Originally I stored the seats as an array of seat objects which have position and state of the seat (occupied, empty, or floor stored as the corresponding character. Once I started the second question I noticed the need to store the seats in a map object. 
So I create a plane object below:
```
interface Position {
    row: number;
    column: number;
}

interface Plane {
    seats: Map<string, Seat>; // This will be JSON.stringifyed version of Position
    rows: number;
    columns: number;
}
```

I iterate over the lines and create the seats map by using a reducer that returns an Array<Array<[Position, string]>>. I'm using a little hack to determine the row/column by looking at the last element of the array. Now I will take the 2d array simply reduce to a Map<string, Seat> object. 

At this point it gets a little tricky. What I decided to do was keep a map of Position -> number of adjacent occupied seats. To do this I simply iterate over the positions, when I find an occupied seat iterate over the adjacent values and add one to the map above. Now we can just put a point into the map and quickly determine the number of adjacent seats.

Now given the original seat map and the map of position to number of adjacent occupied seats, we can run the simulation. Basically, just iterate over the positions, see if we have a seat, look at the occupied seat map above and determine if we need to change empty to occupied or vise-versa. We make sure to make the changes in a new object so that we can determine if the seating arrangement has changed. We put this in its own method and call this after getting the occupied map from above.

Finally to determine the point at which the seating arrangements don't change, or 'stasis point' as I like to call it, we just run the simulation from above until we see that the arrangement isn't changing. Then we determine the number of occupied seats by iterating over positions and determine if the seat is occupied.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Make Plane object -> [Plane]
* Find Stasis Point (recursive method) -> Map<Position, Seat>
    * Run Simulation -> Map<Position, Seat>
        * Create map of position to number of occupied seats -> Map<Position, number>
        * Loop over the seating map and determine which seats need to change -> Map<Position, Seat>
    * If it did not change return, otherwise recursive call -> Map<Position, Seat>
* Filter occupied seats by going over positions on plane -> [Position]
* return size of array above -> number

  `getOccupiedSeats:: [String] -> number`

## Part 2 
So this is generally the same problem where we just use a different algorithm for finding the occupied seats to consider when determining whether to change the seat to occupied/not occupied.

This took a long time, partly due to personal issues but mostly because I had to rethink my solution to Part 1. Initially I stored the seats as an Array. This worked great for part 1 because we were looking at only the immediately adjacent cells; this is a fixed value we can add to the current position. To determine the adjacent points I just used an internal method. I had to change the following things:
* Storing the seats as a map, which was pretty easy but just had to figure out a nice way to store number of columns and rows
* Instead of using a method to determine the adjacent points, utilize a map of position to adjacent positions
* Now move the method which generates the map of above and make this an input to getOccupiedSeats. 
* Take the number of seats needed to empty a seat as an input to getOccupiedSeats

After those changes all I had to do was determine how to get this map of position to "adjacent seats". I use the term "nearby seats", as I couldn't really think of a good generalization. Basically this would be the seats that a person will look to in order to determine whether they want to move or not. I'm making the assumption that the change between the two problems is that what is considered 'nearby'. 

Decided to make this a recursive method to determine the nearby seats. So instead of looking at the immediately adjacent cell, we are looking for the first seat in one of eight directions. Turns out these directions are exactly the same as those used in part 1 (yay!). The difference is that in the first problem we are only looking at the first value in each direction. Now we want to travel in one direction until we find a seat. I will have a method that takes in the seat map and produces a method that will give the nearby seats map. There are double nested recursive methods in order to determine the nearby seats:
* Take a position and the list of directions to travel
* if there are no more directions to travel we are done
* Otherwise take the first direction and call the recursive method below passing in the position and direction (after moving once in the direction):
    * Check if the position exists, if it doesn't return undefined (no seat to check)
    * if we find a seat ('#' or 'L') return
    * if we don't recursive call after moving in the direction one step
* If we found a point above, add it to array, otherwise don't
* concatenate value from above and recursively call the same method with the other directions


Now we can just call getOccupiedSeats with the method above and 5 as the number of seats required to empty an occupied seat.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Make Plane object -> [Plane]
* Find Stasis Point (recursive method) with getFirstSeatLOSMap and 5 as arguments -> Map<Position, Seat>
    * Run Simulation -> Map<Position, Seat>
        * Create map of position to number of occupied seats -> Map<Position, number>
        * Loop over the seating map and determine which seats need to change -> Map<Position, Seat>
    * If it did not change return, otherwise recursive call -> Map<Position, Seat>
* Filter occupied seats by going over positions on plane -> [Position]
* return size of array above -> number

  `getOccupiedSeats:: (Plane -> Map<Position, Array<Position>>), number -> number`
