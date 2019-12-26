const eventEmitter = require("events").EventEmitter;
const assert = require("chai").assert;

const {
  performSort,
  loadFileContents,
  sortTextLines,
  performFileSort,
  performStreamSort
} = require("../src/sortLib");

describe("#loadFileContents", function() {
  const readFileSync = function(path) {
    assert.strictEqual(path, "hello.txt");
    return "hello world";
  };
  it("should load the contents of given file if file exists", function() {
    const actual = loadFileContents("hello.txt", { readFileSync });
    const expected = "hello world";
    assert.strictEqual(actual, expected);
  });

  it("should throw error if given file doesn't exist", function() {
    const readFileSync = function(path) {
      assert.strictEqual(path, "hello.txt");
      const error = new Error();
      error.code = "ENOENT";
      throw error;
    };
    assert.throws(() => {
      loadFileContents("hello.txt", { readFileSync });
    }, Error);
  });

  it("should throw error if given path is a directory", function() {
    const readFileSync = function(path) {
      assert.strictEqual(path, "hello.txt");
      const error = new Error();
      error.code = "EISDIR";
      throw error;
    };
    assert.throws(() => {
      loadFileContents("hello.txt", { readFileSync });
    }, Error);
  });
});

describe("#sortTextLines", function() {
  it("should sort the given textLines for -n options", function() {
    const textLines = ["1", "34", "2", "0"];
    const actual = sortTextLines(textLines, ["-n"]);
    const expected = ["0", "1", "2", "34"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should sort the given array in reverse order if -r option given", function() {
    const textLines = ["1", "34", "2", "0"];
    const actual = sortTextLines(textLines, ["-r"]);
    const expected = ["34", "2", "1", "0"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should do case-insensitive sort if -f option is specified", function() {
    const textLines = ["abc", "def", "Abc", "DEF"];
    const actual = sortTextLines(textLines, ["-f"]);
    const expected = ["Abc", "abc", "DEF", "def"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should do numeric reverse sort if -n and -r option is specified", function() {
    const textLines = ["45", "2", "1", "10"];
    const actual = sortTextLines(textLines, ["-n", "-r"]);
    const expected = ["45", "10", "2", "1"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should perform numeric and case insensitive sort for -n and -f options", function() {
    const textLines = ["abc", "2", "Abc", "1"];
    const actual = sortTextLines(textLines, ["-n", "-f"]);
    const expected = ["Abc", "abc", "1", "2"];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#performFileSort", function() {
  const readFileSync = function(path) {
    assert.strictEqual(path, "file");
    return "hello\ngo\n";
  };
  it("should perform sorting based on given cmdArgs", function() {
    const actual = performFileSort(["file"], [], {
      readFileSync
    });
    const expected = ["go", "hello"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should perform sorting based on given cmdArgs when no EOF at end of file", function() {
    const readFileSync = function(path) {
      assert.strictEqual(path, "file");
      return "hello\ngo";
    };
    const actual = performFileSort(["file"], [], {
      readFileSync
    });
    const expected = ["go", "hello"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if file doesn't exist", function() {
    const readFileSync = function(path) {
      assert.strictEqual(path, "file");
      const error = new Error();
      error.code = "ENOENT";
      throw error;
    };
    assert.throws(() => {
      performFileSort(["file"], [], {
        readFileSync
      });
    }, Error);
  });
});

describe("#performStreamSort", function() {
  it("should perform sorting on given data through given stream", function() {
    const inputStream = new eventEmitter();
    let sortedLines;
    const callback = function(stream, input) {
      sortedLines = input;
    };
    performStreamSort(inputStream, [], callback);
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
    assert.deepStrictEqual(sortedLines, "a\nb\nc");
  });
});

describe("#performSort", function() {
  const readFileSync = function(path) {
    assert.strictEqual(path, "file");
    return "hello\ngo\n";
  };
  const utils = {
    fs: { readFileSync }
  };

  it("should perform sorting based on give options", function() {
    const logResult = function(stream, text, exitCode) {
      assert.strictEqual(stream, "log");
      assert.strictEqual(text, "go\nhello");
      assert.strictEqual(exitCode, 0);
    };
    const userArgs = ["", "", "-n", "file"];
    performSort(userArgs, utils, logResult);
  });

  it("should give error if options are invalid", function() {
    const logResult = function(stream, text, exitCode) {
      assert.strictEqual(stream, "error");
      assert.strictEqual(text, "sort: invalid option -- h");
      assert.strictEqual(exitCode, 2);
    };
    const userArgs = ["", "", "-h"];
    performSort(userArgs, utils, logResult);
  });

  it("should give stdin sorted if no file name is given", function() {
    const logResult = function(stream, text, exitCode) {
      assert.strictEqual(stream, "log");
      assert.strictEqual(text, "a\nb\nc");
      assert.strictEqual(exitCode, 0);
    };
    const emitter = new eventEmitter();
    const utils = {
      fs: { readFileSync },
      inputStream: emitter
    };
    const userArgs = ["", "", "-n"];
    performSort(userArgs, utils, logResult);
    utils.inputStream.emit("data", "b\n");
    utils.inputStream.emit("data", "c\n");
    utils.inputStream.emit("data", "a\n");
    utils.inputStream.emit("end");
  });
});
