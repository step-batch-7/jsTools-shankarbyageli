const performSorting = require("./src/sortLib").performSorting;

const main = function() {
  const sortResult = performSorting(process.argv);
  if (sortResult.error) {
    console.error(sortedResult.error);
    return;
  }
  console.log(sortResult.output);
};

main();
