# n-web-comic-crawler

萬惡的n網爬蟲
* 有任何問題或想新增的功能歡迎提出
* 作者: 坤條悟
* 最近更新日期: 2024/2/24


>[!note]
>### 網頁版製作中/Website under construction/ウェブページ制作中
>以後就不用將檔案下載到本地與安裝`node.js`  
>when fininsh ,you can download comic on web and dont install `node.js` 

## 如何使用
**建議安裝vscode後再使用**  
>安裝 node.js

1. 去官網下載`node.js`
2. 把下載路徑導至系統環境變數

[如果聽不懂第1、2步，點我](https://youtu.be/_LtwT5_zmDs?si=sCTPBAa0DmVGzKqV)  

> 安裝`module`

3. 打開vscode或終端機
4. 輸入以下
```bash
npm install axios
```

>[!note]
>如果報錯，很有可能是沒有將node.js加入環境變數

5. 再輸入
```bash
npm install cheerio
```

6. 用`vscode`打開 `comic.js`輸入你想放入的本本連結

**格式**(要用`,`分開兩個連結!!!!)  範例:

`path`: 要存的路徑  
`downloadlist`: 漫畫連結
```json
{
  "path": "D:/新增資料夾",
  "downloadlist": [
    "https://nhentai.net/g/484853/",
    "https://nhentai.net/g/496499/",
    "https://nhentai.net/g/493079/",
    "https://nhentai.net/g/496593/",
    "https://nhentai.net/g/496551/",
    "https://nhentai.net/g/496546/",
    "https://nhentai.net/g/496541/",
    "https://nhentai.net/g/496524/",
    "https://nhentai.net/g/496455/",
    "https://nhentai.net/g/496385/",
    "https://nhentai.net/g/480309/",
    "https://nhentai.net/g/342166/",
    "https://nhentai.net/g/496273/",
    "https://nhentai.net/g/496224/",
    "https://nhentai.net/g/496191/",
    "https://nhentai.net/g/489598/",
    "https://nhentai.net/g/489598/",
    "https://nhentai.net/g/483156/",
    "https://nhentai.net/g/479110/",
    "https://nhentai.net/g/440995/",
    "https://nhentai.net/g/436626/",
    "https://nhentai.net/g/434646/"
  ]
}
```


7. 最後輸入(要確定code路徑在`/nhentia`裡)，執行code
```bash
node remake.js
```
* code沒在路徑的話，輸入:
```bash
cd /nhentia
```



* 祝你研究愉快[]/(￣▽￣)/*

