class Sort {
  constructor(options) {
    this.options = options;
  }
  hasError() {
    if (this.options.invalidOption) {
      const invalidOption = this.options.invalidOption.match(/^-(.*)/)[1];
      this.error = { code: 'INVDOP', option: invalidOption };
      return true;
    }
  }
  perform(text) {
    let textLines = text.split('\n');
    if (textLines[textLines.length - 1] === '') {
      textLines = textLines.slice(0, -1);
    }
    let sortedLines = [...textLines].sort();
    if (this.options.numericSort) {
      sortedLines = numericSort(sortedLines);
    }
    return sortedLines.join('\n');
  }
}

const numericSort = function (text) {
  const sortedLines = text.sort((textA, textB) => {
    const intParsedA = parseInt(textA);
    const intParsedB = parseInt(textB);
    if (Number.isInteger(intParsedA) && Number.isInteger(intParsedB)) {
      return intParsedA - intParsedB;
    }
    if (Number.isInteger(intParsedB)) {
      return -1;
    }
    return textA.localeCompare(textB);
  });
  return sortedLines;
};

module.exports = Sort; 
