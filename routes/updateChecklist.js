var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.urlencoded( {extended : false} ))
router.use(bodyParser.json())

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

function insertQuery(table, data){
    var query = 'UPDATE '+ table +' SET '
    query += 'minPrice=' + data[1] + ', ';
    query += 'maxPrice=' + data[2] + ', ';
    query += 'list=' + data[3] + ', ';
    query += 'design=' + data[4] + ', ';
    query += 'bed=' + data[5] + ', ';
    query += 'desk=' + data[6] + ', ';
    query += 'chair=' + data[7] + ', ';
    query += 'closet=' + data[8] + ', ';
    query += 'shelf=' + data[9] + ', ';
    query += 'tavle=' + data[10] + ' ';
    query += 'WHERE userId LIKE ' + '\''+ data[0] +'\'';

    return query;
}

async function database(q){
    return new Promise(function(resolve, reject){
        connection.query(q, function (error, results, fields) {
            if(error){
                resolve(false);
            }
            else resolve(true);
        });
    });
}

router.post('/updatechecklist', async(req, res) => {
    json_body = req.body;

    var array = [];
    userId = json_body['userId'];
    min_price = json_body['minPrice'];
    max_price = json_body['maxPrice'];
    list = json_body['list'];
    design = json_body['design'];
    bed = json_body['bed'];
    desk = json_body['desk'];
    chair = json_body['chair'];
    closet = json_body['closet'];
    table = json_body['table'];
    shelf = json_body['shelf'];

    array.push(userId);
    array.push(min_price);
    array.push(max_price);
    array.push(list);
    array.push(design);
    array.push(bed);
    array.push(desk);
    array.push(chair);
    array.push(closet);
    array.push(table);
    array.push(shelf);

    var query = insertQuery('checklist', array);
    console.log(query);
    var out = await database(query);

    res.json({
        success: out
    });
    console.log(out);
});

module.exports = router;