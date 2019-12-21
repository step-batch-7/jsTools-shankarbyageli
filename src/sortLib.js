exports.parseUserArgs = function(args) {
  const parsedArgs = {
    filename: [],
    options: []
  };
  args.forEach(argument => {
    argument[0] === "-"
      ? parsedArgs.options.push(argument)
      : parsedArgs.filename.push(argument);
  });
  if (isValidOptions(parsedArgs.options)) return parsedArgs;
  throw new Error("Invalid option");
};

const isValidOptions = function(options) {
  const validOptions = ["-n", "-r", "-f"];
  const isValid = options.every(arg => {
    return validOptions.includes(arg);
  });
  return isValid;
};
