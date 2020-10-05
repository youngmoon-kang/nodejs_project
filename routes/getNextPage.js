var express = require('express');
var puppeteer = require("puppeteer");
var router = express.Router();

//###################크롤링 시작################3
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 5);
        });
    });
}

let browser;
async function test(url){
    browser = await puppeteer.launch({headless : true});
    const page = await browser.newPage();
    //console.log(url)
    await page.goto(url);
    
    await autoScroll(page);
/*
    let data = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(6) > li > div > div.basicList_info_area__17Xyo > div.basicList_title__3P9Q7 > a");
    
    let evalData = await page.evaluate(element => {
        return element.textContent;
    }, data);
    console.log(evalData);
*/
    return new Promise(function(resolve, reject){
        resolve(page);
    });
}

async function getAll(url){
    let data = [];

    page = await test(url);
    const number = await page.$$eval("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div", (data) => data.length);
    for(var i = 0; i < number; i++){
        data.push(await getOne(page, i));
    }
    //console.log(data)
    await browser.close();
    return Promise.resolve(data);
}

async function getOne(page, idx){
    idx = idx + 1;

    var data = {};

    let temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_title__3P9Q7 > a");   
    data.name = await page.evaluate((data) => {
        return data.textContent;
    }, temp);

    temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_title__3P9Q7 > a");   
    data.link = await page.evaluate((data) => {
        return data.href;
    }, temp);
    
    temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child("+ idx +") > li > div > div.basicList_info_area__17Xyo > div.basicList_price_area__1UXXR > strong");
    data.price =  await page.evaluate((data) => {
        return data.textContent;
    }, temp);
    
    /*
    temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_depth__2QIie");
    try{
        data.cat =  await page.evaluate((data) => {
            return data.textContent;
        }, temp);
    }
    catch{
        data.cat = "";
    }
    console.log(data)
    */
   temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_img_area__a3NRA > div > a > img");
    data.img =  await page.evaluate((data) => {
        return data.src;
    }, temp);
    
    return Promise.resolve(data);
}

//################크롤링 끝#######################
router.post('/getnextpage', async (req, res) => {
    json_body = req.body;
    
    url = json_body['url'];
    page = json_body['page'];
    
    //페이지 url찾기
    var s = url.indexOf("pagingIndex=");
    var front = url.substr(0,s+12)

    var s = url.indexOf("&pagingSize=");
    var back = url.substr(s, )

    var url = front +page+ back
    //페이지 url찾기 끝

    result = await getAll(url);

    res.json({
        url: url,
        objects: result
    });
});

module.exports = router;
