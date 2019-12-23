const fs = require("fs");
const { performSort, sortStdin } = require("./src/sortLib");

const main = function() {
  const { stream, data, options } = performSort(process.argv, fs);
  if (data) {
    console[stream](data.join("\n"));
    return;
  }
  sortStdin(process.stdin, options, console.log);
};

main();
