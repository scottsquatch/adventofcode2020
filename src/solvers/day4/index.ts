import * as fp from 'lodash/fp';
import { hasAllProperties } from '../../utils';

interface Passport {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid?: string;
}

const requiredProperties = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
];

const hasRequiredProps = fp.curry((props: Array<string>, obj: Partial<Passport>) => hasAllProperties(props, obj))(requiredProperties);
const splitPassports = fp.split('\n\n');
const splitKeys = fp.split(':');
const splitPassportPairs = fp.split(/[ \n]/);
const getPassports = fp.compose(
  fp.map(fp.fromPairs),
  fp.map(fp.map(splitKeys)),
  fp.map(splitPassportPairs),
  splitPassports,
);

const getValidPassports = fp.compose(
  fp.filter(hasRequiredProps),
  getPassports
);

export const solvePart1 = (input: string): void => {
  const answer = getValidPassports(input).length;
  console.log('part 1 answer', answer);
};

export const solvePart2 = (input: string): void => {
  const validateBirtyYear = ({ byr }: Passport): boolean => byr.length === 4 && fp.inRange(1920, 2003, parseInt(byr, 10));
  const validateIssueYear = ({ iyr }: Passport): boolean => iyr.length === 4 && fp.inRange(2010, 2021, parseInt(iyr, 10));
  const validateExpirationYear = ({ eyr }: Passport): boolean => eyr.length === 4 && fp.inRange(2020, 2031, parseInt(eyr, 10));
  const validateHeight = ({ hgt }: Passport): boolean => {
    const heightMatchCm = /^([1][0-9][0-9])cm$/.exec(hgt);
    if (heightMatchCm) {
      return fp.inRange(150, 194, parseInt(heightMatchCm[1], 10));
    }

    const heightMatchIn = /^([5-7][0-9])in$/.exec(hgt);
    if (heightMatchIn) {
      return fp.inRange(59, 77, parseInt(heightMatchIn[1], 10));
    }

    return false;
  };
  const validateHairColor = ({ hcl }: Passport): boolean => /^#[0-9a-f]{6}$/.exec(hcl) !== null;
  const validateEyeColor = ({ ecl }: Passport): boolean => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl);
  const validatePassportId = ({ pid }: Passport): boolean => /^[0-9]{9}$/.exec(pid) !== null;

  const passportFieldsValid = (passport: Passport): boolean => {
    return fp.overEvery([
      validateBirtyYear, 
      validateIssueYear, 
      validateExpirationYear, 
      validateHeight, 
      validateHairColor, 
      validateEyeColor, 
      validatePassportId])(passport);
  };

  const validatePassports = fp.compose(
    fp.filter(passportFieldsValid),
    getValidPassports,
  );
  const answer = validatePassports(input).length;
  console.log('part 2 answer', answer);
};