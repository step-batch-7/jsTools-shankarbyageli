const fs = require("fs");
const { performSort, logSortResult } = require("./src/sortLib");

const main = function() {
  const utils = {
    fs,
    inputStream: process.stdin,
    logger: console
  };
  performSort(process.argv, utils, logSortResult);
};

main();
