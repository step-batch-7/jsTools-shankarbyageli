const eventEmitter = require("events").EventEmitter;
const assert = require("chai").assert;

const { performSort } = require("../src/sortLib");

describe("#performSort", function() {
  const ioUtils = {
    fs: {
      createReadStream: function() {
        return new eventEmitter();
      }
    },
    inputStream: new eventEmitter()
  };
  it("should perform sorting on given data through given stream", function() {
    const userArgs = ["", ""];
    const outputLoggers = {
      printSortedText: function(textLines) {
        assert.strictEqual(textLines, "a\nb\nc");
      },
      printError: function(errorMsg) {}
    };
    performSort(userArgs, ioUtils, outputLoggers);
    const inputStream = ioUtils.inputStream;
    inputStream.emit("data", "b\n");
    inputStream.emit("data", "c\n");
    inputStream.emit("data", "a\n");
    inputStream.emit("end");
  });

  it("should give error if the file doesn't exist", function(done) {
    const userArgs = ["", "", "badFile"];
    const outputLoggers = {
      printSortedText: function(text) {},
      printError: function(errorMsg) {
        assert.strictEqual(errorMsg, "sort: No such file or directory");
        done();
      }
    };
    const error = new Error("sort: No such file or directory");
    error.code = "ENOENT";
    performSort(userArgs, ioUtils, outputLoggers);
    const inputStream = ioUtils.inputStream;
    inputStream.emit("error", error);
  });

  it("should give default error if no error code matches", function(done) {
    const userArgs = ["", "", "file"];
    const outputLoggers = {
      printSortedText: function(text) {},
      printError: function(errorMsg) {
        assert.strictEqual(errorMsg, "sort: Error reading file");
        done();
      }
    };
    const error = new Error("sort: unknown error");
    error.code = "UNKNOWN";
    performSort(userArgs, ioUtils, outputLoggers);
    const inputStream = ioUtils.inputStream;
    inputStream.emit("error", error);
  });
});
