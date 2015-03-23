'use strict';

define(['./indexed-list'], function (IndexedList) {
    IndexedList.prototype['clear'] = IndexedList.prototype.clear;
    IndexedList.prototype['getById'] = IndexedList.prototype.getById;
    IndexedList.prototype['containsById'] = IndexedList.prototype.containsById;
    IndexedList.prototype['removeAllById'] = IndexedList.prototype.removeAllById;
    IndexedList.prototype['removeAll'] = IndexedList.prototype.removeAll;
    IndexedList.prototype['sortBy'] = IndexedList.prototype.sortBy;
    IndexedList.prototype['updateAll'] = IndexedList.prototype.updateAll;
    IndexedList.prototype['tryUpdateAll'] = IndexedList.prototype.tryUpdateAll;
    IndexedList.prototype['addAll'] = IndexedList.prototype.addAll;
    IndexedList.prototype['insertAll'] = IndexedList.prototype.insertAll;

    return IndexedList;
})
;
