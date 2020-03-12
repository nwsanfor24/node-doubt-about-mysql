const mysql = require("mysql");
const inquirer = require("inquirer");

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
        createItems(),
        readData()
    ]).then( () => {
        console.log("All done!");
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

function logRow({ id, item, price, quantity }) {
    console.log(`${id} | ${item} | ${price} | ${quantity}`);
}

function readData() {
    connection.query('SELECT * FROM items', function (err, res) {
        if (err) throw err;
        console.log("----------ITEMS----------")
        console.table(res);

        inquirer.prompt([
            {
                type: 'list',
                message: 'What do you want?',
                choices: ["POST AN ITEM", "BID ON AN ITEM"],
                name: "action"
            }
        ]).then(answers => {
            let action = answers.action;
            console.log(action);

            if (action = "POST AN ITEM") {
                addItem();
            } else if (action = "BID ON AN ITEM") {
                bidItem();
            }

            function bidItem() {
                console.log("--------------BID ON AN ITEM------------");
                let itemChoices = [];
                connection.query("SELECT itemName FROM items", function(err, res) {
                    for (let i=0; i < res.length; i++){
                        itemChoices.push(res[i].itemName);
                    }
                })
                readItems();
            }

            function addItem() {
                console.log("-----------------ADD ITEMS-----------------");
                inquirer.prompt([
                    {
                        type: 'input',
                        message: "Item Name?",
                        name: "itemName"
                    },
                    {
                        type: 'input',
                        message: "Item Price?",
                        name: "itemPrice"
                    },
                    {
                        type: 'input',
                        message: "Quantity?",
                        name: "itemQuantity"
                    }
                ]).then(answers => {
                    let itemName = answers.itemName;
                    let itemPrice = answers.itemPrice;
                    let itemQuantity = answers.itemQuantity;
                    let query = connection.query(
                        "INSERT INTO ITEMS SET ?",
                        {
                            item: itemName,
                            price: itemPrice,
                            quantity: itemQuantity
                        },
                        function(err, res) {
                            if (err) throw err;
                            console.log(`-------${res.affectedRows} ITEMS INSERTED----------`);
                            console.log(`ITEM: ${itemName} PRICE: ${itemPrice} QUANTITY: ${itemQuantity}`);

                            readItems();
                        }
                    );
                });

            function readItems() {
                console.log("-----------ITEMS-------------");
                connection.query("SELECT * FROM items", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    connection.end();
                });
            }
            }
        });
    });
}