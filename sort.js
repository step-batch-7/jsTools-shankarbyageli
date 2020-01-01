const fs = require('fs');
const { performSort } = require('./src/sortLib');

const main = function() {
  const printSortResult = function(error, sortedLines) {
    process.stdout.write(sortedLines);
    process.stderr.write(error);
    if (error) {
      process.exitCode = 2;
    }
  };
  const streams = {
    createReadStream: fs.createReadStream,
    inputStream: process.stdin
  };
  performSort(process.argv, streams, printSortResult);
};

main();
