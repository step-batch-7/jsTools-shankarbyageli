const parseUserArgs = function (userArgs, optionsLookup) {
  const sortOptions = { options: {}, files: [] };
  userArgs.forEach(arg => {
    if (sortOptions.options.invalidOption) {
      return;
    }
    if (arg.startsWith('-')) {
      if (optionsLookup[arg]) {
        sortOptions.options[optionsLookup[arg]] = true;
        return;
      }
      sortOptions.options.invalidOption = arg;
      return;
    }
    sortOptions.files.push(arg);
  });
  return sortOptions;
};

module.exports = { parseUserArgs };
