var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Gu!tar92",
    database: "playlistDB"
});

function updateGenre() {
    console.log("Updating all SWAMP ROCK genres...\n");
    var query = connection.query(
        "UPDATE songs SET ? WHERE ?",
        [
            {
                genre: "Swamp Rock"
            },
            {
                genre: "Classic Rock"
            }
        ],
    )
}

function createSong() {
    console.log("Inserting a new song... \n");
    var query = connection.query(
        "INSERT INTO songs SET ?",
        {
            title: "Heavy/Like A Witch",
            artist: "All Them Witches",
            genre: "Swamp Rock"
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " song inserted!\n");

            updateGenre();
        }
    );

    console.log(query.sql)
}



connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    createSong();
});