const performSort = function(userArgs, ioUtils, loggers) {
  const files = userArgs.slice(2);
  let inputStream = ioUtils.inputStream;
  if (files.length != 0) {
    inputStream = ioUtils.fs.createReadStream(files[0]);
  }
  performStreamSort(inputStream, loggers);
};

const performStreamSort = function(inputStream, loggers) {
  const errorMsg = {
    EISDIR: "sort: Is a directory",
    ENOENT: "sort: No such file or directory",
    EACCES: "sort: Permission denied"
  };
  const inputStreamLines = [];
  inputStream.on("data", data => {
    inputStreamLines.push(data.toString());
  });
  inputStream.on("error", error => {
    if (errorMsg[error.code]) loggers.printError(errorMsg[error.code]);
    loggers.printError("sort: Error reading file");
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

module.exports = {
  performSort,
  sortTextLines,
  performStreamSort
};
