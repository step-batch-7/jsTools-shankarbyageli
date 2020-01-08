const { assert } = require('chai');
const { parseUserArgs } = require('../src/inputHandling');

describe('#parseUserArgs', function () {
  it('should parse the valid user arguments', function () {
    const userArgs = ['-n', 'test.txt'];
    const optionsLookup = {
      '-n': 'numericSort'
    };
    const actual = parseUserArgs(userArgs, optionsLookup);
    assert.deepStrictEqual(actual, {
      options: { numericSort: true }, files: ['test.txt']
    });
  });

  it('should give error if invalid option is given', function () {
    const userArgs = ['-n', '-p', 'test.txt'];
    const optionsLookup = {
      '-n': 'numericSort'
    };
    const actual = parseUserArgs(userArgs, optionsLookup);
    assert.deepStrictEqual(actual, {
      options: { numericSort: true, invalidOption: '-p' }, files: []
    });
  });
});
