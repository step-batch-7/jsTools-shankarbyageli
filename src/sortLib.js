const Sort = require('./sortUtils.js');
const { parseUserArgs } = require('./inputHandling');

const performSort = function (userInput, streamCreators, onFinish) {
  const [, , ...userArgs] = userInput;
  const optionsLookup = {
    '-n': 'numericSort'
  };
  const sortOptions = parseUserArgs(userArgs, optionsLookup);
  const sort = new Sort(sortOptions.options);
  if (sort.hasError()) {
    onFinish(generateErrorMsg(sort.error) + '\n', '');
    return;
  }
  const inputStream = getInputStream(sortOptions.files, streamCreators);
  loadStreamContents(inputStream, (error, text) => {
    if (error) {
      const errorMsg = generateErrorMsg(error);
      onFinish(errorMsg + '\n', '');
      return;
    }
    const sortedText = sort.perform(text);
    onFinish('', sortedText + '\n');
  });
};

const loadStreamContents = function (inputStream, onLoad) {
  let inputText = '';
  inputStream.on('data', text => {
    inputText += text;
  });
  inputStream.on('error', error => onLoad(error, ''));
  inputStream.on('end', () => onLoad('', inputText));
};

const getInputStream = function (files, streamCreators) {
  const [fileName] = files;
  if (files.length) {
    return streamCreators.createReadStream(fileName);
  }
  return streamCreators.inputStream();
};

const generateErrorMsg = function (error) {
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
