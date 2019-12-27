const eventEmitter = require("events").EventEmitter;
const assert = require("chai").assert;

const { performSort } = require("../src/sortLib");

describe("#performSort", function() {
  const ioUtils = {
    createReadStream: function() {
      return new eventEmitter();
    },
    inputStream: new eventEmitter()
  };
  it("should perform sorting on given data through given stream", function() {
    const userArgs = ["", ""];
    const printSortResult = function({ error, sortedLines, exitCode }) {
      assert.strictEqual(error, "");
      assert.strictEqual(sortedLines, "a\nb\nc\n");
      assert.strictEqual(exitCode, 2);
    };
    performSort(userArgs, ioUtils, printSortResult);
    const inputStream = ioUtils.inputStream;
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
  });

  it("should give error if the file doesn't exist", function(done) {
    const userArgs = ["", "", "badFile"];
    const printSortResult = function({ error, sortedLines, exitCode }) {
      assert.strictEqual(error, "sort: No such file or directory\n");
      assert.strictEqual(sortedLines, "");
      assert.strictEqual(exitCode, 2);
      done();
    };
    const error = new Error("sort: No such file or directory");
    error.code = "ENOENT";
    performSort(userArgs, ioUtils, printSortResult);
    const inputStream = ioUtils.inputStream;
    inputStream.emit("error", error);
  });

  it("should give default error if no error code matches", function(done) {
    const userArgs = ["", "", "file"];
    const printSortResult = function({ error, sortedLines, exitCode }) {
      assert.strictEqual(error, "sort: Error reading file\n");
      assert.strictEqual(sortedLines, "");
      assert.strictEqual(exitCode, 2);
      done();
    };
    const error = new Error("sort: unknown error");
    error.code = "UNKNOWN";
    performSort(userArgs, ioUtils, printSortResult);
    const inputStream = ioUtils.inputStream;
    inputStream.emit("error", error);
  });
});
