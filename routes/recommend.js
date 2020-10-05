var express = require('express');
var puppeteer = require("puppeteer");
var mysql = require("mysql");
const { getPaletteFromURL } = require('color-thief-node');

var router = express.Router();

//db연결
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

// db에서 정보 받아오기
async function database(userid){
    var q = "SELECT minPrice, maxPrice, list, design, bed, desk, chair, closet, shelf, tavle FROM checklist WHERE userId LIKE \"" + userid + "\"";

    return new Promise(function(resolve, reject){
        connection.query(q, function (error, results, fields) {
            if(error){
                resolve(error);
            }
            var data = {};
            data.minPrice = results[0].minPrice;
            data.maxPrice = results[0].maxPrice;
            data.list = results[0].list;
            data.design = results[0].design;
            data.chair = results[0].chair;
            data.closet = results[0].closet;
            data.shelf = results[0].shelf;
            data.table = results[0].tavel;
            data.bed = results[0].bed;

            resolve(data);
        });
    });
}

catMap = {'테이블': 50001235, 'TV거실장': 50001310, '소파': 50001234, '장식장': 50001311, '사무/교구용가구': 50001240, '의자': 50001239, '책상': 50001238, '책장': 50001346,
            '책꽂이': 50001347, '선반': 50001321, '침대': 50001228, '매트리스': 50001229, '매트리스/소파': 50003247, '바퀴의자': 50003264, '책상용서랍장': 50001346, '정리용서랍장': 50007189,
            '옷장': 50003227, '행거': 50001319, '접이식테이블': 50003254, "식탁": 50001236, "전신거울": 50001395, "화장대": 50001231, "협탁": 50001307,
             "tv": 50001395, "카펫": 50001135, "커튼": 50000113, '일반의자': 50003682}
colorMap = {'red':16, 'orange':64, 'gold':128, 'yellow':256, 'yellowGreen':1024, 'green':2048, 'skyBlue':4096, 'blue':8192, 'bluishViolet':16384, 'white':8, 'silver':4, 'black':1, 'khaki':512, 'brown':32, 'violet':131072, 'wine':65536, 'pink':32768, 'gray':2};
brandMap = {'1300K': 233266, 'JAKOMO': 13786, 'SYSMAX': 37961, 'UFO': 199297, 'e나무로': 150124, 'e스마트': 138213, '가구느낌': 260289, '가구밸리': 141794, '가구야놀자': 246337, '가이온': 251102, '가쯔': 148784, '겟홈': 218005, '굿모닝침대': 17015, '까로네까사': 250579, '까미엘': 140498, '까사미아': 1282, '까사채움': 249623, '끌레오': 121814, '나누벨': 245784, '나무뜰': 140297, '나빈찌': 387864, '네시스': 150662, '노브랜드': 37502, '노송가구': 10926, '다오름': 148941, '다올퍼니': 247105, '다우닝': 140205, '다채움가구': 247613, '더리드': 228206, '더리드우드': 205638, '더리체': 141144, '더젠': 138652, '데코라인': 11087, '도미르베네': 226202, '동서가구': 11119, '동영나이스': 142533, '둘더스': 179267, '듀오백': 1179, '듀커': 242470, '디자이너스룸': 203412, '라레스가구': 236437, '라로퍼니처': 254211, '라마하트': 252553, '라샘': 37665, '라익미': 150500, '라자가구': 11277, '레벤': 16092, '레이디가구': 137384, '로쏘': 11405, '로포텐': 231960, '룩스퍼니처': 226476, '룸앤홈': 117916, '리바트': 1057, '리바트이즈마인': 25058, '리바트키친': 214694, '리버퍼니쳐': 11509, '리빙인도무스': 203809, '리피트리': 153280, '린지홈': 255803, '마레앤코': 117921, '마루엔개비': 178397, '마초가구': 236512, '마켓비': 205684, '마티노가구': 231091, '막스앤': 248866, '메이크가구': 35005, '모던바로크가구': 240987, '모던하우스': 36152, '미까사': 117925, '미르가구': 143379, '미소가': 138218, '미스터가구': 210802, '미아트': 130856, '미즌하임': 200864, '바네스데코': 145352, '바로크홈': 181007, '바보사랑': 233310, '버즈가구': 249042, '베네스트': 235364, '베드리움': 159422, '베스트리빙': 28842, '베이직가구': 225011, '베이직팩토리': 213034, '벤스': 207906, '보니애가구': 203594, '보루네오': 884, '보루네오하우스': 107903, '블랑누보': 249147, '블루밍홈': 137382, '블리스데코': 246383, '비앙스': 117922, '사사': 27428, '삼익가구': 140276, '상일리베가구': 138651, '서광퍼니처': 140406, '세진침대': 12464, '수오': 247162, '쉐우드': 176836, '슈랙엣홈': 252088, '스마트퍼니처': 210801, '스코나': 227312, '스피드랙': 210568, '시니프': 138209, '시디즈': 146395, '시스디자인': 117918, '시트앤모어': 144174, '썬퍼니처': 140284, '씨엘로': 187780, '아로미가구': 222181, '아르스노바': 152200, '아름이와다움이': 142812, '아씨방': 224156, '아이브': 207901, '아이앤': 142815, '아이엔지가구': 144534, '아이퍼니쳐': 224961, '아카시아리빙': 207029, '아트박스': 203445, '아트사인': 147967, '앳홈': 155501, '야테카오리': 145206, '에넥스': 580, '에몬스': 207808, '에몬스홈': 574, '에보니아': 572, '에싸': 251991, '에이스침대': 558, '에코그린': 176793, '에코프라자': 158492, '엘레아': 16171, '엘리에셀': 144533, '예다움': 144166, '예일가구': 242192, '오디엔즈': 153648, '오르노떼': 253334, '오스본가구': 250737, '오크빌': 228613, '오플로어': 214258, '옴니팩': 218145, '왕자행거': 140368, '우아미아이': 179503, '워블': 215869, '웨스트프롬': 210328, '웰퍼니쳐': 259487, '위클리세븐': 255961, '윌리': 208746, '유캐슬': 146382, '이노센트플러스': 179864, '이케아': 444, '이홈데코': 123330, '인더룸': 178209, '인시네': 204185, '인우드': 224921, '인터데코': 244826, '인터라켄': 216982, '일룸': 13761, '잉글랜더': 145142, '자네트가구': 240434, '장인가구': 423, '제퍼슨가구': 189946, '조세핀': 200276, '조은가구': 137381, '조이시스': 224707, '즐거운가구': 140643, '지베스': 245160, '지벤': 117919, '진영가구': 139897, '채우리': 138590, '칠성산업': 196557, '캠프밸리': 233316, '케미에르': 225739, '코웨이': 135460, '코텍스': 20784, '큐빅스': 144171, '클레어마망': 245758, '클렙튼': 225214, '텐바이텐': 230363, '텐스페이스': 218007, '티렌토': 240662, '티에스퍼니처': 206483, '파란들': 137388, '파로마': 180, '퍼스웰': 138646, '퍼스트레이디가구': 225604, '퍼시스': 33435, '페라모': 242490, '포스트모던': 250118, '폴로까사': 237687, '프라이드리빙': 28870, '핀란디아': 80, '필웰': 17222, '하이파가구': 142819, '하이퍼스': 147635, '한샘': 54, '핸슨': 35545, '햇살맑은집': 147720, '헤이미쉬홈': 244478, '현대의료기': 214633, '홈앤가구': 247170, '히키스': 207126}
specMap = {'서랍형소파': 'M10012347%7CM10501807', '수납형소파': 'M10012347%7CM10501808', '소파커버': 'M10018279%7CM10807725', '책장+거실장': 'M10012414%7CM10531852', '허리받침대의자': 'M10007005%7CM10031416', '수동접이식침대': 'M10012442%7CM10537946', '전동접이식침대': 'M10012442%7CM10537947', '메쉬의자': 'M10007005%7CM10031413', '듀얼등받이의자': 'M10007005%7CM10031414', '세트': 'M10019503%7CM10531895', '사다리선반': 'M10014695%7CM10774491', '책상세트': 'M10007211%7CM10031655', '앵글선반': 'M10014695%7CM10774488', '베이비장+서랍장': 'M10007210%7CM10031650', '커튼세트': 'M10013502%7CM10738524', '베이비장+서랍장+수납장': 'M10007210%7CM10031652', '코너선반': 'M10014695%7CM10774489', '좌식책상': 'M10007211%7CM10030234'}
spec2Map = {'소파단품': 'M10013772%7CM10758184', '인테리어액자': 'M10013997%7CM10761168', '와이드서랍장': 'M10013776%7CM10758234', '틈새서람장': 'M10013776%7CM10758233', '코너형': 'M10013772%7CM10718546', '스툴포함': 'M10013772%7CM10758185', '서랍포함': 'M10013761%7CM10537911', '틈새수납장': 'M10014184%7CM10763920', '좌식': 'M10006011%7CM10030246', '도어서랍형': 'M10014184%7CM10763919', '모듈형': 'M10013772%7CM10758189', '슬라이딩': 'M10013761%7CM10742137', '카우치형': 'M10013772%7CM10758186'}

//url가져오기
async function choice(cat, color, brand, minPrice, maxPrice, spec, spec2){
    base = 'https://search.shopping.naver.com/search/all?pagingIndex=1&pagingSize=20&productSet=total&query=%EA%B0%80%EA%B5%AC&sort=rel&timestamp=&viewType=list'
    
    output = '';
    //######category#######
    cat_str = ''
    if(cat != ''){
        cat_str = '&catId=' + String(catMap[cat]);
    }
    output += base + cat_str;
    //######category end#########

    //######color#######
    color_str = ''
    for (var i = 0; i < color.length; i+=1){
        if(i == 0){
            color_str = '&color=' + String(colorMap[color[i]])
        }
        else{
            color_str += '%20'+String(colorMap[color[i]])
        }
    }
    output += color_str
    //######color end#########

    //######price#############
    if(minPrice < maxPrice){
        min_price_str = '&minPrice=' + String(minPrice);
        max_price_str = '&maxPrice=' + String(maxPrice);
        min_max_str = '&minPrice-maxPrice=' + String(minPrice) +'-'+String(maxPrice);
        output += min_price_str + max_price_str + min_max_str;
    }
    //#######price end###########

    //######brand#######
    brand_str = ''
    for (var i = 0; i < brand.length; i+=1){
        if(i == 0){
            brand_str = '&brand=' + String(brandMap[brand[i]])
        }
        else{
            brand_str += '%20'+String(brandMap[brand[i]])
        }
    }
    output += brand_str
    //######brand end#########

    //######spec#######
    spec_str = ''
    for (var i = 0; i < spec.length; i+=1){
        if(i == 0){
            spec_str = '&spec=' + specMap[spec[i]]
        }
        else{
            spec_str += '%20'+ specMap[spec[i]]
        }
    }
    //output += spec_str
    //######spec end#########

    //######spec2#######
    //spec_str = ''
    for (var i = 0; i < spec2.length; i+=1){
        if(i == 0 && spec_str == ''){
            spec_str += '&spec=' + spec2Map[spec2[i]]
        }
        else{
            spec_str += '%20'+ spec2Map[spec2[i]]
        }
    }
    output += spec_str
    //######spec2 end#########

    return new Promise(function(resolve, reject){
        resolve(output);
    });
}

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

    return new Promise(function(resolve, reject){
        resolve(page);
    });
}

async function getAll(url){
    let data = [];

    page = await test(url);
    const number = await page.$$eval("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div", (data) => data.length);
    for(var i = 0; i < number; i++){
        var result = await getOne(page, i);
        if(result){ 
            data.push(result);
        }
    }
    //console.log(data)
    await browser.close();
    return Promise.resolve(data);
}

async function getOne(page, idx){
    idx = idx + 1;

    var data = {};
    let temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_price_area__1UXXR > button");
    if(temp) return ;
    
    temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_title__3P9Q7 > a");   
    data.name = await page.evaluate((data) => {
        return data.textContent;
    }, temp);
    temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_title__3P9Q7 > a");
    //temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_info_area__17Xyo > div.basicList_title__3P9Q7 > a");   
    data.link = await page.evaluate((data) => {
        return data.href;
    }, temp);
    
    temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child("+ idx +") > li > div > div.basicList_info_area__17Xyo > div.basicList_price_area__1UXXR > strong");
    data.price =  await page.evaluate((data) => {
        return data.textContent;
    }, temp);
    
   temp = await page.$("#__next > div > div.container > div.style_inner__18zZX > div.style_content_wrap__1PzEo > div.style_content__2T20F > ul > div > div:nth-child(" + idx + ") > li > div > div.basicList_img_area__a3NRA > div > a > img");
    data.img =  await page.evaluate((data) => {
        return data.src;
    }, temp);

    (async () => {
        data.colors = await getPaletteFromURL(data.img);
    })();

    
    return Promise.resolve(data);
}
//#############크롤링 끝#############################

//################카테고리 선택#######################
function returnCat(cat, choice){
    if(cat == '침대'){
        if(choice == 1){
            return "침대";
        }
        else if(choice == 2){
            return "매트리스"
        }
        else if(choice == 3){
            return "매트리스/소파";
        }
    }

    if(cat == '책상'){
        return "책상";
    }

    if(cat == '의자'){
        if(choice == 1){
            return "바퀴의자";
        }
        if(choice == 2){
            return "일반의자";
        }
    }

    if(cat == '서랍장'){
        if(choice == 1){
            return '책상용서랍장';
        }
        if(choice == 2){
            return '정리용서랍장';
        }
    }

    if(cat == '옷장'){
        if(choice == 1){
            return "옷장";
        }
        if(choice == 2){
            return "행거";
        }
    }

    if(cat == '접이식 테이블'){
        return '접이식테이블';
    }

    if(cat == '식탁'){
        return '식탁';
    }

    if(cat == '전신거울'){
        return '전신거울';
    }

    if(cat == '화장대'){
        return '화장대';
    }

    if(cat == '협탁'){
        return '협탁';
    }

    if(cat == 'tv'){
        return 'tv';
    }

    if(cat == '카펫'){
        return '카펫'
    }

    if(cat == '커튼'){
        return '커튼';
    }
}
//#################카테고리 선택 끝#############################

router.get('/recommend/:userid',async function(req, res){
    userid = req.params.userid;
    result = await database(userid);//사용자의 선호 가구정보 받아옴
    
    let furList; //가구 리스트
    if(result.list == 1){
        furList = ["침대", "책상", "의자", "서랍장", "옷장", "접이식 테이블"];
    }
    else if(result.list == 2){
        furList = ["침대", "책상", "의자", "서랍장", "옷장", "접이식 테이블", "식탁", "전신거울", "화장대", "협탁"];
    }
    else if(result.list == 3){
        furList = ["침대", "책상", "의자", "서랍장", "옷장", "접이식 테이블", "식탁", "전신거울", "화장대", "협탁", "tv", "카펫", "커튼"];
    }

    //색 선택하기
    if(result.design == 1){
        color = ['white', 'black', 'gray'];//베이지 없음
    }
    else if(result.design == 2){
        color = ['red', 'blue', 'yellow', 'green', 'skyBlue', 'bluishViolet', 'pink', 'yellowGreen'];
    }
    else if(result.design == 4){
        color = ['brown'];
    }

    minPrice = result.minPrice;
    maxPrice = result.maxPrice;
    
    //----------선택사항 없음---------
    brand = [];
    spec = [];//종류, 배열
    spec2 = [];
    //--------------------------------

    var returnObjectList = []; //가구별로 목록 담음(침대, 테이블등 구분해서 배열에 넣음)
    var returnUrlList = []; //해당 페이지의 url을 담음

    // for(var cat in furList){
    for(var i = 0; i < furList.length; i++){
        var cat = furList[i];
        var _choice = 0;
        if(cat == '의자') _choice = result.chair;
        else if(cat == '옷장') _choice = result.closet;
        else if(cat == '서랍장') _choice = result.shelf;
        else if(cat == '접이식 테이블') _choice = result.table;
        else if(cat == '침대') _choice = result.bed;

        var returnedCat = returnCat(cat, _choice)

        var url = await choice(returnedCat, color, brand, minPrice, maxPrice, spec, spec2);
        objectResult = await getAll(url);

        returnObjectList.push(objectResult);
        returnUrlList.push(url);
    }

    res.json({
        furnitureList: furList,
        url: returnUrlList,
        furnitures: returnObjectList
    });
});

module.exports = router;