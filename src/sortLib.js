const performSort = function(userArgs, ioUtils, loggers) {
  const files = userArgs.slice(2);
  if (files.length != 0) {
    ioUtils.inputStream = ioUtils.fs.createReadStream(files[0]);
  }
  const inputStreamLines = [];
  ioUtils.inputStream.on("data", data => {
    inputStreamLines.push(data.toString());
  });
  ioUtils.inputStream.on("error", error => {
    const errorMsg = generateErrorMsg(error.code);
    loggers.printError(errorMsg);
  });
  ioUtils.inputStream.on("end", () => {
    const sortedLines = sortTextLines(inputStreamLines);
    loggers.printSortedText(sortedLines.join("\n"));
  });
};

const sortTextLines = function(text) {
  let textLines = text.join("");
  textLines = textLines.split("\n");
  if (textLines[textLines.length - 1] === "")
    textLines = textLines.slice(0, -1);
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
  performSort
};
