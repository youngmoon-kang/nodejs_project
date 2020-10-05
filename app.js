const express = require('express');
var bodyParser = require('body-parser');
var mysql = require("mysql");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded( {extended : false} ))
app.use(bodyParser.json())

//////////////routes////////////////
var choiceRouter = require('./routes/choice'); //체크리스트
var signinRouter = require('./routes/signIn'); //회원가입
var chcekidRouter = require('./routes/checkId'); //아이디 중복체크 for 회원가입
var deleteUserRouter = require('./routes/deleteUser'); //아이디 중복체크 for 회원가입
var chceknicknameRouter = require('./routes/checkNickname'); //닉네임 중복체크 for 회원가입
var insertChecklistRouter = require('./routes/insertChecklist'); //체크리스트 회원정보에 넣기
var updateChecklistRouter = require('./routes/updateChecklist'); //체크리스트 회원정보에 수정
var logInRouter = require('./routes/logIn'); //로그인 하기
var getNextPageRouter = require('./routes/getNextPage'); //다음 페이지 받기
var getRecommendRouter = require('./routes/recommend'); //추천 가구 받기
var objectDownloadRouter = require('./routes/downloadObject'); //가구 다운받기
var uploadRoom = require('./routes/uploadRoom'); //방 꾸민것 세이브파일 업로드 (파일하고 정보하고 따로)
var insertPurchseRouter = require('./routes/insertPurchase'); //방 꾸민것 세이브파일 업로드 (파일하고 정보하고 따로)
var insertBasketRouter = require('./routes/insertBasket'); //방 꾸민것 세이브파일 업로드 (파일하고 정보하고 따로)
////////////////////////////////////

app.get('/', (req, res) => {
    res.json({
        success: true
    });
});

///////////Link////////////////////
app.post('/select', choiceRouter);
app.post('/signin', signinRouter);
app.get('/checkid/:id', chcekidRouter);
app.get('/deleteuser/:id', deleteUserRouter);
app.get('/checknickname/:nickname', chceknicknameRouter);
app.post('/insertchecklist', insertChecklistRouter);
app.post('/updatechecklist', updateChecklistRouter);
app.post('/login', logInRouter);
app.post('/getnextpage', getNextPageRouter);
app.get('/recommend/:userid', getRecommendRouter);
app.get('/objectdownload/:filename', objectDownloadRouter);
app.post('/uploadroom/inform', uploadRoom);
app.post('/uploadroom/file', uploadRoom);
app.post('/insertpurchase', insertPurchseRouter);
app.post('/insertBasket', insertBasketRouter);
//////////////////////////////////

app.listen(port, ()=> {
    console.log('server is listening at localhost:$(precess.env.PORT)');
});