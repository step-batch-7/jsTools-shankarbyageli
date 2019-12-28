const performSort = function(inputStream, onFinish) {
  let inputStreamText = "";
  inputStream.on("data", data => {
    inputStreamText += data.toString();
  });
  inputStream.on("error", error => {
    process.exitCode = 2;
    onFinish(getPrintableResult({ error }));
  });
  inputStream.on("end", () => {
    process.exitCode = 0;
    const sortedLines = sortTextLines(inputStreamText);
    onFinish(getPrintableResult({ sortedLines }));
  });
};

const getPrintableResult = function(sortResult) {
  if (sortResult.error) {
    const errorMsg = generateErrorMsg(sortResult.error.code);
    return { error: `${errorMsg}\n`, sortedLines: "" };
  }
  const sortedLines = sortResult.sortedLines;
  return { error: "", sortedLines: `${sortedLines.join("\n")}\n` };
};

const getInputStream = function(userArgs, streams) {
  const files = userArgs.slice(2);
  if (files.length != 0) {
    return streams.createReadStream(files[0]);
  }
  return streams.inputStream;
};

const sortTextLines = function(text) {
  let textLines = text.split("\n");
  if (textLines[textLines.length - 1] === "") textLines = textLines.slice(0, -1);
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
  getInputStream
};
