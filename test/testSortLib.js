const assert = require('chai').assert;
const sinon = require('sinon');
const { performSort, getInputStream } = require('../src/sortLib');

describe('#getInputStream', function() {
  it('should give process.stdin as inputStream if no file is specified', () => {
    const fileInputStream = sinon.spy();
    const stdin = sinon.spy();
    const streams = {
      createReadStream: function() {
        return fileInputStream;
      },
      inputStream: stdin
    };
    const actual = getInputStream([], streams);
    assert.strictEqual(actual, streams.inputStream);
  });

  it('should give file stream as inputStream if file is specified', function() {
    const fileInputStream = sinon.spy();
    const stdin = sinon.spy();
    const streams = {
      createReadStream: function() {
        return fileInputStream;
      },
      inputStream: stdin
    };
    const actual = getInputStream(['one.txt'], streams);
    assert.strictEqual(actual, fileInputStream);
  });
});

describe('#performSort', function() {
  let fileInputStream, stdin, streams;
  beforeEach(function () {
    fileInputStream = {on: sinon.spy()};
    stdin = {on: sinon.spy()};
    streams = {
      createReadStream: function() {
        return fileInputStream;
      },
      inputStream: stdin
    };
  });

  const assertForEach = function(stream) {
    assert.strictEqual(stream.on.firstCall.args[0], 'data');
    assert.strictEqual(stream.on.secondCall.args[0], 'error');
    assert.strictEqual(stream.on.thirdCall.args[0], 'end');
    assert(stream.on.calledThrice);
  };

  it('should give error if the fileStream doesn\'t exist', function() {
    const onFinish = sinon.fake();
    performSort(['', '', 'badFile.txt'], streams, onFinish);
    assertForEach(fileInputStream);
    fileInputStream.on.secondCall.args[1]({code: 'ENOENT'});
    const errorMsg = 'sort: No such file or directory\n';
    assert(onFinish.calledOnceWith(errorMsg, ''));
  });

  it('should perform sorting on given data through stream', function() {
    const onFinish = sinon.spy();
    performSort(['', ''], streams, onFinish);
    assertForEach(stdin);
    stdin.on.firstCall.args[1]('a\nb\nc\n');
    stdin.on.thirdCall.args[1]();
    assert(onFinish.calledOnceWith('', 'a\nb\nc\n'));
  });

  it('should give error if options are invalid', function() {
    const onFinish = sinon.spy();
    performSort(['', '', '-p'], streams, onFinish);
    assert.strictEqual(stdin.on.callCount, 0);
    const errorMsg = 'sort: invalid option -- p\n';
    assert(onFinish.calledOnceWith(errorMsg, ''));
  });

  it('should give default error if error is not in list', function() {
    const onFinish = sinon.fake();
    performSort(['', '', 'file'], streams, onFinish);
    assertForEach(fileInputStream);
    fileInputStream.on.secondCall.args[1]({code: 'UNKNOWN'});
    const errorMsg = 'sort: Error reading file\n';
    assert(onFinish.calledWith(errorMsg, ''));
  });
});
