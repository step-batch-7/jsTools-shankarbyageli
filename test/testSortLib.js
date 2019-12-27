const eventEmitter = require("events").EventEmitter;
const assert = require("chai").assert;

const {
  performSort,
  sortTextLines,
  performStreamSort
} = require("../src/sortLib");

describe("#sortTextLines", function() {
  it("should sort the given textLines for options", function() {
    const textLines = ["1", "34", "2", "0"];
    const actual = sortTextLines(textLines);
    const expected = ["0", "1", "2", "34"];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#performStreamSort", function() {
  it("should perform sorting on given data through given stream", function() {
    const inputStream = new eventEmitter();
    let sortedLines;
    const outputLoggers = {
      printSortedText: function(textLines) {
        assert.strictEqual(textLines, "a\nb\nc");
      },
      printError: function(errorMsg) {}
    };
    performStreamSort(inputStream, outputLoggers);
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
  });

  it("should give error if the file doesn't exist", function(done) {
    const outputLoggers = {
      printSortedText: function(text) {},
      printError: function(errorMsg) {
        assert.strictEqual(errorMsg, "sort: No such file or directory");
        done();
      }
    };
    const utils = {
      fs: {
        createReadStream: function() {
          return new eventEmitter();
        }
      },
      inputStream: new eventEmitter()
    };
    const error = new Error("sort: No such file or directory");
    error.code = "ENOENT";
    const inputStream = utils.fs.createReadStream("badfile");
    performStreamSort(inputStream, outputLoggers);
    inputStream.emit("error", error);
  });

  it("should give default error if no error code matches", function(done) {
    const outputLoggers = {
      printSortedText: function(text) {},
      printError: function(errorMsg) {
        assert.strictEqual(errorMsg, "sort: Error reading file");
        done();
      }
    };
    const utils = {
      fs: {
        createReadStream: function() {
          return new eventEmitter();
        }
      },
      inputStream: new eventEmitter()
    };
    const error = new Error("sort: unknown error");
    error.code = "UNKNOWN";
    const inputStream = utils.fs.createReadStream("file");
    performStreamSort(inputStream, outputLoggers);
    inputStream.emit("error", error);
  });
});

describe("#performSort", function() {
  it("should perform sorting on given file contents", function() {
    const userArgs = ["", "", "file"];
    const outputLoggers = {
      printSortedText: function(textLines) {
        assert.strictEqual(textLines, "go\nhello");
      },
      printError: function(errorMsg) {}
    };
    const utils = {
      fs: {
        createReadStream: function() {
          return new eventEmitter();
        }
      }
    };
    const inputStream = utils.fs.createReadStream();
    performSort(userArgs, utils, outputLoggers);
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
  });

  it("should give stdin sorted if no file name is given", function() {
    const userArgs = ["", ""];
    const outputLoggers = {
      printSortedText: function(text) {
        assert.strictEqual(text, "a\nb\nc");
      },
      printError: function(errorMsg) {}
    };
    const utils = {
      fs: {
        createReadStream: function() {
          return new eventEmitter();
        }
      },
      inputStream: new eventEmitter()
    };
    const inputStream = utils.fs.createReadStream();
    performSort(userArgs, utils, outputLoggers);
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
  });
});
