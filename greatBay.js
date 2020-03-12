var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Gu!tar92",
    database: "greatBayDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    Promise.all([
        createItems()
    ]).then( () => {
        console.log("All done!");
        connection.end();
    }).catch(err => {
        console.log(err);
    });

});

function createItems() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM items", function(err, res) {
            if (err) reject(err);
            res.forEach(logRow);
            console.log("---------------------");

            resolve();
        });
    });
}