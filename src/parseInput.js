const parseUserArgs = function(args) {
  const parsedArgs = {
    files: [],
    options: []
  };
  args.forEach(argument => {
    argument[0] === "-"
      ? parsedArgs.options.push(argument)
      : parsedArgs.files.push(argument);
  });
  const [isValid, invalidOption] = isValidOptions(parsedArgs.options);
  if (isValid) return parsedArgs;
  throw new Error(`sort: invalid option -- ${invalidOption.slice(1)}`);
};

const isValidOptions = function(options) {
  const validOptions = ["-n", "-r", "-f"];
  const invalidOption = options.find(arg => {
    return !validOptions.includes(arg);
  });
  if (invalidOption) return [false, invalidOption];
  return [true];
};

module.exports = { parseUserArgs, isValidOptions };
