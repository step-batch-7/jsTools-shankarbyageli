const parseUserArgs = function(args) {
  let parsedArgs = {
    files: [],
    options: []
  };
  args.forEach(argument => {
    argument[0] === "-"
      ? parsedArgs.options.push(argument)
      : parsedArgs.files.push(argument);
  });
  let [isValid, invalidOption] = isValidOptions(parsedArgs.options);
  if (isValid) return parsedArgs;
  throw new Error(`sort : invalid option -- ${invalidOption.slice(1)}`);
};

let isValidOptions = function(options) {
  let validOptions = ["-n", "-r", "-f"];
  const invalidOption = options.find(arg => {
    return !validOptions.includes(arg);
  });
  if (invalidOption) return [false, invalidOption];
  return [true];
};

module.exports = { parseUserArgs, isValidOptions };
