/**
 * modules
 * @module
 */
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const util = require("util");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "olso",
    password: "olso",
    database: "nodedb"
});

app.set("view engine", "hbs");
const query = util.promisify(pool.query).bind(pool);

// Getting list of all books (use of async/await)
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

// Return form to add data
app.get("/create", function(req, res){
    res.render("create.hbs");
});
// Receive sent data and add them to database
app.post("/create", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const title = req.body.title;
    pool.query("INSERT INTO users (name, title) VALUES (?,?)", [name, title], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

// We get id of current book, it's data and send them with the form
app.get("/edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("edit.hbs", {
            user: data[0]
        });
    });
});


// We get changed data and send them to database
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
// We get id of current book and delete it from database
app.post("/delete/:id", function(req, res){
    const id = req.params.id;
    pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});







/*-------------------------------------------------------------------------------------*/

/**
 * modules
 * @module
 */
/*
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "olso",
    password: "olso",
    database: "nodedb"
});

app.set("view engine", "hbs");

/** Getting list of all books */
/*app.get("/", function(req, res){
    pool.query("SELECT * FROM users", function(err, data) {
        if(err) return console.log(err);
        res.render("index.hbs", {
            users: data
        });
    });
});
/** Return form to add data */
/*app.get("/create", function(req, res){
    res.render("create.hbs");
});
// Receive sent data and add them to database
app.post("/create", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const title = req.body.title;
    pool.query("INSERT INTO users (name, title) VALUES (?,?)", [name, title], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

// We get id of current book, it's data and send them with the form
app.get("/edit/:id", function(req, res){
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.render("edit.hbs", {
            user: data[0]
        });
    });
});

// We get changed data and send them to database
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

// We get id of current book and delete it from database
app.post("/delete/:id", function(req, res){
    const id = req.params.id;
    pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});*/