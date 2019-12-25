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
  let fileContents = loadFileContents(files[0], fs);
  fileContents = fileContents.split("\n");
  if (fileContents[fileContents.length - 1] === "")
    fileContents = fileContents.slice(0, -1);
  return sortTextLines(fileContents, options);
};

const performStreamSort = function(inputStream, options, callback) {
  const inputStreamLines = [];
  inputStream.on("data", data => {
    inputStreamLines.push(data.toString());
  });
  inputStream.on("end", () => {
    const textLines = inputStreamLines
      .join("")
      .split("\n")
      .slice(0, -1);
    const sortedLines = sortTextLines(textLines, options);
    callback("log", sortedLines);
  });
};

let loadFileContents = function(path, fs) {
  try {
    if (fs.existsSync(path)) return fs.readFileSync(path).toString();
    throw new Error("sort: No such a file or directory");
  } catch (error) {
    if (error.code === "EISDIR") throw new Error("sort: Is a directory");
    throw error;
  }
};

let sortTextLines = function(textLines, options) {
  let sortedLines = [...textLines].sort();
  if (options.includes("-f")) {
    sortedLines = caseInsensitiveSort(sortedLines);
  }
  if (options.includes("-n")) {
    sortedLines = numericSort(sortedLines);
  }
  options.includes("-r") && sortedLines.reverse();
  return sortedLines;
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
  textLines.sort((lineA, lineB) => lineA - lineB);
  const firstNonNumber = textLines.find(text => {
    return !Number.isInteger(Number(text)) && text != "";
  });
  const nonNumberIndex = textLines.indexOf(firstNonNumber);
  if (nonNumberIndex === -1) return textLines;
  const numbers = textLines.slice(0, nonNumberIndex);
  textLines.splice(0, nonNumberIndex);
  return textLines.concat(numbers);
};

const logSortResult = function(streamName, textLines) {
  const logger = this[streamName];
  logger(textLines.join("\n"));
};

module.exports = {
  performSort,
  loadFileContents,
  sortTextLines,
  performFileSort,
  performStreamSort,
  logSortResult
};
