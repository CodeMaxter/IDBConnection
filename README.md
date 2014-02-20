IDBConnection.js
====

IDBConnection.js is is a wrapper for [IndexedDB](http://www.w3.org/TR/IndexedDB/) to make it easier to work against.
The library work in a OOP way and emmit events for all operations.

Usage
====


Add a reference to IDBConnection.js in your application before you want to use IndexedDB:

    <script src='/js/IDBConnection.js'></script>

Once you have the script included you can then open connections to each different database within your application simply by instantiating an object of the class IDBConnection:

```JavaScript
var iDBConnection= new IDBConnection();

iDBConnection.open("testDB", 1, {
    name: "customers",
    key: {
        keyPath: 'id', 
        autoIncrement: true,
    },
    indexes: [{
        name: "firstName", 
        keyPath: "firstName", 
        unique: false
    }, {
        name: "lastName", 
        keyPath: "lastName", 
        unique: false
    }, {
        name: "age", 
        keyPath: "age", 
        unique: false
    }]
});
```

To add a object to the database, simply call to add method with the table name how first parameter and the object how second parameter.  A onAdd event is fired when the object is stored or a error happen.

```JavaScript
iDBConnection.add("customers", {
    firstName: 'John',
    lastName: 'Doe',
    age: 21
});

iDBConnection.onAdd = function (customer, error) {
    if (error) {
        alert(error);
    }

    alert("The customer " + JSON.stringify(customer) + " was added.");
}
```

To get a record from the database, simply call the get method with the table name how first parameter and the keyPath to search how second parameter.  A onGet event is fired with the result or the error.

```JavaScript
iDBConnection.get("customers", 1);

iDBConnection.onGet = function (result, error) {
    alert(JSON.stringify(result));
};
```

To delete a record simply call to the method delete with the table name how first parameter and the keyPath of the record to delete how second parameter. a onDelete event is fired with the keyPath deleted or the error is a error happen.

```JavaScript
iDBConnection.delete("customers", 1);
iDBConnection.onDelete = function (key, error) {
    alert("The customer with id " + key + " was deleted");
};
```