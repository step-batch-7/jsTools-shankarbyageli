const { parseUserArgs } = require("./parseInput");

const performFileSort = function(args, helper) {
  let streamName, textLines;
  try {
    let { files, options } = parseUserArgs(args.slice(2));
    helper.userOptions = options;
    if (files.length != 0) {
      let content = loadFileContents(
        files[0],
        helper.fs.existsSync,
        helper.fs.readFileSync
      );
      content = content.split("\n");
      if (content[content.length - 1] === "") content = content.slice(0, -1);
      textLines = sortContent(content, options);
      streamName = "log";
    }
  } catch (error) {
    streamName = "error";
    textLines = [error.message];
  }
  return { streamName, textLines };
};

const performStreamSort = function(stdin, options, callback) {
  const stdinData = [];
  stdin.on("data", data => {
    stdinData.push(data.toString());
  });
  stdin.on("end", () => {
    const content = stdinData
      .join("")
      .split("\n")
      .slice(0, -1);
    const sortedOutput = sortContent(content, options);
    return callback(sortedOutput.join("\n"));
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
    const upperCaseA = a.toUpperCase();
    const upperCaseB = b.toUpperCase();
    if (upperCaseA < upperCaseB) return -1;
    if (upperCaseA > upperCaseB) return 1;
    return 0;
  });
};

const numericSort = function(array) {
  array.sort((a, b) => a - b);
  const firstNonNumber = array.find(item => {
    return !Number.isInteger(Number(item)) && item != "";
  });
  const index = array.indexOf(firstNonNumber);
  if (index === -1) return array;
  const numArray = array.slice(0, index);
  array.splice(0, index);
  return array.concat(numArray);
};

module.exports = {
  parseUserArgs,
  loadFileContents,
  sortContent,
  performFileSort,
  performStreamSort
};
