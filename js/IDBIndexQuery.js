var IDBIndexQuery = (function () {
    "use strict";

    // private attributes an methods
    var IDBIndexQuery, filters = [], config, getObjectStore, indexName,
        queryOptions = {indexName: null, keyRange: null};

    getObjectStore = function (table, transactionMode) {
        var transaction = config.db.transaction(table, transactionMode);

        return {
            transaction: transaction,
            store: transaction.objectStore(table)
        };
    };

    // constructor
    IDBIndexQuery = function (options, index) {
        config = options;
        indexName = index;
        console.log("constructor");
    };

    IDBIndexQuery.prototype = {
        constructor: IDBIndexQuery,
        onQuery: function (result) {},
        execute: function () {
            var objectStore = getObjectStore(config.table, config.transactionModes.readonly),
                index = queryOptions.indexName ? objectStore.store.index(queryOptions.indexName) : objectStore.store,
                result = [];

            index.openCursor(queryOptions.keyRange/*), "next"*/).onsuccess = function(event) {
                var cursor = event.target.result;

                if (cursor) {
                    var item = cursor.value;

                    if (filters.length > 0) {
                        filters.forEach(function (filter) {
                            if (item[filter.field] === filter.value) {
                                result.push(item);
                            }
                        });
                    } else {
                        result.push(item);
                    }

                    cursor.continue();
                }
            };

            objectStore.transaction.oncomplete = function () {
                this.onQuery(result);
            }.bind(this);

            return this;
        },
        filter: function (field, value) {
            var position, filter = {
                "field": field,
                "value": value
            };

            // Check if the filter has not been added before
            position = filters.map(function (item) { 
                return JSON.stringify(item); 
            }).indexOf(JSON.stringify(filter));

            if (-1 === position) {
                filters.push(filter);
            }

            return this;
        },
        only: function (indexName, value) {
            queryOptions.indexName = indexName;
            queryOptions.keyRange = IDBKeyRange.only(value);
            return this;
        }
    };

    // return module
    return IDBIndexQuery;
}());