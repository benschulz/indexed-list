/** @namespace */
de.benshu.indexedList = {};

/**
 * @constructor
 * @template E
 * @extends de.benshu.onefold.lists.List<E>
 *
 * @param {function(E):string} idSelector
 */
de.benshu.indexedList.IndexedList = function (idSelector) {};

/**
 * @returns undefined
 */
de.benshu.indexedList.IndexedList.prototype.clear = function () {};

/**
 * @param {string} id
 * @returns {E}
 */
de.benshu.indexedList.IndexedList.prototype.getById = function (id) {};

/**
 * @param {string} id
 * @returns {boolean}
 */
de.benshu.indexedList.IndexedList.prototype.containsById = function (id) {};

/**
 * @param {Array<E>} elements
 * @returns {undefined}
 */
de.benshu.indexedList.IndexedList.prototype.removeAll = function (elements) {};

/**
 * @param {Array<string>} ids
 * @returns {boolean}
 */
de.benshu.indexedList.IndexedList.prototype.removeAllById = function (ids) {};

/**
 * @param {string} comparator
 * @returns {E}
 */
de.benshu.indexedList.IndexedList.prototype.sortBy = function (comparator) {};

/**
 * @param {Array<E>} updatedElements
 * @returns {undefined}
 */
de.benshu.indexedList.IndexedList.prototype.updateAll = function (updatedElements) {};

/**
 * @param {Array<E>} updatedElements
 * @returns {Array<E>}
 */
de.benshu.indexedList.IndexedList.prototype.tryUpdateAll = function (updatedElements) {};

/**
 * @param {Array<E>} newElements
 * @returns {undefined}
 */
de.benshu.indexedList.IndexedList.prototype.addAll = function (newElements) {};

/**
 * @param {Array<E>} newElements
 * @returns {undefined}
 */
de.benshu.indexedList.IndexedList.prototype.insertAll = function (newElements) {};
