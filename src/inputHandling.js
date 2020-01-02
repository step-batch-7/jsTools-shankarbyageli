const parseUserArgs = function (userArgs) {
  const sortOptions = {options: [], files: []};
  const firstCharIndex = 0;

  userArgs.forEach(arg => {
    if (arg[firstCharIndex] === '-') {
      sortOptions.options.push(arg);
      return;
    }
    sortOptions.files.push(arg);
  });

  const invalidOption = sortOptions.options.find(option => {
    return option !== '-n';
  });
  if (invalidOption) {
    const index = 1;
    sortOptions.error = {code: 'INVDOP', option: invalidOption.slice(index)};
  }
  return sortOptions;
};

module.exports = {parseUserArgs};
