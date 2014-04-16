var IDBQuery = (function () {
    "use strict";

    // private attributes an methods
    // TODO make the properties to real private
    var IDBQuery, filters = [], config, getObjectStore, indexName,
        queryOptions = {indexName: null, keyRange: null};

    getObjectStore = function (table, transactionMode) {
        // TODO add a exception to catch errors
        var transaction = config.db.transaction(table, transactionMode);

        return {
            transaction: transaction,
            store: transaction.objectStore(table)
        };
    };

    /**
     * constructor
     * 
     * @param object options
     * @param string index
     * @returns IDBQuery
     */
    IDBQuery = function (options, index) {
        config = options;
        indexName = index;
        console.log("IDBQuery.constructor");
    };

    IDBQuery.prototype = {
        constructor: IDBQuery,
        onQuery: function (result) {},
        /**
         * 
         * @returns IDBQuery.prototype
         */
        execute: function () {
            var objectStore = getObjectStore(config.table, config.transactionModes.readonly),
                index = queryOptions.indexName ? 
                    objectStore.store.index(queryOptions.indexName) : 
                    objectStore.store,
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
        /**
         * 
         * @param string field
         * @param any value
         * @returns IDBQuery.prototype
         */
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
        /**
         * 
         * @param any lower
         * @param any upper
         * @param boolean|undefined lowerOpen
         * @param boolean|undefined upperOpen
         * @returns IDBQuery.prototype
         */
        bound: function (lower, upper, lowerOpen, upperOpen) {
            lowerOpen = lowerOpen || false;
            upperOpen = upperOpen || false;
            queryOptions.keyRange = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);

            return this;
        },
        /**
         * 
         * @param any lower
         * @param boolean|undefined open
         * @returns IDBQuery.prototype
         */
        lowerBound: function (lower, open) {
            open = open || false;
            queryOptions.keyRange = IDBKeyRange.lowerBound(lower, open);

            return this;
        },
        /**
         * 
         * @param any upper
         * @param boolean|undefined open
         * @returns IDBQuery.prototype
         */
        upperBound: function (upper, open) {
            open = open || false;
            queryOptions.keyRange = IDBKeyRange.upperBound(upper, open);

            return this;
        },
        /**
         * 
         * @param string indexName
         * @param any value
         * @returns IDBQuery.prototype
         */
        only: function (indexName, value) {
            queryOptions.indexName = indexName;
            queryOptions.keyRange = IDBKeyRange.only(value);

            return this;
        }
    };

    // return module
    return IDBQuery;
}());