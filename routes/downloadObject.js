var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/objectdownload/:filename', function(req, res){
    var filename = req.params.filename;
    console.log(filename);
    console.log(typeof(filename))

    var filePath = './data/object/' + filename;
    console.log(filePath);
    res.download(filePath, filename);
    // fs.readFile(filePath, function(err, data){
    //     console.log(data);
    //     console.log('ok');
    //     res.download(filePath, filename);
    // });
});

module.exports = router;
