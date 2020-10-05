var express = require('express');
var mysql = require("mysql");
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.urlencoded( {extended : false} ))
router.use(bodyParser.json())

////////////////////////database//////////////////////////////////
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

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}
  
function getTimeStamp() {
    var d = new Date();
  
    var s =
      leadingZeros(d.getFullYear(), 4) + '-' +
      leadingZeros(d.getMonth() + 1, 2) + '-' +
      leadingZeros(d.getDate(), 2) + ' ' +
  
      leadingZeros(d.getHours(), 2) + ':' +
      leadingZeros(d.getMinutes(), 2) + ':' +
      leadingZeros(d.getSeconds(), 2);
  
    return s;
}

function insertQuery(table, data){
    var query = 'INSERT INTO '+ table +' VALUES('
    var tmp = ''
    
    for(var i = 0; i < data.length; i++){
        tmp = tmp +'\''+ data[i] +'\'';
        if(i != data.length - 1){
            tmp += ',';
        }
    }
    query = query + tmp +')';

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

router.post('/signin', async(req, res)=>{
    json_body = req.body;
    
    var array = [];
    id = json_body['id'];
    pw = json_body['pw']; //배열
    nickName = json_body['nickName'];
    name = json_body['name'];
    date = getTimeStamp();
    birth = json_body["birth"];
    
    array.push(id);
    array.push(pw);
    array.push(nickName);
    array.push(name);
    array.push(date);
    array.push(birth);

    var query = insertQuery('user', array);
    var out = await database(query);

    res.json({
        success: out
    });
    console.log(out);
});

module.exports = router;