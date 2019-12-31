const {sortTextLines, getPrintableResult} = require('./sortUtils.js');

const performSort = function(inputStream, onFinish) {
  let inputText = '';
  inputStream.on('data', text => {inputText += text;});
  inputStream.on('error', error => {
    onFinish(generateErrorMsg(error, getPrintableResult));
  });
  inputStream.on('end', () => {
    onFinish(sortTextLines(inputText, getPrintableResult));
  });
};

const getInputStream = function(userArgs, streams) {
  const firstFileIndex = 0, userArgsIndex = 2;
  const files = userArgs.slice(userArgsIndex);
  if (files.length) {
    return streams.createReadStream(files[firstFileIndex]);
  }
  return streams.inputStream;
};

const generateErrorMsg = function(error, onCompletion) {
  const errorCode = error.code;
  let errorMsg = 'sort: Error reading file';
  const errorsList = {
    EISDIR: 'sort: Is a directory',
    ENOENT: 'sort: No such file or directory',
    EACCES: 'sort: Permission denied'
  };
  if (errorsList[errorCode]) {
    errorMsg = errorsList[errorCode];
  }
  return onCompletion({errorMsg});
};

module.exports = {
  performSort,
  getInputStream
};
