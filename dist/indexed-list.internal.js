/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
define(['onefold-lists', 'onefold-js'],    function(onefold_lists, onefold_js) {
var indexed_list_indexed_list, indexed_list;

indexed_list_indexed_list = function (js, lists) {
  function checkId(id) {
    if (typeof id !== 'string')
      throw new Error('Ids must be strings. (given: `' + id + '`, type: `' + typeof id + '`)');
    return id;
  }
  // TODO consider calling the following functions with explicit `this` rather than passing symbol values
  function idOf(idSelector, element) {
    return idSelector(element);
  }
  function tryIndexOfById(elementIdToIndex, id) {
    return js.objects.hasOwn(elementIdToIndex, checkId(id)) ? elementIdToIndex[id] : -1;
  }
  function indexOfById(elementIdToIndex, id) {
    var index = tryIndexOfById(elementIdToIndex, id);
    if (index < 0)
      throw new Error('Es existiert kein Eintrag mit Id \'' + id + '\'.');
    return index;
  }
  function findInsertionIndex(elements, comparator, element, fromIndex, toIndex) {
    if (fromIndex >= toIndex)
      return fromIndex;
    var middle = Math.floor((fromIndex + toIndex) / 2);
    return comparator(element, elements[middle]) < 0 ? findInsertionIndex(elements, comparator, element, fromIndex, middle) : findInsertionIndex(elements, comparator, element, middle + 1, toIndex);
  }
  function reconstructElements(idSelector, originalElements, elementIdToIndex, indizes, inbetween) {
    var reconstructedElements = [];
    var appendSlice = function (fromIndex, toIndex) {
      var baseIndex = reconstructedElements.length;
      var slice = originalElements.slice(fromIndex, toIndex);
      reconstructedElements = reconstructedElements.concat(slice);
      slice.forEach(function (row) {
        elementIdToIndex[idSelector(row)] = baseIndex;
        ++baseIndex;
      });
    };
    var offset = 0;
    indizes.forEach(function (index) {
      appendSlice(offset, index);
      offset = index;
      inbetween(reconstructedElements);
    });
    appendSlice(offset, originalElements.length);
    return reconstructedElements;
  }
  function IndexedList(idSelector) {
    this.idSelector = function (element) {
      return checkId(idSelector(element));
    };
    this.__elements = [];
    this.__elementIdToIndex = {};
    this.__comparator = null;
  }
  IndexedList.prototype = lists.listPrototype({
    get length() {
      return this.__elements.length;
    },
    get: function (index) {
      return this.__elements[index];
    },
    getById: function (id) {
      var index = indexOfById(this.__elementIdToIndex, id);
      return this.__elements[index];
    },
    clear: function () {
      this.__elements = [];
      this.__elementIdToIndex = {};
    },
    contains: function (element) {
      var id = idOf(this.idSelector, element);
      return tryIndexOfById(this.__elementIdToIndex, id) >= 0;
    },
    containsById: function (id) {
      return tryIndexOfById(this.__elementIdToIndex, id) >= 0;
    },
    removeAll: function (elements) {
      this.removeAllById(elements.map(this.idSelector));
    },
    removeAllById: function (ids) {
      if (!ids.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.__elements;
      var elementIdToIndex = this.__elementIdToIndex;
      var indicesOffsetBy1 = ids.map(function (id) {
        return indexOfById(elementIdToIndex, id) + 1;
      });
      indicesOffsetBy1.sort(function (a, b) {
        return a - b;
      });
      this.__elements = reconstructElements(idSelector, elements, elementIdToIndex, indicesOffsetBy1, function (newArray) {
        var row = newArray.pop();
        var id = idSelector(row);
        delete elementIdToIndex[id];
      });
    },
    sortBy: function (comparator) {
      var idSelector = this.idSelector;
      var elements = this.__elements;
      var elementIdToIndex = this.__elementIdToIndex;
      this.__comparator = comparator;
      js.arrays.stableSort(elements, comparator);
      var reordered = false;
      for (var i = 0; i < elements.length; ++i) {
        var id = idSelector(elements[i]);
        reordered = reordered || elementIdToIndex[id] !== i;
        elementIdToIndex[id] = i;
      }
      return reordered;
    },
    updateAll: function (updatedElements) {
      if (this.__comparator)
        throw new Error('`updateAll` must not be called on a sorted `IndexedTable`. Use a combination of order-preserving' + ' `tryUpdateAll`, `removeAll` and `insertAll` instead.');
      if (!updatedElements.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.__elements;
      var elementIdToIndex = this.__elementIdToIndex;
      updatedElements.forEach(function (element) {
        var index = indexOfById(elementIdToIndex, idSelector(element));
        elements[index] = element;
      });
    },
    tryUpdateAll: function (updatedElements) {
      if (!this.__comparator)
        throw new Error('`tryUpdateAll` is designed for sorted `IndexedTable`s. For unsorted ones, use `updateAll` instead.');
      if (!updatedElements.length)
        return [];
      var idSelector = this.idSelector;
      var elements = this.__elements;
      var elementIdToIndex = this.__elementIdToIndex;
      var comparator = this.__comparator;
      var failed = [];
      updatedElements.forEach(function (updatedElement) {
        var index = indexOfById(elementIdToIndex, idSelector(updatedElement));
        // TODO the below check is good (quick and easy), but when it fails we should check if the
        //      updated element is still greater/less than the one before/after before failing it
        if (comparator(updatedElement, elements[index]) !== 0)
          failed.push(updatedElement);
        else
          elements[index] = updatedElement;
      });
      return failed;
    },
    addAll: function (newElements) {
      if (this.__comparator)
        throw new Error('`addAll` must not be called on an sorted `IndexedTable`. Use order-preserving `insertAll` instead.');
      if (!newElements.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.__elements;
      var elementIdToIndex = this.__elementIdToIndex;
      newElements.forEach(function (row) {
        var id = idSelector(row);
        if (js.objects.hasOwn(elementIdToIndex, id))
          throw new Error('The list already contains an element with id `' + id + '`. Did you mean to call `updateAll`?.');
        elementIdToIndex[id] = elements.push(row) - 1;
      });
    },
    insertAll: function (newElements) {
      if (!this.__comparator)
        throw new Error('`insertAll` is designed for sorted `IndexedTable`s. For unsorted ones, use `addAll` instead.');
      if (!newElements.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.__elements;
      var elementIdToIndex = this.__elementIdToIndex;
      var comparator = this.__comparator;
      js.arrays.stableSort(newElements, comparator);
      var offset = 0;
      var indices = [];
      newElements.forEach(function (newElement) {
        var insertionIndex = findInsertionIndex(elements, comparator, newElement, offset, elements.length);
        indices.push(insertionIndex);
        offset = insertionIndex;
      });
      offset = 0;
      this.__elements = reconstructElements(idSelector, elements, elementIdToIndex, indices, function (newArray) {
        var row = newElements[offset];
        var id = idSelector(row);
        var index = newArray.length;
        newArray.push(row);
        elementIdToIndex[id] = index;
        ++offset;
      });
    }
  });
  return IndexedList;
}(onefold_js, onefold_lists);
indexed_list = function (main) {
  return main;
}(indexed_list_indexed_list);return indexed_list;
});