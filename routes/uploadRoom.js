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

router.post('/uploadroom/inform', async(req, res) => {
    json_body = req.body;

    var userId = json_body['userId'];
    var roomName = json_body['roomName'];
    var array = []
    array.push(userId);
    array.push(roomName);

    var query = insertQuery('user_room', array);
    console.log(query);
    var out = await database(query);

    res.send(out);
    console.log(out);
});

///////////////////upload file///////////////////////
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'data/savedRoom');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname); //userId_fileName
    }
});
var upload = multer({storage: storage});

router.post('/uploadroom/file', upload.single('objectId'),function(req, res){
    res.send('Uploaded!: '+ req.file);
    console.log(req.file);
});


module.exports = router;