const fs = require("fs");
const { performSort, getInputStream } = require("./src/sortLib");

const main = function() {
  const printSortResult = function(sortResult) {
    process.stdout.write(sortResult.sortedLines);
    process.stderr.write(sortResult.error);
  };
  const streams = {
    createReadStream: fs.createReadStream,
    inputStream: process.stdin
  };
  const inputStream = getInputStream(process.argv, streams);
  performSort(inputStream, printSortResult);
};

main();
