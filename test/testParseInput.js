const assert = require("chai").assert;
const { parseUserArgs } = require("../src/parseInput");

describe("#parseUserArgs", function() {
  it("should give a object of file and options for valid input", function() {
    const args = ["-n", "-r"];
    const actual = parseUserArgs(args);
    const expected = {
      files: [],
      options: ["-n", "-r"]
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if invalid options are given", function() {
    const args = ["-k", "file"];
    assert.throws(function() {
      parseUserArgs(args);
    }, Error);
  });
});
