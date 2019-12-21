const assert = require("chai").assert;
const { parseUserArgs, loadFileContents } = require("../src/sortLib");

describe("#parseUserArgs", function() {
  it("should give a object of file and options for valid input", function() {
    const args = ["-n", "file"];
    const actual = parseUserArgs(args);
    const expected = {
      filename: ["file"],
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
