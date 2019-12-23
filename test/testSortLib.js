const fs = require("fs");
const assert = require("chai").assert;
const {
  parseUserArgs,
  loadFileContents,
  sortContent
} = require("../src/sortLib");

describe("#parseUserArgs", function() {
  it("should give a object of file and options for valid input", function() {
    const args = ["-n", "file"];
    const actual = parseUserArgs(args);
    const expected = {
      files: ["file"],
      options: ["-n"]
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if invalid options are given", function() {
    const args = ["-n", "-k", "file"];
    assert.throw(function() {
      parseUserArgs(args);
    }, Error);
  });
});

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
