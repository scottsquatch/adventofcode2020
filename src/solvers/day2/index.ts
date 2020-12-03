import * as fp from 'lodash/fp';

interface PasswordPolicy {
  first: number;
  second: number;
  char: string;
}

interface PasswordLogEntry {
  policy: PasswordPolicy;
  password: string;
}

const parseLogEntry = (args: Array<string>): PasswordLogEntry => {
  return {
    policy: {
      first: parseInt(args[0], 10),
      second: parseInt(args[1], 10),
      char: args[2],
    },
    password: args[4],
  };
};

const getLogEntries = fp.compose(
  fp.compose(
    fp.map(parseLogEntry),
    fp.map(fp.split(/[- :]/)),
  ),
  fp.split('\n'),
);

export const solvePart1 = (input: string): void => {
  const isValid = (logEntry: PasswordLogEntry): boolean => {
    const { password, policy: { first: min, second: max, char }} = logEntry;

    const validChars = password.split('').filter(x => x === char).length;
    return validChars >= min && validChars <= max;
  };

  const getValidPasswords = fp.compose(
    fp.filter(isValid),
    getLogEntries,
  );

  const validPasswords = getValidPasswords(input);
  console.log('part 1 answer:', validPasswords.length);
};

export const solvePart2 = (input: string): void => {
  const isValid = (logEntry: PasswordLogEntry): boolean => {
    const { password, policy: { first, second, char }} = logEntry;

    const [a, b] = [password.charAt(first - 1), password.charAt(second - 1)];
    return (a === char) !== (b === char); 
  };

  const getValidPasswords = fp.compose(
    fp.filter(isValid),
    getLogEntries,
  );

  const validPasswords = getValidPasswords(input);
  console.log('part 2 answer:', validPasswords.length);
}