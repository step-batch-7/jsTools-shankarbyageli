const performSort = function(userArgs, ioUtils, loggers) {
  const files = userArgs.slice(2);
  let inputStream = ioUtils.inputStream;
  if (files.length != 0) {
    inputStream = ioUtils.fs.createReadStream(files[0]);
  }
  performStreamSort(inputStream, loggers);
};

const performStreamSort = function(inputStream, loggers) {
  const inputStreamLines = [];

  inputStream.on("data", data => {
    inputStreamLines.push(data.toString());
  });
  inputStream.on("error", error => {
    const errorMsg = generateErrorMsg(error.code);
    loggers.printError(errorMsg);
  });

  inputStream.on("end", () => {
    let textLines = inputStreamLines.join("");
    textLines = textLines.split("\n").slice(0, -1);
    const sortedLines = sortTextLines(textLines);
    loggers.printSortedText(sortedLines.join("\n"));
  });
};

const sortTextLines = function(textLines) {
  let sortedLines = [...textLines].sort();
  return sortedLines;
};

const generateErrorMsg = function(errorCode) {
  const errorMsg = {
    EISDIR: "sort: Is a directory",
    ENOENT: "sort: No such file or directory",
    EACCES: "sort: Permission denied"
  };
  if (errorMsg[errorCode]) {
    return errorMsg[errorCode];
  }
  return "sort: Error reading file";
};

module.exports = {
  performSort,
  sortTextLines,
  performStreamSort
};
