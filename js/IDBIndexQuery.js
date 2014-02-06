var IDBIndexQuery = (function () {
    "use strict";

    // private attributes an methods
    var IDBIndexQuery, filters = [], objectStore, indexName;

    // constructor
    IDBIndexQuery = function (store, index) {
        objectStore = store;
        indexName = index;
        console.log("constructor");
    };

    IDBIndexQuery.prototype = {
        constructor: IDBIndexQuery,
        onQuery: function (result) {},
        execute: function () {
            var index = indexName ? objectStore.store.index(indexName) : objectStore.store,
                result = [];

            index.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;

                if (cursor) {
                   var item = cursor.value;

                    filters.forEach(function (filter) {
                        if (item[filter.field] === filter.value) {
                            result.push(item);
                        }
                    });

                    cursor.continue();
                }
            };

            objectStore.transaction.oncomplete = function () {
                this.onQuery(result);
            }.bind(this);

            return this;
        },
        filter: function (field, value) {
            filters.push({
                "field": field,
                "value": value
            });

            return this;
        },
        only: function (value) {
            return this;
        }
    };

    // return module
    return IDBIndexQuery;
}());