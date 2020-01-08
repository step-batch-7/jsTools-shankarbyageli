const assert = require('chai').assert;
const Sort = require('../src/sortUtils');

describe('Sort', function () {
  describe('#hasError', function () {
    it('should return true if options are invalid', function () {
      const sort = new Sort({ invalidOption: '-k' });
      const actual = sort.hasError();
      assert.isOk(actual);
    });
    it('should return false if options are valid', function () {
      const sort = new Sort({ options: { numericSort: true } });
      const actual = sort.hasError();
      assert.isNotOk(actual);
    });
  });

  describe('#perform', function () {
    it('should sort given text and remove empty line at end', function () {
      const sort = new Sort({});
      const lines = 'c\na\nb\n';
      const actual = sort.perform(lines);
      assert.strictEqual(actual, 'a\nb\nc');
    });

    it('should sort given text without empty line at end', function () {
      const sort = new Sort({});
      const lines = 'c\na\nb';
      const actual = sort.perform(lines);
      assert.strictEqual(actual, 'a\nb\nc');
    });

    it('should sort given numeric text given -n option', function () {
      const sort = new Sort({ numericSort: true });
      const lines = '12\n6\n2\n7\n1\n2';
      const actual = sort.perform(lines);
      assert.strictEqual(actual, '1\n2\n2\n6\n7\n12');
    });

    it('should sort given alphanumeric text given -n option', function () {
      const sort = new Sort({ numericSort: true });
      const lines = '4\n12s\n6\na\nten\n1\n2';
      const actual = sort.perform(lines);
      assert.strictEqual(actual, 'a\nten\n1\n2\n4\n6\n12s');
    });
  });
});
