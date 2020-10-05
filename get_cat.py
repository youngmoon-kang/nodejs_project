# -*- coding: utf-8 -*-
"""
Created on Sun Jul  5 11:23:29 2020

@author: Kang
"""

from bs4 import BeautifulSoup as bs
import urllib.request

# url = 'https://search.shopping.naver.com/search/all?pagingIndex=1&pagingSize=20&productSet=total&query=%EA%B0%80%EA%B5%AC&sort=rel&timestamp=&viewType=list&color=16%2064'
# html = urllib.request.urlopen(url).read()
# soup = bs(html, 'html.parser')

# result = soup.select_one('.filter_text_over__3zD9c')
# result = soup.select('.filter_text_over__3zD9c')
# print(result)

s='<ul class="filter_finder_list__16XU5"><li class=""><button type="button"><span class="filter_text_over__3zD9c">거실가구<span class="filter_num__1SlWk">2,413,345</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">서재/사무용가구<span class="filter_num__1SlWk">4,806,469</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">수납가구<span class="filter_num__1SlWk">3,906,537</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">침실가구<span class="filter_num__1SlWk">5,403,657</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">주방가구<span class="filter_num__1SlWk">2,132,297</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">DIY자재/용품<span class="filter_num__1SlWk">1,990,258</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">인테리어소품<span class="filter_num__1SlWk">483,838</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">아동/주니어가구<span class="filter_num__1SlWk">374,524</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">아웃도어가구<span class="filter_num__1SlWk">319,836</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">홈데코<span class="filter_num__1SlWk">71,176</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">커튼/블라인드<span class="filter_num__1SlWk">28,939</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">침구단품<span class="filter_num__1SlWk">26,010</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">카페트/러그<span class="filter_num__1SlWk">16,610</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">수예<span class="filter_num__1SlWk">7,401</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">침구세트<span class="filter_num__1SlWk">3,902</span></span></button></li><li class=""><button type="button"><span class="filter_text_over__3zD9c">솜류<span class="filter_num__1SlWk">349</span></span></button></li></ul>'

soup = bs(s, 'html.parser')
result = soup.select('.filter_text_over__3zD9c')
brands = []
for c in result:
    cc = c.get_text()
    print(cc)
    brands.append(c.get_text())
# print(brands)
