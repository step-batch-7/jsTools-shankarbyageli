const eventEmitter = require("events").EventEmitter;
const assert = require("chai").assert;

const { performSort, performStreamSort } = require("../src/sortLib");

describe("#performStreamSort", function() {
  it("should perform sorting on given data through given stream", function() {
    const inputStream = new eventEmitter();
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
    const error = new Error("sort: No such file or directory");
    error.code = "ENOENT";
    const inputStream = new eventEmitter();
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
    const error = new Error("sort: unknown error");
    error.code = "UNKNOWN";
    const inputStream = new eventEmitter();
    performStreamSort(inputStream, outputLoggers);
    inputStream.emit("error", error);
  });
});
