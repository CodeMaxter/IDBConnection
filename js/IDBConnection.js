var IDBConnection = (function () {
    "use strict";

    // private attributes amn methods
    var request, db, IDBConnection, objectStore, getObjectStore, transactionModes;

    transactionModes = {
        readonly: 'readonly',
        readwrite: 'readwrite'
    };

    getObjectStore = function (table, transactionMode) {
        var transaction = db.transaction(table, transactionMode);

        return {
            transaction: transaction,
            store: transaction.objectStore(table)
        };
    };
    
    // constructor
    IDBConnection = function () {
        console.log("constructor");
    };

    IDBConnection.prototype = {
        constructor: IDBConnection,
        // events
        onClose: function () {},
        onDelete: function (key, error) {},
        onReady: function () {},
        open: function (name, version, schema) {
            console.log("open(%s, %s)", name, version);

            request = indexedDB.open(name, version);

            request.onsuccess = function (event) {
                console.log("request.onsuccess");
                db = request.result;
                console.log(db);

                this.onReady();
            }.bind(this);

            request.onupgradeneeded = function (event) {
                var index, indexLength;

                console.log("request.onupgradeneeded");

                objectStore = event.currentTarget.result.createObjectStore(schema.name, schema.key);

                for (index = 0, indexLength = schema.indexes.length; index < indexLength; ++index) {
                    this.createIndex(
                        schema.indexes[index].name, 
                        schema.indexes[index].keyPath, {
                            unique: schema.indexes[index].unique
                        }
                    );
                }
            }.bind(this);
        },
        add: function (table, data) {
            var objectStore;
            
            objectStore = getObjectStore(table, transactionModes.readwrite);

            var request = objectStore.store.add(data);
            request.onsuccess = function(evt) {
                console.log("agregado")
            };
        },
        clear: function () {
            var objectStore = getObjectStore(table, transactionModes.readwrite);

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
            db.close();
            this.onClose();
        },
        createIndex: function (name, keyPath, params) {
            console.log("open(%s, %s, %s)", name, keyPath, params);

            objectStore.createIndex(name, keyPath, params);
        },
        delete: function (table, key) {
            var objectStore, request;
        
            objectStore = getObjectStore(table, transactionModes.readwrite);
            request = objectStore.store.delete(key);

            request.onsuccess = function (event) {
                console.log(event);
                this.onDelete(key, event);
            }.bind(this);

            request.onerror = function (error) {
                this.onDelete(key, error);
            }.bind(this);
        }
    };

    // return module
    return IDBConnection;
}());