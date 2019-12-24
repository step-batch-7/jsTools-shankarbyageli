const fs = require("fs");
const { performFileSort, performStreamSort } = require("./src/sortLib");

const main = function() {
  const helper = {
    fs,
    userOptions: []
  };
  const { streamName, textLines } = performFileSort(process.argv, helper);
  if (textLines) {
    const logger = console[streamName];
    logger(textLines.join("\n"));
    return;
  }
  performStreamSort(process.stdin, helper.options, console.log);
};

main();
