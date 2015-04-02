/**
 * @license Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
;(function(factory) {
    if (typeof define === 'function' && define['amd'])
        define([], factory);
    else
        window['indexed-list'] = factory();
} (function() {
/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
var onefold_js, onefold_lists, indexed_list_indexed_list, indexed_list_exported, indexed_list;
onefold_js = function () {
  var onefold_js_objects, onefold_js_arrays, onefold_js_strings, onefold_js_internal, onefold_js;
  onefold_js_objects = function () {
    return {
      areEqual: areEqual,
      extend: extend,
      forEachProperty: forEachProperty,
      hasOwn: hasOwn,
      mapProperties: mapProperties
    };
    function areEqual(a, b) {
      if (a === b)
        return true;
      var aHasValue = !!a && typeof a.valueOf === 'function';
      var bHasValue = !!b && typeof b.valueOf === 'function';
      return aHasValue && bHasValue && a.valueOf() === b.valueOf();
    }
    function extend(object, extensions) {
      Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        var keys = Object.keys(source);
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var descriptor = Object.getOwnPropertyDescriptor(source, key);
          if (descriptor !== undefined && descriptor.enumerable)
            Object.defineProperty(object, key, descriptor);
        }
      });
      return object;
    }
    function forEachProperty(owner, action) {
      for (var propertyName in owner)
        if (hasOwn(owner, propertyName))
          action(propertyName, owner[propertyName]);
    }
    function hasOwn(owner, propertyName) {
      return Object.prototype.hasOwnProperty.call(owner, propertyName);
    }
    function mapProperties(source, mapper) {
      var destination = {};
      for (var propertyName in source)
        if (hasOwn(source, propertyName))
          destination[propertyName] = mapper(source[propertyName], propertyName, source);
      return destination;
    }
  }();
  onefold_js_arrays = function (objects) {
    return {
      contains: contains,
      distinct: distinct,
      flatMap: flatMap,
      single: single,
      singleOrNull: singleOrNull,
      stableSort: stableSortInPlace
    };
    function contains(array, value) {
      return array.indexOf(value) >= 0;
    }
    function distinct(array) {
      return array.length > 50 ? distinctForLargeArrays(array) : distinctForSmallArrays(array);
    }
    function distinctForSmallArrays(array) {
      return array.filter(function (e, i, a) {
        return a.lastIndexOf(e) === i;
      });
    }
    function distinctForLargeArrays(source) {
      var length = source.length, stringLookup = {}, value;
      for (var i = 0; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (objects.hasOwn(stringLookup, value))
            break;
          else
            stringLookup[value] = true;
        } else if (source.lastIndexOf(value) !== i) {
          break;
        }
      }
      if (i >= length)
        return source;
      var destination = source.slice(0, i);
      for (; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (!objects.hasOwn(stringLookup, value)) {
            stringLookup[value] = true;
            destination.push(value);
          }
        } else if (source.lastIndexOf(value) === i) {
          destination.push(value);
        }
      }
      return destination;
    }
    function flatMap(array, mapper) {
      return Array.prototype.concat.apply([], array.map(mapper));
    }
    function single(array, predicate) {
      var index = trySingleIndex(array, predicate);
      if (index < 0)
        throw new Error('None of the elements matches the predicate.');
      return array[index];
    }
    function singleOrNull(array, predicate) {
      var index = trySingleIndex(array, predicate);
      return index >= 0 ? array[index] : null;
    }
    function trySingleIndex(array, predicate) {
      var length = array.length, matchIndex = -1;
      for (var i = 0; i < length; ++i) {
        var element = array[i];
        if (predicate(element)) {
          if (matchIndex >= 0)
            throw new Error('Multiple elements match the predicate.');
          matchIndex = i;
        }
      }
      return matchIndex;
    }
    function stableSortInPlace(array, comparator) {
      return stableSort(array, comparator || naturalComparator, true);
    }
    function naturalComparator(a, b) {
      return a && typeof a.valueOf === 'function' && b && typeof b.valueOf === 'function' ? a.valueOf() <= b.valueOf() ? a.valueOf() < b.valueOf() ? -1 : 0 : 1 : a <= b ? a < b ? -1 : 0 : 1;
    }
    function stableSort(source, comparator, sortSource) {
      var isChrome = !!window['chrome'];
      var nativeSortIsStable = !isChrome;
      return nativeSortIsStable ? stableSortNative(source, comparator, sortSource) : stableSortCustom(source, comparator, sortSource);
    }
    function stableSortNative(source, comparator, sortSource) {
      var destination = sortSource === true ? source : source.slice();
      destination.sort(comparator);
      return destination;
    }
    function stableSortCustom(source, comparator, sortSource) {
      var length = source.length;
      var indexes = new Array(length);
      var destination = new Array(length);
      var i;
      // TODO performance benchark: would it be better copy source via .slice()?
      //      i would hope this does pretty much the same as .slice() but we give
      //      out-of-order execution the chance to absorb more cache misses until
      //      the prefetcher kicks in
      for (i = 0; i < length; ++i) {
        indexes[i] = i;
        destination[i] = source[i];
      }
      if (sortSource === true) {
        var tmp = source;
        source = destination;
        destination = tmp;
      }
      indexes.sort(function (a, b) {
        var byOrdering = comparator(source[a], source[b]);
        return byOrdering || a - b;
      });
      for (i = 0; i < length; ++i)
        destination[i] = source[indexes[i]];
      return destination;
    }
  }(onefold_js_objects);
  onefold_js_strings = {
    convertCamelToHyphenCase: function (camelCased) {
      return camelCased.replace(/([A-Z])/g, function (match) {
        return '-' + match.toLowerCase();
      });
    },
    convertHyphenToCamelCase: function (hyphenCased) {
      return hyphenCased.replace(/-([a-z])/g, function (match) {
        return match[1].toUpperCase();
      });
    },
    format: function (formatString) {
      var args = arguments;
      return formatString.replace(/{(\d+)}/g, function (match, number) {
        var argumentIndex = parseInt(number, 10) + 1;
        return typeof args.length <= argumentIndex ? match : args[argumentIndex];
      });
    }
  };
  onefold_js_internal = function (arrays, objects, strings) {
    return {
      arrays: arrays,
      objects: objects,
      strings: strings
    };
  }(onefold_js_arrays, onefold_js_objects, onefold_js_strings);
  onefold_js = function (main) {
    return main;
  }(onefold_js_internal);
  return onefold_js;
}();
onefold_lists = function (onefold_js) {
  var onefold_lists_internal, onefold_lists;
  onefold_lists_internal = function (js) {
    function prototyper(extensions) {
      var internal = {
        get length() {
          return this['length'];
        },
        contains: function (value) {
          return this.tryFirstIndexOf(value) >= 0;
        },
        filter: function (predicate) {
          var length = this.length, array = [];
          for (var i = 0; i < length; ++i) {
            var element = this.get(i);
            if (predicate(element, i, this))
              array.push(element);
          }
          return new ArrayList(array);
        },
        forEach: function (action) {
          var length = this.length;
          for (var i = 0; i < length; ++i)
            action(this.get(i), i, this);
        },
        get: function (index) {
          return this['get'](index);
        },
        map: function (mapping) {
          var length = this.length, array = new Array(length);
          for (var i = 0; i < length; ++i)
            array[i] = mapping(this.get(i), i, this);
          return new ArrayList(array);
        },
        readOnly: function () {
          return new ReadOnlyListView(this);
        },
        reduce: function (accumulator, identity) {
          var initialValueSpecified = arguments.length > 1;
          var length = this.length;
          if (!initialValueSpecified && length === 0)
            throw new TypeError('An empty list can not be reduced, specify an initial value.');
          var aggregate = initialValueSpecified ? identity : this.get(0);
          for (var i = initialValueSpecified ? 0 : 1; i < length; ++i)
            aggregate = accumulator(aggregate, this.get(i));
          return aggregate;
        },
        slice: function (beginIndex, endIndex) {
          var length = this.length;
          beginIndex = arguments.length <= 0 ? 0 : beginIndex >= 0 ? beginIndex : length + beginIndex;
          endIndex = arguments.length <= 1 ? length : endIndex >= 0 ? endIndex : length + endIndex;
          var resultLength = endIndex - beginIndex;
          var array = new Array(resultLength);
          for (var i = 0; i < resultLength; ++i) {
            array[i] = this.get(beginIndex + i);
          }
          return new ArrayList(array);
        },
        toArray: function () {
          var length = this.length, array = new Array(length);
          for (var i = 0; i < length; ++i)
            array[i] = this.get(i);
          return array;
        },
        tryFirstIndexOf: function (value) {
          var length = this.length;
          for (var i = 0; i < length; ++i)
            if (this.get(i) === value)
              return i;
          return -1;
        }
      };
      var exported = {
        get 'length'() {
          return this.length;
        },
        'contains': internal.contains,
        'filter': internal.filter,
        'forEach': internal.forEach,
        'get': function (index) {
          return this.get(index);
        },
        'map': internal.map,
        'readOnly': internal.readOnly,
        'reduce': internal.reduce,
        'slice': internal.slice,
        'toArray': internal.toArray,
        'tryFirstIndexOf': internal.tryFirstIndexOf
      };
      return js.objects.extend(internal, exported, extensions);
    }
    /**
     * @constructor
     * @template E
     *
     * @param {Array<E>} array
     */
    function ArrayList(array) {
      this.__array = array;
    }
    ArrayList.prototype = prototyper({
      get length() {
        return this.__array.length;
      },
      get: function (index) {
        return this.__array[index];
      },
      toArray: function () {
        return this.__array.slice();
      }
    });
    /**
     * @constructor
     * @template E
     *
     * @param {de.benshu.onefold.lists.List<E>} list
     */
    function ReadOnlyListView(list) {
      this.__list = list;
    }
    ReadOnlyListView.prototype = prototyper({
      get length() {
        return this.__list.length;
      },
      get: function (index) {
        return this.__list.get(index);
      }
    });
    return {
      newArrayList: function (array) {
        return new ArrayList(array || []);
      },
      listPrototype: prototyper
    };
  }(onefold_js);
  onefold_lists = function (main) {
    return main;
  }(onefold_lists_internal);
  return onefold_lists;
}(onefold_js);

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
      throw new Error('No element with id `' + id + '`.');
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
      return this.__elements[indexOfById(this.__elementIdToIndex, id)];
    },
    tryGetById: function (id) {
      var index = tryIndexOfById(this.__elementIdToIndex, id);
      return index >= 0 ? this.__elements[index] : null;
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

indexed_list_exported = function (IndexedList) {
  IndexedList.prototype['clear'] = IndexedList.prototype.clear;
  IndexedList.prototype['getById'] = IndexedList.prototype.getById;
  IndexedList.prototype['containsById'] = IndexedList.prototype.containsById;
  IndexedList.prototype['removeAll'] = IndexedList.prototype.removeAll;
  IndexedList.prototype['removeAllById'] = IndexedList.prototype.removeAllById;
  IndexedList.prototype['sortBy'] = IndexedList.prototype.sortBy;
  IndexedList.prototype['updateAll'] = IndexedList.prototype.updateAll;
  IndexedList.prototype['tryUpdateAll'] = IndexedList.prototype.tryUpdateAll;
  IndexedList.prototype['addAll'] = IndexedList.prototype.addAll;
  IndexedList.prototype['insertAll'] = IndexedList.prototype.insertAll;
  return IndexedList;
}(indexed_list_indexed_list);
indexed_list = function (main) {
  return main;
}(indexed_list_exported);return indexed_list;
}));