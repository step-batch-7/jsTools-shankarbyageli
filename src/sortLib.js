const performSort = function(args, fs) {
  let options, files, streamName, textLines;
  try {
    ({ files, options } = parseUserArgs(args.slice(2)));
    if (files.length != 0) {
      let content = loadFileContents(files[0], fs.existsSync, fs.readFileSync);
      content = content.split("\n").slice(0, -1);
      textLines = sortContent(content, options);
      streamName = "log";
    }
  } catch (error) {
    streamName = "error";
    textLines = [error.message];
  }
  return { streamName, textLines, options };
};

const sortStdin = function(stdin, options, callback) {
  const stdinData = [];
  stdin.on("data", data => {
    stdinData.push(data.toString());
  });
  stdin.on("end", () => {
    const content = stdinData
      .join("")
      .split("\n")
      .slice(0, -1);
    const sortedOutput = sortContent(content, options);
    callback(sortedOutput.join("\n"));
  });
};

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
  if (isValidOptions(parsedArgs.options)) return parsedArgs;
};

let isValidOptions = function(options) {
  let validOptions = ["-n", "-r", "-f"];
  const invalidOption = options.find(arg => {
    return !validOptions.includes(arg);
  });
  if (invalidOption)
    throw new Error(`sort : invalid option -- ${invalidOption.slice(1)}`);
  return true;
};

let loadFileContents = function(path, fileExists, reader) {
  if (fileExists(path)) return reader(path).toString();
  throw new Error("sort : No such a file or directory");
};

let sortContent = function(content, options) {
  let sortedContent = [...content].sort();
  if (options.includes("-f")) {
    sortedContent = caseInsensitiveSort(sortedContent);
  }
  if (options.includes("-n")) {
    sortedContent = numericSort(sortedContent);
  }
  options.includes("-r") && sortedContent.reverse();
  return sortedContent;
};

const caseInsensitiveSort = function(array) {
  return [...array].sort((a, b) => {
    const upperCaseA = a.toUpperCase();
    const upperCaseB = b.toUpperCase();
    if (upperCaseA < upperCaseB) return -1;
    if (upperCaseA > upperCaseB) return 1;
    return 0;
  });
};

const numericSort = function(array) {
  array.sort((a, b) => a - b);
  const firstNonNumber = array.find(item => {
    return !Number.isInteger(Number(item)) && item != "";
  });
  const index = array.indexOf(firstNonNumber);
  if (index === -1) return array;
  const numArray = array.slice(0, index);
  array.splice(0, index);
  return array.concat(numArray);
};

module.exports = {
  parseUserArgs,
  loadFileContents,
  sortContent,
  performSort,
  sortStdin
};
