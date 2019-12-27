const fs = require("fs");
const { performSort } = require("./src/sortLib");

const main = function() {
  const printSortResult = function(sortResult) {
    process.stdout.write(sortResult.sortedLines);
    process.stderr.write(sortResult.error);
    process.exit(sortResult.exitCode);
  };
  const ioUtils = {
    createReadStream: fs.createReadStream,
    inputStream: process.stdin
  };
  performSort(process.argv, ioUtils, printSortResult);
};

main();
