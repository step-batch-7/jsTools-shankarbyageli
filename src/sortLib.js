const performSort = function(inputStream, onFinish) {
  const inputStreamLines = [];
  inputStream.on("data", data => {
    inputStreamLines.push(data.toString());
  });
  inputStream.on("error", error => {
    const errorMsg = generateErrorMsg(error.code);
    onFinish({ error: `${errorMsg}\n`, sortedLines: "", exitCode: 2 });
  });
  inputStream.on("end", () => {
    const sortedLines = sortTextLines(inputStreamLines);
    onFinish({ error: "", sortedLines: `${sortedLines.join("\n")}\n`, exitCode: 0 });
  });
};

const getInputStream = function(userArgs, streams) {
  const files = userArgs.slice(2);
  if (files.length != 0) {
    return streams.createReadStream(files[0]);
  }
  return streams.inputStream;
};

const sortTextLines = function(text) {
  let textLines = text.join("");
  textLines = textLines.split("\n");
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
