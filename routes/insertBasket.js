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
    var query = 'INSERT INTO '+ table +' VALUES ('
    var tmp = ''
    
    for(var i = 0; i < data.length; i++){
        tmp = tmp +'\''+ data[i] +'\'';

        if(i != data.length - 1){
            tmp += ', ';
        }
    }
    query = query + tmp +')';

    return query;
}

async function insertQueryColor(data, userId, furName){
    var query = 'INSERT INTO basket_color VALUES ( \'' + userId + '\', \'' + furName + '\', ' 
    var tmp = ''
    
    return new Promise(async function (resolve, reject){
        for(var i = 0; i < data.length; i++){
            var r = data[i][0];
            var g = data[i][1];
            var b = data[i][2];
            tmp += ' ' + r + ', ' + g + ', ' + b + ')';
            var out = await database(query + tmp);
            console.log(query + tmp);
            tmp = '';
        }
        resolve(true);
    });
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

router.post('/insertbasket', async(req, res) => {
    json_body = req.body;

    var array = [];
    userId = json_body['userId'];
    furName = json_body['furName'];
    img = json_body['img'];
    furUrl = json_body['url'];
    price = json_body['price'];
    colors = json_body['color'];

    array.push(userId);
    array.push(furName);
    array.push(img);
    array.push(furUrl);
    array.push(price);

    var query = insertQuery('basket', array);
    //console.log(query);
    var out = await database(query);

    var a = await insertQueryColor(colors, userId, furName);

    res.json({
        success: out
    });
    console.log(out);
});

module.exports = router;