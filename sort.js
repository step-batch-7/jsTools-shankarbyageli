const fs = require("fs");
const { performSort } = require("./src/sortLib");

const main = function() {
  const sortResultPrinters = {
    logError: function(errorMsg) {
      console.error(errorMsg);
      process.exit(2);
    },
    logSortedLines: function(sortedLines) {
      console.log(sortedLines);
      process.exit(0);
    }
  };
  const utils = {
    fs,
    inputStream: process.stdin
  };
  performSort(process.argv, utils, sortResultPrinters);
};

main();
