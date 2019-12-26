const performSort = function(userArgs, utils, sortedOutputLogger, errorLogger) {
  try {
    const files = userArgs.slice(2);
    if (files.length != 0) {
      const sortedOutput = performFileSort(files, utils.fs);
      sortedOutputLogger(sortedOutput.join("\n"));
      return;
    }
    performStreamSort(utils.inputStream, sortedOutputLogger);
  } catch (error) {
    errorLogger([error.message].join("\n"));
  }
};

const performFileSort = function(files, fs) {
  let fileContents = loadFileContents(files[0], fs);
  fileContents = fileContents.split("\n");
  if (fileContents[fileContents.length - 1] === "")
    fileContents = fileContents.slice(0, -1);
  return sortTextLines(fileContents);
};

const performStreamSort = function(inputStream, logResult) {
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
    logResult(sortedLines.join("\n"));
  });
};

const loadFileContents = function(path, fs) {
  try {
    return fs.readFileSync(path).toString();
  } catch (error) {
    if (error.code === "EISDIR") throw new Error("sort: Is a directory");
    if (error.code === "ENOENT")
      throw new Error("sort: No such file or directory");
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
