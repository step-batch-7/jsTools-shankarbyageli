const assert = require('chai').assert;
const {sortTextLines} = require('../src/sortUtils');

describe('#sortTextLines', function() {
  it('should sort given text lines and remove empty line at end', function() {
    const lines = 'c\na\nb\n';
    const actual = sortTextLines(lines);
    assert.strictEqual(actual, 'a\nb\nc');
  });

  it('should sort given text without empty line at end', function() {
    const lines = 'c\na\nb';
    const actual = sortTextLines(lines);
    assert.strictEqual(actual, 'a\nb\nc');
  });
});
