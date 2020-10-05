var express = require('express');
var mysql = require("mysql");
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

router.post('/login', async(req, res)=>{
    json_body = req.body;

    var id = json_body['id'];
    var pw = json_body['pw'];
    var query = 'SELECT * FROM user WHERE userId LIKE ' + '\'' + id + '\' AND' + ' passWord LIKE ' + '\'' + pw + '\'';
    var out = await database(query);

    console.log(out.length);
    if(out.length == 0){ //등록된 계정이 없으면
        res.json({
            success: false
        });

        //res.send(false); //false를 보내기
    }
    else res.json({
        success: true
    });; //등록된 계정이 있으면
});

module.exports = router;