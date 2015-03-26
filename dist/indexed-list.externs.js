

/**
 * @constructor
 * @template E
 * @extends onefold.lists.List<E>
 *
 * @param {function(E):string} idSelector
 */
function IndexedList(idSelector) {}

/**
 * @returns undefined
 */
IndexedList.prototype.clear = function () {};

/**
 * @param {string} id
 * @returns {E}
 */
IndexedList.prototype.getById = function (id) {};

/**
 * @param {string} id
 * @returns {boolean}
 */
IndexedList.prototype.containsById = function (id) {};

/**
 * @param {Array<E>} elements
 * @returns {undefined}
 */
IndexedList.prototype.removeAll = function (elements) {};

/**
 * @param {Array<string>} ids
 * @returns {boolean}
 */
IndexedList.prototype.removeAllById = function (ids) {};

/**
 * @param {string} comparator
 * @returns {E}
 */
IndexedList.prototype.sortBy = function (comparator) {};

/**
 * @param {Array<E>} updatedElements
 * @returns {undefined}
 */
IndexedList.prototype.updateAll = function (updatedElements) {};

/**
 * @param {Array<E>} updatedElements
 * @returns {Array<E>}
 */
IndexedList.prototype.tryUpdateAll = function (updatedElements) {};

/**
 * @param {Array<E>} newElements
 * @returns {undefined}
 */
IndexedList.prototype.addAll = function (newElements) {};

/**
 * @param {Array<E>} newElements
 * @returns {undefined}
 */
IndexedList.prototype.insertAll = function (newElements) {};