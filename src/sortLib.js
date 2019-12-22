let fs = require("fs");

let parseUserArgs = function(args) {
  let parsedArgs = {
    filename: [],
    options: []
  };
  args.forEach(argument => {
    argument[0] === "-"
      ? parsedArgs.options.push(argument)
      : parsedArgs.filename.push(argument);
  });
  if (isValidOptions(parsedArgs.options)) return parsedArgs;
  throw new Error("sort : Invalid option");
};

let isValidOptions = function(options) {
  let validOptions = ["-n", "-r", "-f"];
  let isValid = options.every(arg => {
    return validOptions.includes(arg);
  });
  return isValid;
};

let loadFileContents = function(path, fileExists, reader) {
  if (fileExists(path)) return reader(path);
  throw new Error("sort : No such a file or directory");
};

let sortContent = function(content, options) {
  let sortedContent = [...content].sort();
  if (options.includes("-f")) {
    sortedContent = caseInsensitiveSort(content);
  }
  options.includes("-n") && sortedContent.sort((a, b) => a - b);
  options.includes("-r") && sortedContent.reverse();
  return sortedContent;
};

let caseInsensitiveSort = function(array) {
  return [...array].sort((a, b) => {
    return a.toUpperCase().localeCompare(b.toUpperCase());
  });
};

module.exports = { parseUserArgs, loadFileContents, sortContent };
