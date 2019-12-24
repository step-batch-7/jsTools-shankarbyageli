const fs = require("fs");
const { performSort, logSortResult } = require("./src/sortLib");

const main = function() {
  const helper = {
    fs,
    inputStream: process.stdin,
    logger: console
  };
  performSort(process.argv, helper, logSortResult);
};

main();
