const sortTextLines = function(inputText) {
  const lastIndex = -1, firstIndex = 0;
  let textLines = inputText.split('\n');
  if (textLines[textLines.length + lastIndex] === '') {
    textLines = textLines.slice(firstIndex, lastIndex);
  }
  const sortedLines = [...textLines].sort();
  return sortedLines.join('\n');
};

module.exports = {sortTextLines }; 
