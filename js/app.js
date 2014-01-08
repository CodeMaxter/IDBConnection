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
        keyPath: "nname", 
        unique: false
    }, {
        name: "lastname", 
        keyPath: "lastname", 
        unique: false
    }, {
        name: "age", 
        keyPath: "direccion", 
        unique: false
    }]
});

document.querySelector("#save").addEventListener("click", function() {
    iDBConnection.add("customers", {
        name: document.querySelector("#name").value,
        lastname: document.querySelector("#lastname").value,
        age: document.querySelector("#age").value
    });
}, false);

document.querySelector("#delete").addEventListener("click", function() {
    var id = document.querySelector("#id").value;
    if ("" === id) {
        alert("The id field cann't be is empty");
        return false;
    }
    
    iDBConnection.delete("customers", parseInt(id, 10));
    iDBConnection.onDelete = function (key, error) {
        console.log("iDBConnection.onRemove(%s, %s)", key, error);
    };
}, false);