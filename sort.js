const fs = require("fs");
const { performFileSort, sortStdin } = require("./src/sortLib");

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
  sortStdin(process.stdin, helper.options, console.log);
};

main();
