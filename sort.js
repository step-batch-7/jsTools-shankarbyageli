const fs = require("fs");
const { performSort } = require("./src/sortLib");

const main = function() {
  const utils = {
    fs,
    inputStream: process.stdin
  };
  performSort(process.argv, utils, (streamName, textLines, exitCode) => {
    const logger = console[streamName];
    logger(textLines);
    process.exit(exitCode);
  });
};

main();
