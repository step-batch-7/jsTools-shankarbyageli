const sortTextLines = function(inputText, onCompletion) {
  const lastIndex = -1, firstIndex = 0;
  let textLines = inputText.split('\n');
  if (textLines[textLines.length + lastIndex] === '') {
    textLines = textLines.slice(firstIndex, lastIndex);
  }
  const sortedLines = [...textLines].sort();
  return onCompletion({sortedLines});
};

const getPrintableResult = function(sortResult) {
  if (sortResult.errorMsg) {
    return { error: `${sortResult.errorMsg}\n`, sortedLines: '' };
  }
  const sortedLines = sortResult.sortedLines;
  return { error: '', sortedLines: `${sortedLines.join('\n')}\n` };
};

module.exports = {sortTextLines, getPrintableResult};
