const { parseUserArgs } = require("./parseInput");

const performSort = function(userArgs, utils, logResult) {
  try {
    let { files, options } = parseUserArgs(userArgs.slice(2));
    if (files.length != 0) {
      const sortedOutput = performFileSort(files, options, utils.fs);
      logResult.call(utils.logger, "log", sortedOutput);
      return;
    }
    performStreamSort(utils.inputStream, options, logResult.bind(utils.logger));
  } catch (error) {
    logResult.call(utils.logger, "error", [error.message]);
  }
};

const performFileSort = function(files, options, fs) {
  let content = loadFileContents(files[0], fs.existsSync, fs.readFileSync);
  content = content.split("\n");
  if (content[content.length - 1] === "") content = content.slice(0, -1);
  return sortTextLines(content, options);
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
    const sortedOutput = sortTextLines(content, options);
    callback("log", sortedOutput);
  });
};

let loadFileContents = function(path, fileExists, reader) {
  if (fileExists(path)) return reader(path).toString();
  throw new Error("sort : No such a file or directory");
};

let sortTextLines = function(content, options) {
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

const caseInsensitiveSort = function(textLines) {
  return [...textLines].sort((a, b) => {
    const upperCaseA = a.toUpperCase();
    const upperCaseB = b.toUpperCase();
    if (upperCaseA < upperCaseB) return -1;
    if (upperCaseA > upperCaseB) return 1;
    return 0;
  });
};

const numericSort = function(textLines) {
  textLines.sort((a, b) => a - b);
  const firstNonNumber = textLines.find(item => {
    return !Number.isInteger(Number(item)) && item != "";
  });
  const index = textLines.indexOf(firstNonNumber);
  if (index === -1) return textLines;
  const numbers = textLines.slice(0, index);
  textLines.splice(0, index);
  return textLines.concat(numbers);
};

const logSortResult = function(streamName, text) {
  const logger = this[streamName];
  logger(text.join("\n"));
};

module.exports = {
  performSort,
  loadFileContents,
  sortTextLines,
  performFileSort,
  performStreamSort,
  logSortResult
};
