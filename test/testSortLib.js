const eventEmitter = require("events").EventEmitter;

const assert = require("chai").assert;
const {
  performSort,
  loadFileContents,
  sortContent,
  performFileSort,
  performStreamSort,
  logSortResult
} = require("../src/sortLib");

describe("#loadFileContents", function() {
  it("should load the contents of given file if file exists", function() {
    const reader = function(path) {
      assert.strictEqual(path, "file");
      return "hello world";
    };
    const fileExists = function(path) {
      assert.strictEqual(path, "file");
      return true;
    };
    const actual = loadFileContents("file", fileExists, reader);
    const expected = "hello world";
    assert.strictEqual(actual, expected);
  });

  it("should throw error if file doesn't exist", function() {
    const reader = function(path) {
      assert.strictEqual(path, "file");
      return "hello world";
    };
    const fileExists = function(path) {
      assert.strictEqual(path, "file");
      return false;
    };
    assert.throws(() => {
      loadFileContents("file", fileExists, reader);
    }, Error);
  });
});

describe("#sortContent", function() {
  it("should sort the given array according to options", function() {
    const content = ["1", "34", "2", "0"];
    const actual = sortContent(content, ["-n"]);
    const expected = ["0", "1", "2", "34"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should sort the given array in reverse order if -r option given", function() {
    const content = ["1", "34", "2", "0"];
    const actual = sortContent(content, ["-r"]);
    const expected = ["34", "2", "1", "0"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should do case-insensitive sort if -f option is specified", function() {
    const content = ["abc", "def", "Abc", "DEF"];
    const actual = sortContent(content, ["-f"]);
    const expected = ["Abc", "abc", "DEF", "def"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should do numeric sort if -n option is specified", function() {
    const content = ["45", "2", "1", "10"];
    const actual = sortContent(content, ["-n"]);
    const expected = ["1", "2", "10", "45"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should perform numeric and case insensitive sort for -n and -r options", function() {
    const content = ["abc", "2", "Abc", "1"];
    const actual = sortContent(content, ["-n", "-f"]);
    const expected = ["Abc", "abc", "1", "2"];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#performFileSort", function() {
  const readFileSync = function(path) {
    assert.strictEqual(path, "file");
    return "hello\ngo\n";
  };
  const existsSync = function(path) {
    assert.strictEqual(path, "file");
    return true;
  };
  it("should perform sorting based on given cmdArgs", function() {
    const actual = performFileSort(["file"], [], {
      existsSync,
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
      existsSync,
      readFileSync
    });
    const expected = ["go", "hello"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if file doesn't exist", function() {
    const existsSync = function(path) {
      assert.strictEqual(path, "file");
      return false;
    };
    assert.throws(() => {
      performFileSort(["file"], [], {
        existsSync,
        readFileSync
      });
    }, Error);
  });
});

describe("#performStreamSort", function() {
  it("should perform sorting on given data through given stream", function() {
    const inputStream = new eventEmitter();
    let sortedContent;
    const callback = function(stream, input) {
      sortedContent = input;
    };
    performStreamSort(inputStream, [], callback);
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
    assert.deepStrictEqual(sortedContent, ["a", "b", "c"]);
  });
});

describe("#logSortResult", function() {
  it("should log the given data on the given stream", function() {
    let givenText;
    const logger = {
      data: function(input) {
        givenText = input;
      }
    };
    logSortResult.call(logger, "data", ["ok", "bye"]);
    assert.strictEqual(givenText, "ok\nbye");
  });
});
