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
/**
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
var onefold_js, onefold_lists, indexed_list_indexed_list, indexed_list_exported, indexed_list;
onefold_js = function () {
  var onefold_js_arrays, onefold_js_functions, onefold_js_objects, onefold_js_strings, onefold_js_internal, onefold_js;
  onefold_js_arrays = function () {
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
    return {
      contains: function (array, value) {
        return array.indexOf(value) >= 0;
      },
      flatMap: function (array, mapping) {
        return Array.prototype.concat.apply([], array.map(mapping));
      },
      stableSort: function (array, comparator) {
        return stableSort(array, comparator || naturalComparator, true);
      }
    };
  }();
  onefold_js_functions = function () {
    var constant = function (x) {
      return function () {
        return x;
      };
    };
    return {
      true: constant(true),
      false: constant(false),
      nop: constant(undefined),
      null: constant(null),
      zero: constant(0),
      constant: constant,
      identity: function (x) {
        return x;
      }
    };
  }();
  onefold_js_objects = function () {
    function hasOwn(owner, propertyName) {
      return Object.prototype.hasOwnProperty.call(owner, propertyName);
    }
    function forEachProperty(owner, action) {
      for (var propertyName in owner)
        if (hasOwn(owner, propertyName))
          action(propertyName, owner[propertyName]);
    }
    return {
      areEqual: function (a, b) {
        return a === b || !!(a && typeof a.valueOf === 'function' && b && typeof b.valueOf === 'function' && a.valueOf() === b.valueOf());
      },
      extend: function (target) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
          var keys = Object.keys(source);
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var descriptor = Object.getOwnPropertyDescriptor(source, key);
            if (descriptor !== undefined && descriptor.enumerable)
              Object.defineProperty(target, key, descriptor);
          }
        });
        return target;
      },
      forEachProperty: forEachProperty,
      hasOwn: hasOwn
    };
  }();
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
  onefold_js_internal = function (arrays, functions, objects, strings) {
    return {
      arrays: arrays,
      functions: functions,
      objects: objects,
      strings: strings
    };
  }(onefold_js_arrays, onefold_js_functions, onefold_js_objects, onefold_js_strings);
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
        contains: function (element) {
          return this.tryFirstIndexOf(element) >= 0;
        },
        filter: function (predicate) {
          var array = [];
          for (var i = 0; i < this.length; ++i) {
            var element = this.get(i);
            if (predicate(element, i, this))
              array.push(element);
          }
          return new ArrayList(array);
        },
        forEach: function (action) {
          for (var i = 0, length = this.length; i < length; ++i)
            action(this.get(i), i, this);
        },
        get: function (index) {
          return this['get'](index);
        },
        map: function (mapping) {
          var array = new Array(this.length);
          for (var i = 0; i < this.length; ++i)
            array[i] = mapping(this.get(i), i, this);
          return new ArrayList(array);
        },
        readOnly: function () {
          return new ReadOnlyListView(this);
        },
        slice: function (start, end) {
          var length = this.length;
          start = arguments.length <= 0 ? 0 : start >= 0 ? start : length + start;
          end = arguments.length <= 1 ? length : end >= 0 ? end : length + end;
          var resultLength = end - start;
          var array = new Array(resultLength);
          for (var i = 0; i < resultLength; ++i) {
            array[i] = this.get(start + i);
          }
          return new ArrayList(array);
        },
        toArray: function () {
          var array = new Array(this.length);
          this.forEach(function (element, index) {
            array[index] = element;
          });
          return array;
        },
        tryFirstIndexOf: function (element) {
          for (var i = 0; i < this.length; ++i)
            if (this.get(i) === element)
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
        'slice': internal.slice,
        'toArray': internal.toArray,
        'tryFirstIndexOf': internal.tryFirstIndexOf
      };
      return js.objects.extend(internal, exported, extensions);
    }
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
      throw new Error('Es existiert kein Eintrag mit Id \'' + id + '\'.');
    return index;
  }
  function findInsertionIndex(elements, ordering, element, fromIndex, toIndex) {
    if (fromIndex >= toIndex)
      return fromIndex;
    var middle = Math.floor((fromIndex + toIndex) / 2);
    return ordering(element, elements[middle]) < 0 ? findInsertionIndex(elements, ordering, element, fromIndex, middle) : findInsertionIndex(elements, ordering, element, middle + 1, toIndex);
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
    this.elements = [];
    this.elementIdToIndex = {};
    this.ordering = null;
  }
  IndexedList.prototype = lists.listPrototype({
    get length() {
      return this.elements.length;
    },
    get: function (index) {
      return this.elements[index];
    },
    getById: function (id) {
      var index = indexOfById(this.elementIdToIndex, id);
      return this.elements[index];
    },
    clear: function () {
      this.elements = [];
      this.elementIdToIndex = {};
    },
    contains: function (element) {
      var id = idOf(this.idSelector, element);
      return tryIndexOfById(this.elementIdToIndex, id) >= 0;
    },
    containsById: function (id) {
      return tryIndexOfById(this.elementIdToIndex, id) >= 0;
    },
    defineOrdering: function (ordering) {
      var idSelector = this.idSelector;
      var elements = this.elements;
      var elementIdToIndex = this.elementIdToIndex;
      this.ordering = ordering;
      js.arrays.stableSort(elements, ordering);
      var reordered = false;
      for (var i = 0; i < elements.length; ++i) {
        var id = idSelector(elements[i]);
        reordered = reordered || elementIdToIndex[id] !== i;
        elementIdToIndex[id] = i;
      }
      return reordered;
    },
    removeAllById: function (ids) {
      if (!ids.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.elements;
      var elementIdToIndex = this.elementIdToIndex;
      var indicesOffsetBy1 = ids.map(function (id) {
        return indexOfById(elementIdToIndex, id) + 1;
      });
      indicesOffsetBy1.sort(function (a, b) {
        return a - b;
      });
      this.elements = reconstructElements(idSelector, elements, elementIdToIndex, indicesOffsetBy1, function (newArray) {
        var row = newArray.pop();
        var id = idSelector(row);
        delete elementIdToIndex[id];
      });
    },
    removeAll: function (elements) {
      this.removeAllById(elements.map(this.idSelector));
    },
    updateAll: function (updatedElements) {
      if (this.ordering)
        throw new Error('`updateAll` must not be called on an ordered `IndexedTable`. Use a combination of order-preserving' + ' `tryUpdateAll`, `removeAll` and `insertAll` instead.');
      if (!updatedElements.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.elements;
      var elementIdToIndex = this.elementIdToIndex;
      updatedElements.forEach(function (element) {
        var index = indexOfById(elementIdToIndex, idSelector(element));
        elements[index] = element;
      });
    },
    tryUpdateAll: function (updatedElements) {
      if (!this.ordering)
        throw new Error('`tryUpdateAll` is designed for ordered `IndexedTable`s. For unordered ones, use `updateAll` instead.');
      if (!updatedElements.length)
        return [];
      var idSelector = this.idSelector;
      var elements = this.elements;
      var elementIdToIndex = this.elementIdToIndex;
      var ordering = this.ordering;
      var failed = [];
      updatedElements.forEach(function (row) {
        var index = indexOfById(elementIdToIndex, idSelector(row));
        // TODO the below check is good (quick and easy), but when it fails we should check if the
        //      updated element is still greater/less than the one before/after before failing it
        if (ordering(row, elements[index]) !== 0)
          failed.push(row);
        else
          elements[index] = row;
      });
      return failed;
    },
    addAll: function (newElements) {
      if (this.ordering)
        throw new Error('`addAll` must not be called on an ordered `IndexedTable`. Use order-preserving `insertAll` instead.');
      if (!newElements.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.elements;
      var elementIdToIndex = this.elementIdToIndex;
      newElements.forEach(function (row) {
        var id = idSelector(row);
        if (js.objects.hasOwn(elementIdToIndex, id))
          throw new Error('The list already contains an element with id `' + id + '`. Did you mean to call `updateAll`?.');
        elementIdToIndex[id] = elements.push(row) - 1;
      });
    },
    insertAll: function (newElements) {
      if (!this.ordering)
        throw new Error('`insertAll` is designed for ordered `IndexedTable`s. For unordered ones, use `addAll` instead.');
      if (!newElements.length)
        return;
      var idSelector = this.idSelector;
      var elements = this.elements;
      var elementIdToIndex = this.elementIdToIndex;
      var ordering = this.ordering;
      js.arrays.stableSort(newElements, ordering);
      var offset = 0;
      var indices = [];
      newElements.forEach(function (newElement) {
        var insertionIndex = findInsertionIndex(elements, ordering, newElement, offset, elements.length);
        indices.push(insertionIndex);
        offset = insertionIndex;
      });
      offset = 0;
      this.elements = reconstructElements(idSelector, elements, elementIdToIndex, indices, function (newArray) {
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
  IndexedList.prototype['defineOrdering'] = IndexedList.prototype.defineOrdering;
  IndexedList.prototype['removeAllById'] = IndexedList.prototype.removeAllById;
  IndexedList.prototype['removeAll'] = IndexedList.prototype.removeAll;
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