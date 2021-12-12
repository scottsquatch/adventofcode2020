# Day 12
## Part 1
Now we are in a ship and we need to navigate to safety. We are given a list of instructions with an action (character) and a value (number). The interesting thing here is that we will also need to keep track of the boats direction in order to correctly execute the "move forward" command.

The solution is pretty straightforward, we parse the instructions, then run through them with a state object that keeps track of the current position and the direction. I opted to use unit vectors to represent the directions in an array. In the state we keep the index of the direction array so that when we "rotate" it will just be a matter of setting the index.

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Make instruction objects -> [Instruction]
* Execute Instructions -> BoatState
* Find manhattan distance -> number

  `getManhattanDistanceFromOrigin:: [String] -> number`

## Part 2 
Alright so this time we have a waypoint that determines the direction and magnitude of movement. In essence this is the same as the first problem (very similar had I opted to use a vector for the direction). A couple of differences
* All directional actions are now moving the waypoint (increasing/decreasing the magnitude)
* Rotations will now have to be done via swapping/negating x/y coordinates. 

The only changes here were in the method to execute the instructions:

* Split input at newline -> [String]
* Remove blank at the end -> [String]
* Make instruction objects -> [Instruction]
* Execute Instructions -> BoatState
* Find manhattan distance -> number


  `getManhattanDistanceFromOrigin:: [String] -> number`