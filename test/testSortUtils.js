const assert = require('chai').assert;
const sinon = require('sinon');
const {sortTextLines} = require('../src/sortUtils');

describe('#sortTextLines', function() {
  it('should sort given text lines and remove empty line at end', function() {
    const lines = 'c\na\nb\n';
    const done = sinon.spy();
    sortTextLines(lines, done);
    assert.isOk(done.calledOnceWith({ sortedLines: ['a', 'b', 'c'] }));
  });

  it('should sort given text without empty line at end', function() {
    const lines = 'c\na\nb';
    const done = sinon.spy();
    sortTextLines(lines, done);
    assert.isOk(done.calledOnceWith({ sortedLines: ['a', 'b', 'c'] }));
  });
});
