const assert = require('chai').assert;
const sinon = require('sinon');
const { performSort, getInputStream } = require('../src/sortLib');

describe('#getInputStream', function() {
  it('should give process.stdin as inputStream if no file is specified', 
    function() {
      const userArgs = ['', ''];
      const fileInputStream = sinon.spy();
      const stdin = sinon.spy();
      const streams = {
        createReadStream: function() {
          return fileInputStream;
        },
        inputStream: stdin
      };
      const actual = getInputStream(userArgs, streams);
      assert.strictEqual(actual, streams.inputStream);
    });

  it('should give file stream as inputStream if file is specified', function() {
    const userArgs = ['', '', 'file'];
    const fileInputStream = sinon.spy();
    const stdin = sinon.spy();
    const streams = {
      createReadStream: function() {
        return fileInputStream;
      },
      inputStream: stdin
    };
    const actual = getInputStream(userArgs, streams);
    assert.strictEqual(actual, fileInputStream);
  });
});

describe('#performSort', function() {
  it('should give error if the fileStream doesn\'t exist', function() {
    const inputStream = {on: sinon.fake()};
    const onFinish = sinon.fake();
    performSort(inputStream, onFinish);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    assert.strictEqual(inputStream.on.secondCall.args[0], 'error');
    assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
    assert.strictEqual(inputStream.on.callCount, 3);
    inputStream.on.secondCall.args[1]({code: 'ENOENT'});
    const errorMsg = 'sort: No such file or directory\n'
    assert(onFinish.calledOnceWith({ error: errorMsg, sortedLines: '' }));
  });

  it('should perform sorting on given data through stream', function() {
    const onFinish = sinon.spy();
    const inputStream = {on: sinon.fake()};
    performSort(inputStream, onFinish);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    assert.strictEqual(inputStream.on.secondCall.args[0], 'error');
    assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
    assert.strictEqual(inputStream.on.callCount, 3);
    inputStream.on.firstCall.args[1]('a\nb\nc\n');
    inputStream.on.thirdCall.args[1]();
    assert(onFinish.calledOnceWith({ error: '', sortedLines: 'a\nb\nc\n' }));
  });

  it('should give default error if no error code matches', function() {
    const inputStream = {on: sinon.fake()};
    const onFinish = sinon.fake();
    performSort(inputStream, onFinish);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    assert.strictEqual(inputStream.on.secondCall.args[0], 'error');
    assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
    assert.strictEqual(inputStream.on.callCount, 3);
    inputStream.on.secondCall.args[1]({code: 'UNKNOWN'});
    const errorMsg = 'sort: Error reading file\n'
    assert(onFinish.calledOnceWith({ error: errorMsg, sortedLines: '' }));
  });
});
