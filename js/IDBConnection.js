/**
 * TODO add exception to control with the database is deleted manually and the app crash
 */
var IDBConnection = (function () {
    "use strict";

    // private attributes an methods
    var IDBConnection, getObjectStore, transactionModes;

    transactionModes = {
        readonly: 'readonly',
        readwrite: 'readwrite'
    };

    getObjectStore = function (db, table, transactionMode) {
        var transaction = db.transaction(table, transactionMode);

        return {
            transaction: transaction,
            store: transaction.objectStore(table)
        };
    };

    // constructor
    IDBConnection = function () {
        // private attributes an methods
        var _db, _objectStore;

        // privileged methods
        this.getDb = function () {
            return _db;
        };

        this.setDb = function (db) {
            _db = db;
        };

        this.getObjectStore = function () {
            return _objectStore;
        };

        this.setObjectStore = function (objectStore) {
            _objectStore = objectStore;
        };

        console.log("IDBConnection.constructor");
    };

    IDBConnection.prototype = {
        constructor: IDBConnection,
        // events
        onAdd: function (data, error) {},
        onClose: function () {},
        onDelete: function (key, error) {},
        onGet: function (result, error) {},
        onReady: function () {},
        onUpdate: function (data, error) {},
        add: function (table, data) {
            var objectStore;
            
            objectStore = getObjectStore(this.getDb(), table, transactionModes.readwrite);

            var request = objectStore.store.add(data);
            request.onsuccess = function(event) {
                this.onAdd(data);
            }.bind(this);
        },
        clear: function () {
            var objectStore = getObjectStore(this.getDb(), table, transactionModes.readwrite);

            objectStore.store.clear();
            objectStore.transaction.oncomplete = function ( ) {
                this.onClear(null);
            }.bind(this);

            transaction.onerror = function (error) {
                this.onClear(error);
            }.bind(this);
        },
        close: function () {
            console.log("close");
            _db.close();
            this.onClose();
        },
        createIndex: function (name, keyPath, params) {
            console.log("open(%s, %s, %s)", name, keyPath, params);

//            objectStore.createIndex(name, keyPath, params);
            this.getObjectStore().createIndex(name, keyPath, params);
        },
        delete: function (table, key) {
            var objectStore, request;

            objectStore = getObjectStore(this.getDb(), table, transactionModes.readwrite);
            request = objectStore.store.delete(key);

            request.onsuccess = function (event) {
                console.log(event);
                this.onDelete(key, event);
            }.bind(this);

            request.onerror = function (error) {
                this.onDelete(key, error);
            }.bind(this);
        },
        get: function (table, key) {
            var objectStore, request;

            objectStore = getObjectStore(this.getDb(), table, transactionModes.readwrite);

            request = objectStore.store.get(key);
            request.onerror = function(event) {
                this.onGet(null, event);
            }.bind(this);

            request.onsuccess = function(event) {
                this.onGet(event.target.result, null);
            }.bind(this);
        },
        open: function (name, version, schema) {
            var request;
            console.log("open(%s, %s)", name, version);

            request = indexedDB.open(name, version);

            request.onsuccess = function (event) {
                console.log("request.onsuccess");
//                _db = request.result;
//                console.log(_db);
                this.setDb(request.result);

                this.onReady();
            }.bind(this);

            request.onupgradeneeded = function (event) {
                console.log("request.onupgradeneeded");

                var objectStore = event.currentTarget.result.createObjectStore(schema.name, schema.key);
                this.setObjectStore(objectStore);

                schema.indexes.forEach(function (index) {
                    this.createIndex(
                        index.name, 
                        index.keyPath, {unique: index.unique}
                    );
                }.bind(this));
            }.bind(this);
        },
        query: function (table, indexName) {
            return new IDBQuery({
                "db": this.getDb(),
                "table": table,
                "transactionModes": transactionModes
            }, indexName || null);
        },
        update: function (table, key, data) {
            var objectStore, request;

            // Get the stored record
            this.get(table, key);

            this.onGet = function (item, error) {
                var key;

                // Update the stored record with the new data
                for (key in data) {
                    item[key] = data[key];
                }

                objectStore = getObjectStore(this.getDb(), table, transactionModes.readwrite);

                // Put this updated object back into the database.
                request = objectStore.store.put(item);

                request.onerror = function(event) {
                    this.onUpdate(null, event);
                }.bind(this);

                request.onsuccess = function(event) {
                    this.onUpdate(item);
                }.bind(this);
            };
        }
    };

    // return module
    return IDBConnection;
}());