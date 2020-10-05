var url = "https://search.shopping.naver.com/search/all?pagingIndex=1&pagingSize=20&productSet=total&query=%EA%B0%80%EA%B5%AC&sort=rel&timestamp=&viewType=list&catId=undefined&color=16%2032&minPrice=0&maxPrice=40000&minPrice-maxPrice=0-40000&brand=444"
var s = url.indexOf("pagingIndex=");
var front = url.substr(0,s+12)

var s = url.indexOf("&pagingSize=");
var back = url.substr(s, )

var out = front + "2" + back
console.log(out);