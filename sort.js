const fs = require("fs");
const { performSort } = require("./src/sortLib");

const main = function() {
  const sortResultPrinters = {
    printError: function(errorMsg) {
      console.error(errorMsg);
      process.exit(2);
    },
    printSortedText: function(sortedLines) {
      console.log(sortedLines);
      process.exit(0);
    }
  };
  const ioUtils = {
    fs,
    inputStream: process.stdin
  };
  performSort(process.argv, ioUtils, sortResultPrinters);
};

main();
