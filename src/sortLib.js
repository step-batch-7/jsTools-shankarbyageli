const performSort = function(userArgs, utils, loggers) {
  try {
    const files = userArgs.slice(2);
    if (files.length != 0) {
      const sortedOutput = performFileSort(files, utils.fs);
      loggers.logSortedLines(sortedOutput.join("\n"));
      return;
    }
    performStreamSort(utils.inputStream, loggers.logSortedLines);
  } catch (error) {
    loggers.logError([error.message].join("\n"));
  }
};

const performFileSort = function(files, fs) {
  let fileContents = loadFileContents(files[0], fs);
  fileContents = fileContents.split("\n");
  if (fileContents[fileContents.length - 1] === "")
    fileContents = fileContents.slice(0, -1);
  return sortTextLines(fileContents);
};

const performStreamSort = function(inputStream, logSortedLines) {
  const inputStreamLines = [];
  inputStream.on("data", data => {
    inputStreamLines.push(data.toString());
  });
  inputStream.on("end", () => {
    const textLines = inputStreamLines
      .join("")
      .split("\n")
      .slice(0, -1);
    const sortedLines = sortTextLines(textLines);
    logSortedLines(sortedLines.join("\n"));
  });
};

const loadFileContents = function(path, fs) {
  const errors = {
    EISDIR: new Error("sort: Is a directory"),
    ENOENT: new Error("sort: No such file or directory")
  };
  try {
    return fs.readFileSync(path).toString();
  } catch (error) {
    throw errors[error.code];
  }
};

const sortTextLines = function(textLines) {
  let sortedLines = [...textLines].sort();
  return sortedLines;
};

module.exports = {
  performSort,
  loadFileContents,
  sortTextLines,
  performFileSort,
  performStreamSort
};
