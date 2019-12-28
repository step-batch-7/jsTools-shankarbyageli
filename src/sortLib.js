const performSort = function(inputStream, onFinish) {
  let inputStreamText = '';
  inputStream.on('data', data => {
    inputStreamText += data.toString();
  });
  inputStream.on('error', error => {
    onFinish(getPrintableResult({ error }));
  });
  inputStream.on('end', () => {
    const sortedLines = sortTextLines(inputStreamText);
    onFinish(getPrintableResult({ sortedLines }));
  });
};

const getPrintableResult = function(sortResult) {
  if (sortResult.error) {
    const errorMsg = generateErrorMsg(sortResult.error.code);
    return { error: `${errorMsg}\n`, sortedLines: '' };
  }
  const sortedLines = sortResult.sortedLines;
  return { error: '', sortedLines: `${sortedLines.join('\n')}\n` };
};

const getInputStream = function(userArgs, streams) {
  const firstFileIndex = 0, userArgsIndex = 2;
  const files = userArgs.slice(userArgsIndex);
  if (files.length) {
    return streams.createReadStream(files[firstFileIndex]);
  }
  return streams.inputStream;
};

const sortTextLines = function(text) {
  const lastIndex = -1, firstIndex = 0;
  let textLines = text.split('\n');
  if (textLines[textLines.length + lastIndex] === '') {
    textLines = textLines.slice(firstIndex, lastIndex);
  }
  const sortedLines = [...textLines].sort();
  return sortedLines;
};

const generateErrorMsg = function(errorCode) {
  const errorMsg = {
    EISDIR: 'sort: Is a directory',
    ENOENT: 'sort: No such file or directory',
    EACCES: 'sort: Permission denied'
  };
  if (errorMsg[errorCode]) {
    return errorMsg[errorCode];
  }
  return 'sort: Error reading file';
};

module.exports = {
  performSort,
  getInputStream
};
