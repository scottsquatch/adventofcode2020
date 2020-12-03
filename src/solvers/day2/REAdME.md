# Day 2
## Part 1

The problem involves parsing a series of entries and running some rules to determine the valid entries. Luckily for me, this one led quite nicely to a functional style.

Basically, we could do a series of transforms:

* Split input at newline -> [String]
* Split line into 5 items (using chars '-',' ', and ':'). -> [[String]]
* Parse each split row into PasswordLogEntry object containg min/max number, rule character, and password -> [PasswordLogEntry]
* Filter using the validation logic. -> [PasswordLogEntry]
  * This simply counts the amount of characters in password that matches the rule character and making sure it is within bounds

  `getValidPasswords:: String -> [PasswordLogEntry]`

  ## Part 2 
  
  This one is mainly the same as the first one, with the exception being the validation logic. Using the same PasswordLogEntry object from part1, but this time the first two numbers correspond to indices.

  Resuing the logic from above, the isValid method changes to:
  * Get the characters at first and seconds indices
  * The logic explained in the problem describes the `xor` operation. Here we just check if char at indices one and two equal the rule character. If the two checks match (either both true or both false) the password is invalid. If one value is equal to rule character but the other isn't then return true.

  ## Thoughts

  This was a fun one to solve! Not really that challenging but it was good to get practice developing the functional solution.