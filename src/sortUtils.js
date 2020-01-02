const sortTextLines = function (inputText, options) {
  const lastIndex = -1, firstIndex = 0;
  let textLines = inputText.split('\n');
  if (textLines[textLines.length + lastIndex] === '') {
    textLines = textLines.slice(firstIndex, lastIndex);
  }
  let sortedLines = [...textLines].sort();
  if (options.includes('-n')) {
    sortedLines = numericSort(sortedLines);
  }
  return sortedLines.join('\n');
};

const numericSort = function (text) {
  const numerics = [], nonNumbers = [];
  text.forEach(line => {
    const isParsableToInt = Number.isInteger(parseInt(line));
    const selectedList = isParsableToInt ? numerics : nonNumbers;
    selectedList.push(line);
  });
  const sortedNonNumber = nonNumbers.sort();
  const sortedNumbers = numerics.sort((textA, textB) => {
    return parseInt(textA) - parseInt(textB);
  });
  return sortedNonNumber.concat(sortedNumbers);
};

module.exports = {sortTextLines}; 
