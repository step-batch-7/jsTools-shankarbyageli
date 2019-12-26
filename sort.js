const fs = require("fs");
const { performSort } = require("./src/sortLib");

const logSortedLines = function(sortedLines) {
  console.log(sortedLines);
  process.exit(0);
};

const logError = function(errorMsg) {
  console.error(errorMsg);
  process.exit(2);
};

const main = function() {
  const utils = {
    fs,
    inputStream: process.stdin
  };
  performSort(process.argv, utils, logSortedLines, logError);
};

main();
