let parseUserArgs = function(args) {
  let parsedArgs = {
    files: [],
    options: []
  };
  args.forEach(argument => {
    argument[0] === "-"
      ? parsedArgs.options.push(argument)
      : parsedArgs.files.push(argument);
  });
  if (isValidOptions(parsedArgs.options)) return parsedArgs;
  throw new Error("sort : Invalid option");
};

let isValidOptions = function(options) {
  let validOptions = ["-n", "-r", "-f"];
  return options.every(arg => {
    return validOptions.includes(arg);
  });
};

let loadFileContents = function(path, fileExists, reader) {
  if (fileExists(path)) return reader(path).toString();
  throw new Error("sort : No such a file or directory");
};

let sortContent = function(content, options) {
  let sortedContent = [...content].sort();
  if (options.includes("-f")) {
    sortedContent = caseInsensitiveSort(sortedContent);
  }
  if (options.includes("-n")) {
    sortedContent = numericSort(sortedContent);
  }
  options.includes("-r") && sortedContent.reverse();
  return sortedContent;
};

const caseInsensitiveSort = function(array) {
  return [...array].sort((a, b) => {
    return a.toUpperCase().localeCompare(b.toUpperCase());
  });
};

const numericSort = function(array) {
  array.sort((a, b) => a - b);
  const index = array.indexOf(
    array.find(item => !Number.isInteger(Number(item)))
  );
  if (index === -1) return array;
  const numArray = array.slice(0, index);
  array.splice(0, index);
  return array.concat(numArray);
};

const printSortResult = function(sortResult) {
  if (sortResult.error) {
    console.error(sortResult.error);
    return;
  }
  console.log(sortResult.sorted.join("\n"));
};

module.exports = {
  parseUserArgs,
  loadFileContents,
  sortContent,
  printSortResult
};