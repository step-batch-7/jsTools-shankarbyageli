const parseUserArgs = function (userArgs) {
  const sortOptions = {options: [], files: []};
  userArgs.forEach(arg => {
    if (arg[0] === '-') {
      sortOptions.options.push(arg);
      return;
    }
    sortOptions.files.push(arg);
  });

  let invalidOption = sortOptions.options.find(option => {
    return option !== '-n';
  });
  if (invalidOption) {
    [, invalidOption] = invalidOption.match(/^-(.*)/);
    sortOptions.error = {code: 'INVDOP', option: invalidOption};
  }
  return sortOptions;
};

module.exports = {parseUserArgs};
