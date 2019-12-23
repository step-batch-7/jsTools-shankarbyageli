const fs = require("fs");
const { performSorting, printSortResult, sortStdin } = require("./src/sortLib");

const main = function() {
  const sortResult = performSorting(process.argv, fs);
  if (sortResult.sorted || sortResult.error) {
    printSortResult(sortResult);
    return;
  }
  sortStdin(process.stdin, sortResult.options, console.log);
};

main();
