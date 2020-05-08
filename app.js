/** Connecting all needed modules*/
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const util = require("util");

/** Create object app of class express*/
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

/** Creating connection to database using predefined config*/
const pool = mysql.createPool({
    host: "localhost",
    user: "olso",
    password: "olso",
    database: "nodedb"
});

/** Turning on handlebars*/
app.set("view engine", "hbs");

const query = util.promisify(pool.query).bind(pool);

/**
 * Requesting all data from database using SELECT-query.
 *
 * @async
 * @function query
 * @param {data}
 * @return {Promise<data>} The data from the database
 */
app.get("/", function(req, res){
(async () => {
    try {
        const result = await query("SELECT * FROM users", function (err, data) {
            res.render("index.hbs", {
                users: data
            });
        });
    } catch ( err ) {
        return console.log(err);
    }
})()})

/**Return form to add data*/
app.get("/create", function(req, res){
    res.render("create.hbs");
});
/**Receive sent data and add them to database*/
app.post("/create", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const title = req.body.title;
    pool.query("INSERT INTO users (name, title) VALUES (?,?)", [name, title], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

/** Getting id of current book, it's data and send them with the form*/
app.get("/edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("edit.hbs", {
            user: data[0]
        });
    });
});


/** Getting changed data and sending them to database*/
app.post("/edit", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const title = req.body.title;
    const id = req.body.id;

    pool.query("UPDATE users SET name=?, title=? WHERE id=?", [name, title, id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});
/** Getting id of current book and deleting it from database*/
app.post("/delete/:id", function(req, res){
    const id = req.params.id;
    pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

/** Server is listening on port 3000*/
app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});
