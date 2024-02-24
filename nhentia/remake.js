const fs = require('fs');
const fsa = require('fs').promises;
const axios = require('axios');
const { promisify } = require('util');
const cheerio = require('cheerio');
const path = require('path');

const Headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
  Cookie:
    'cf_chl_3=f819404ec72249d; cf_clearance=ODBzvF8eACsDv..kXuKOyy1nTjwP25jPecEFtbjit0U-1708016344-1.0-AZRDfUYG2WUUIJESLMgVK/LlRVtxl7wML+nrfyLvy+mYR8UFbUP7AHv88Ph01o4G0YXO7stB+NmLXPk8+vuzrCc=; csrftoken=muf6aLxzVGYZZawntbhIORS9CxznmwtU8khHI17cpWCRyGQikdaEFyX74VmDBbWk',
};

const readFileAsync = promisify(fs.readFile);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get_comic() {
  try {
    const a = await readFileAsync('./comic.json', 'utf-8');
    const c = JSON.parse(a);

    const path = c.path;

    const batchSize = 2;

    console.log('開始批量下載 []~(￣▽￣)~*');
    for (let i = 0; i < c.downloadlist.length; i += batchSize) {
      const batch = c.downloadlist.slice(i, i + batchSize);
      await Promise.all(batch.map((comic) => geturl(comic, path)));
      console.log('============部分下載完成==============');

      await sleep(1000);
    }

    console.log('全部都以下載完成，祝你研究愉快!q(≧ ▽ ≦ q) ');
  } catch (err) {
    console.log(err);
  }
}

async function geturl(url, path) {
  try {
    const res = await axios.get(url, { headers: Headers });
    if (res.status === 200) {
      const cheer_page = cheerio.load(res.data);
      let title = cheer_page('h2.title');

      // title
      if (title.text() == '') {
        const tem = cheer_page('h1').text().split('|');
        title = tem[0].replace(/[\/\\:*?"<>|]/g, '').trim();
      } else {
        title = title
          .find('span.pretty')
          .text()
          .replace(/[\/\\:*?"<>|]/g, '');
      }
      path = path + '/' + title;
      if (!fs.existsSync(path)) {
        console.log(`正在取得${title}....`);
        fs.mkdirSync(path);
      } else {
        console.log('下載到重複名稱的本子');
      }

      //enter page
      const pages = cheer_page('div#thumbnail-container').find(
        'a.gallerythumb'
      );
      //load page
      for (let i = 1; i <= pages.toArray().length; i++) {
        const page_url = url + i + '/';
        try {
          const resp = await axios.get(page_url, { headers: Headers });
          const cheer_img = cheerio.load(resp.data);
          const img = cheer_img('section#image-container')
            .find('img')
            .attr('src');
          download_img(img, path, i);
        } catch (error) {
          console.log('載入失敗:', page_url);
        }
      }
    } else if (res.status === 429) {
      console.log('429!!');
    }
  } catch (err) {
    console.log('抓取提供網址失敗', err);
  }
}

async function download_img(url, path, name) {
  try {
    console.log(`正在下載:${url}`);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: Headers,
    });
    //const radomdelay = MAth.floor(Math.random() * (4000 - 1000 + 1) + 1000);
    fs.writeFileSync(path + '/' + name + url.split(".").pop(), response.data);
    //await new Promise((resolve) => setTimeout(resolve, randomDelay));
  } catch (err) {
    console.error('下載失敗', err);
  }
}

get_comic();

//test area
//https://nhentai.to/g/426488/
//https://nhentai.net/g/496499/
//geturl('https://nhentai.to/g/426488/', 'D:/新增資料夾');
//download_img('https://cdn.dogehls.xyz/galleries/2365990/2.png', '.');
