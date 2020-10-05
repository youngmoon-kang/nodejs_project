var express = require('express');
var mysql = require("mysql");
var router = express.Router();

const fs = require("fs");
const jsonFile = fs.readFileSync('./mysql/db.json', 'utf8');

const jsonData = JSON.parse(jsonFile);

var connection = mysql.createConnection({
    host     : jsonData["host"],
    user     : jsonData["user"],
    port     : jsonData["port"],
    password : jsonData["password"],
    database : jsonData["database"]
});

connection.connect();

async function database(q){
    return new Promise(function(resolve, reject){
        connection.query(q, function (error, results, fields) {
            if(error){
                resolve(error);
            }
            resolve(results);
        });
    });
}

router.get('/deleteuser/:id', async(req, res)=>{
    var id = req.params.id;
    var query = 'DELETE FROM user WHERE userId LIKE ' + '\'' + id + '\'';
    await database(query);

    res.json({
        success: true
    });
});

module.exports = router;