const {assert, expect} = require('chai');
const {parseUserArgs} = require('../src/inputHandling');

describe('#parseUserArgs', function () {
  it('should parse the valid user arguments', function () {
    const userArgs = ['-n', 'test.txt'];
    const actual = parseUserArgs(userArgs);
    assert.deepStrictEqual(actual, {options: ['-n'], files: ['test.txt']});
  });

  it('should give error if invalid option is given', function () {
    const userArgs = ['-n', '-p', 'test.txt'];
    const actual = parseUserArgs(userArgs);
    expect(actual).to.deep.include({error: {code: 'INVDOP', option: 'p'}});
  });
});
