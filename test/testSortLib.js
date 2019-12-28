const ReadableStream = require('stream').Readable;
const assert = require('chai').assert;
const { performSort, getInputStream } = require('../src/sortLib');

describe('#getInputStream', function() {
  it('should give process.stdin as inputStream if no file is specified', 
    function() {
      const userArgs = ['', ''];
      const fileInputStream = new ReadableStream();
      const streams = {
        createReadStream: function() {
          return fileInputStream;
        },
        inputStream: process.stdin
      };
      const actual = getInputStream(userArgs, streams);
      assert.strictEqual(actual, process.stdin);
    });

  it('should give file stream as inputStream if file is specified', function() {
    const userArgs = ['', '', 'file'];
    const fileInputStream = new ReadableStream();
    const streams = {
      createReadStream: function() {
        return fileInputStream;
      },
      inputStream: process.stdin
    };
    const actual = getInputStream(userArgs, streams);
    assert.strictEqual(actual, fileInputStream);
  });
});

describe('#performSort', function() {
  it('should give error if the file doesn\'t exist', function() {
    let callCount = 0;
    const calledOnce = 1;
    const printSortResult = function({ error, sortedLines }) {
      assert.strictEqual(error, 'sort: No such file or directory\n');
      assert.strictEqual(sortedLines, '');
      inputStream.removeAllListeners();
      callCount++;
    };
    const error = new Error('sort: No such file or directory');
    error.code = 'ENOENT';
    const inputStream = new ReadableStream();
    inputStream._read = function() {};
    performSort(inputStream, printSortResult);
    inputStream.emit('error', error);
    assert.strictEqual(callCount, calledOnce);
  });

  it('should perform sorting on given data through given stream', function() {
    let callCount = 0;
    const calledOnce = 1;
    const printSortResult = function({ error, sortedLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(sortedLines, 'a\nb\nc\n');
      callCount++;
    };
    const inputStream = new ReadableStream();
    inputStream._read = function() {};
    performSort(inputStream, printSortResult);
    inputStream.emit('data', 'b\nc\na\n');
    inputStream.emit('end');
    assert.strictEqual(callCount, calledOnce);
  });

  it('should give default error if no error code matches', function() {
    let callCount = 0;
    const calledOnce = 1;
    const printSortResult = function({ error, sortedLines }) {
      assert.strictEqual(error, 'sort: Error reading file\n');
      assert.strictEqual(sortedLines, '');
      inputStream.removeAllListeners();
      callCount++;
    };
    const error = new Error('sort: unknown error');
    error.code = 'UNKNOWN';
    const inputStream = new ReadableStream();
    inputStream._read = function() {};
    performSort(inputStream, printSortResult);
    inputStream.emit('error', error);
    assert.strictEqual(callCount, calledOnce);
  });
});
