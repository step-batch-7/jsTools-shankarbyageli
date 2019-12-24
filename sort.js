const fs = require("fs");
const { performSort, sortStdin } = require("./src/sortLib");

const main = function() {
  const { streamName, textLines, options } = performSort(process.argv, fs);
  if (textLines) {
    const logger = console[streamName];
    logger(textLines.join("\n"));
    return;
  }
  sortStdin(process.stdin, options, console.log);
};

main();
