import { program } from 'commander';
import solve from './solvers';

const main = async (): Promise<void> => {
  program
    .requiredOption('-d, --day <day>', 'Specify day to display solution', parseInt);

  await program.parseAsync(process.argv);

  await solve(program.day);
};

void main();