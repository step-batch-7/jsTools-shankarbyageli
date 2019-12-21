const fs = require("fs");

const parseUserArgs = function(args) {
  const parsedArgs = {
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

const isValidOptions = function(options) {
  const validOptions = ["-n", "-r", "-f"];
  const isValid = options.every(arg => {
    return validOptions.includes(arg);
  });
  return isValid;
};

const loadFileContents = function(path, fileExists, reader) {
  if (fileExists(path)) return reader(path);
  throw new Error("sort : No such a file or directory");
};

module.exports = { parseUserArgs, loadFileContents };
