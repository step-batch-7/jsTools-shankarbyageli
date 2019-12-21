const assert = require("chai").assert;
const { parseUserArgs } = require("../src/sortLib");

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
    assert.throws(
      function() {
        parseUserArgs(args);
      },
      Error,
      "Invalid option"
    );
  });
});
