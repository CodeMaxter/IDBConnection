var IDBQuery = (function () {
    "use strict";

    // global private attributes an methods
    var IDBQuery, getObjectStore;

    getObjectStore = function (db, table, transactionMode) {
        // TODO add a exception to catch errors
        var transaction = db.transaction(table, transactionMode);

        return {
            transaction: transaction,
            store: transaction.objectStore(table)
        };
    };

    /**
     * constructor
     * 
     * @param object config
     * @param string index
     * @returns IDBQuery
     */
    IDBQuery = function (config, index) {
        var _config = config, _filters = [], _indexName, _queryOptions;

//        _indexName = index;
        _queryOptions = { indexName: null, keyRange: null };

        // privileged methods
        this.execute = function () {
            var result = [], objectStore, index;

            objectStore = getObjectStore(
                _config.db, 
                _config.table, 
                _config.transactionModes.readonly
            );

            index = _queryOptions.indexName ? 
                objectStore.store.index(_queryOptions.indexName) : 
                objectStore.store;

            index.openCursor(_queryOptions.keyRange/*), "next"*/).onsuccess = function(event) {
                var cursor = event.target.result;

                if (cursor) {
                    var item = cursor.value;

                    if (_filters.length > 0) {
                        _filters.forEach(function (filter) {
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
        };

        /**
         * 
         * @param any lower
         * @param any upper
         * @param boolean|undefined lowerOpen
         * @param boolean|undefined upperOpen
         * @returns IDBQuery.prototype
         */
        this.bound = function (lower, upper, lowerOpen, upperOpen) {
            lowerOpen = lowerOpen || false;
            upperOpen = upperOpen || false;
            _queryOptions.keyRange = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);

            return this;
        };

        /**
         * 
         * @param string field
         * @param any value
         * @returns IDBQuery.prototype
         */
        this.filter = function (field, value) {
            var position, filter = {
                "field": field,
                "value": value
            };

            // Check if the filter has not been added before
            position = _filters.map(function (item) { 
                return JSON.stringify(item); 
            }).indexOf(JSON.stringify(filter));

            if (-1 === position) {
                _filters.push(filter);
            }

            return this;
        };

        /**
         * 
         * @param any lower
         * @param boolean|undefined open
         * @returns IDBQuery.prototype
         */
        this.lowerBound = function (lower, open) {
            open = open || false;
            _queryOptions.keyRange = IDBKeyRange.lowerBound(lower, open);

            return this;
        };

        /**
         * 
         * @param any upper
         * @param boolean|undefined open
         * @returns IDBQuery.prototype
         */
        this.upperBound = function (upper, open) {
            open = open || false;
            _queryOptions.keyRange = IDBKeyRange.upperBound(upper, open);

            return this;
        };

        /**
         * 
         * @param string indexName
         * @param any value
         * @returns IDBQuery.prototype
         */
        this.only = function (indexName, value) {
            _queryOptions.indexName = indexName;
            _queryOptions.keyRange = IDBKeyRange.only(value);

            return this;
        };

        console.log("IDBQuery.constructor");
    };

    IDBQuery.prototype = {
        constructor: IDBQuery,
        onQuery: function (result) {}
    };

    // return module
    return IDBQuery;
})();