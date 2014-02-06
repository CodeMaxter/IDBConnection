var iDBConnection;

iDBConnection= new IDBConnection();

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

document.querySelector("#query").addEventListener("click", function() {
    if ("" === document.querySelector("#id").value) {
        alert("The id field don't be null");
        return false;
    }

    iDBConnection.get("customers", parseInt(document.querySelector("#id").value, 10));

    iDBConnection.onGet = function (result, error) {
        alert(JSON.stringify(result));
    };
}, false);

document.querySelector("#save").addEventListener("click", function() {
    var id = document.querySelector("#id").value;
    if ("" !== id) {
        id = parseInt(document.querySelector("#id").value, 10);
        iDBConnection.update("customers", id, {
            name: document.querySelector("#name").value,
            lastname: document.querySelector("#lastname").value,
            age: document.querySelector("#age").value
        });

        iDBConnection.onUpdate = function (customer, error) {
            alert("The customer " + JSON.stringify(customer) + " was updated.");
        }
    } else {
        iDBConnection.add("customers", {
            name: document.querySelector("#name").value,
            lastname: document.querySelector("#lastname").value,
            age: document.querySelector("#age").value
        });

        iDBConnection.onAdd = function (customer, error) {
            alert("The customer " + JSON.stringify(customer) + " was added.");
        }

        document.querySelector("#customers").reset();
    }
}, false);

document.querySelector("#delete").addEventListener("click", function() {
    var id = document.querySelector("#id").value;
    if ("" === id) {
        alert("The id field cann't be is empty");
        return false;
    }

    iDBConnection.delete("customers", parseInt(id, 10));
    iDBConnection.onDelete = function (key, error) {
        alert("The customer with id " + key + " was deleted");
    };
}, false);

document.querySelector("#list").addEventListener("click", function() {
    var iDBIndexQuery = iDBConnection
        .query("customers")
        .filter("lastname", "Schumacher")
        .execute();

    iDBIndexQuery.onQuery = function (result) {
        console.log(JSON.stringify(result));
    };
}, false);