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

router.get('/checknickname/:nickname', async(req, res)=>{
    var nickName = req.params.nickname;
    var query = 'SELECT * FROM user WHERE nickName LIKE ' + '\'' + nickName + '\'';
    var out = await database(query);

    console.log(out);
    if(out.length != 0){ //누군가 아이디를 사용하고 있으면
        res.json({
            success: false
        });
    }
    else {
        res.json({
            success: false
        });
    }//res.send(true); //아무도 사용하고 있지 않으면 true보내기
});

module.exports = router;