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
  it("should sort the given textLines for options", function() {
    const textLines = ["1", "34", "2", "0"];
    const actual = sortTextLines(textLines);
    const expected = ["0", "1", "2", "34"];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#performFileSort", function() {
  const readFileSync = function(path) {
    assert.strictEqual(path, "file");
    return "hello\ngo\n";
  };
  it("should perform sorting on given file", function() {
    const actual = performFileSort(["file"], {
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
    const actual = performFileSort(["file"], {
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
      performFileSort(["file"], {
        readFileSync
      });
    }, Error);
  });
});

describe("#performStreamSort", function() {
  it("should perform sorting on given data through given stream", function() {
    const inputStream = new eventEmitter();
    let sortedLines;
    const logResult = function(input) {
      sortedLines = input;
    };
    performStreamSort(inputStream, logResult);
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
    const logResult = function(textLines) {
      assert.strictEqual(textLines, "go\nhello");
    };
    const logError = function(errorMsg) {};
    const userArgs = ["", "", "file"];
    performSort(userArgs, utils, logResult, logError);
  });

  it("should give stdin sorted if no file name is given", function() {
    const logResult = function(text) {
      assert.strictEqual(text, "a\nb\nc");
    };
    const logError = function(errorMsg) {};
    const emitter = new eventEmitter();
    const utils = {
      fs: { readFileSync },
      inputStream: emitter
    };
    const userArgs = ["", ""];
    performSort(userArgs, utils, logResult, logError);
    utils.inputStream.emit("data", "b\n");
    utils.inputStream.emit("data", "c\n");
    utils.inputStream.emit("data", "a\n");
    utils.inputStream.emit("end");
  });
});
