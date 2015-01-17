'use strict';

define(['indexed-list'], function (IndexedList) {
    function toString(f) {
        return function () { return '' + f.apply(this, arguments); };
    }

    var identityId = toString(function (x) { return x; });

    describe('Ordered `IndexedList` tests:', function () {
        describe('After calling `insertAll([2, 3, 1])` on a brand new, naturally ordered list', function () {
            function declare(description, assertion) {
                it(description, function () {
                    var list = new IndexedList(identityId);
                    list.defineOrdering(function (a, b) { return a - b; });

                    list.insertAll([2, 3, 1]);

                    assertion(list);
                });
            }

            declare('it should have a `size` of `3`.', function (list) { expect(list.length).to.equal(3); });
            declare('it should contain `1` at index `0`.', function (list) { expect(list.get(0)).to.equal(1); });
            declare('it should contain `2` at index `1`.', function (list) { expect(list.get(1)).to.equal(2); });
            declare('it should contain `3` at index `2`.', function (list) { expect(list.get(2)).to.equal(3); });
        });
    });
});
