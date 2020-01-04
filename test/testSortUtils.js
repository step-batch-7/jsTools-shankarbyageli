const assert = require('chai').assert;
const {sortTextLines} = require('../src/sortUtils');

describe('#sortTextLines', function () {
  it('should sort given text lines and remove empty line at end', function () {
    const lines = 'c\na\nb\n';
    const actual = sortTextLines(lines, []);
    assert.strictEqual(actual, 'a\nb\nc');
  });

  it('should sort given text without empty line at end', function () {
    const lines = 'c\na\nb';
    const actual = sortTextLines(lines, []);
    assert.strictEqual(actual, 'a\nb\nc');
  });

  it('should sort given numeric text numerically given -n option', function () {
    const lines = '12\n6\n2\n7\n1\n2';
    const actual = sortTextLines(lines, ['-n']);
    assert.strictEqual(actual, '1\n2\n2\n6\n7\n12');
  });

  it('should sort given alphanumeric text given -n option', function () {
    const lines = '4\n12s\n6\na\nten\n1\n2';
    const actual = sortTextLines(lines, ['-n']);
    assert.strictEqual(actual, 'a\nten\n1\n2\n4\n6\n12s');
  });
});
