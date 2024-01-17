import { Command } from "commander";
import { wc } from "./wc";
const program = new Command();

program
  .argument("[input-file]")
  .option("-c", "outputs the number of bytes in a file")
  .option("-l")
  .option("-w")
  .option("-m");

program.parse();

const options = program.opts();
const fileName = program.args[0];

const main = async () => {
  const result = await wc(options, fileName, process.stdin);
  console.log("Result:", result);
};

main();
