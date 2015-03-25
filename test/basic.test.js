'use strict';

define(['indexed-list'], function (IndexedList) {
    function toString(f) {
        return function () { return '' + f.apply(this, arguments); };
    }

    var identityId = toString(function (x) { return x; });
    var sqrtId = toString(function (x) { return Math.sqrt(x); });

    describe('Basic `IndexedList` tests:', function () {
        it('A new list should be empty.', function () {
            var list = new IndexedList(identityId);

            expect(list.length).to.equal(0);
        });

        it('A `clear()`ed list should be empty.', function () {
            var list = new IndexedList(identityId);
            list.addAll([1, 2, 3]);

            list.clear();

            expect(list.length).to.equal(0);
        });

        describe('After calling `addAll([1, 2, 3])` on a brand new list', function () {
            function declare(description, assertion) {
                it(description, function () {
                    var list = new IndexedList(identityId);

                    list.addAll([1, 2, 3]);

                    assertion(list);
                });
            }

            declare('it should have a `size` of `3`.', function (list) { expect(list.length).to.equal(3); });
            declare('it should contain `1`.', function (list) { expect(list.contains(1)).to.equal(true); });
            declare('it should contain `3`.', function (list) { expect(list.contains(3)).to.equal(true); });
            declare('it should contain `2`.', function (list) { expect(list.contains(2)).to.equal(true); });
        });

        it('`getById` should return the element with with the given id.', function () {
            var list = new IndexedList(sqrtId);

            list.addAll([5 * 5, 7 * 7, 11 * 11]);

            expect(list.getById('7')).to.equal(7 * 7);
        });

    });
});
