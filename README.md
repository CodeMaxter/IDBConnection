IDBConnection.js
====

IDBConnection.js is is a wrapper for [IndexedDB](http://www.w3.org/TR/IndexedDB/) to make it easier to work against.
The library work in a OOP way and emmit events for all operations.

Usage
====


Add a reference to db.js in your application before you want to use IndexedDB:

	<script src='/js/IDBConnection.js'></script>

Once you have the script included you can then open connections to each different database within your application:

```JavaScript
var iDBConnection= new IDBConnection();

iDBConnection.open("testDB", 1, {
    name: "customers",
    key: {
        keyPath: 'id', 
        autoIncrement: true,
    },
    indexes: [{
        name: "name", 
        keyPath: "name", 
        unique: false
    }, {
        name: "lastname", 
        keyPath: "lastname", 
        unique: false
    }, {
        name: "age", 
        keyPath: "age", 
        unique: false
    }]
});
```

```JavaScript
iDBConnection.add("customers", {
    name: document.querySelector("#name").value,
    lastname: document.querySelector("#lastname").value,
    age: document.querySelector("#age").value
});
```

```JavaScript
iDBConnection.get("customers", parseInt(document.querySelector("#id").value, 10));

iDBConnection.onGet = function (result, error) {
    alert(JSON.stringify(result));
};
```
