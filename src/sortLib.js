const {sortTextLines} = require('./sortUtils.js');
const {parseUserArgs} = require('./inputHandling');

const performSort = function(userArgs, streams, onFinish) {
  const sortOptions = parseUserArgs(userArgs.slice(2));
  if(sortOptions.error) {
    onFinish(generateErrorMsg(sortOptions.error)+'\n', '');
    return;
  }
  const inputStream = getInputStream(sortOptions.files, streams);
  let inputText = '';
  inputStream.on('data', text => {
    inputText += text;
  });
  inputStream.on('error', error => onFinish(generateErrorMsg(error)+'\n', ''));
  inputStream.on('end', () => onFinish('', sortTextLines(inputText)+'\n'));
};

const getInputStream = function(files, streams) {
  const [fileName] = files;
  if (files.length) {
    return streams.createReadStream(fileName);
  }
  return streams.inputStream;
};

const generateErrorMsg = function(error) {
  const errorCode = error.code;
  let errorMsg = 'sort: Error reading file';
  const errorsList = {
    EISDIR: 'sort: Is a directory',
    ENOENT: 'sort: No such file or directory',
    EACCES: 'sort: Permission denied',
    INVDOP: `sort: invalid option -- ${error.option}`
  };
  if (errorsList[errorCode]) {
    errorMsg = errorsList[errorCode];
  }
  return errorMsg;
};

module.exports = {
  performSort,
  getInputStream
};
