const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');

const Headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
  Cookie:
    'cf_chl_3=f819404ec72249d; cf_clearance=ODBzvF8eACsDv..kXuKOyy1nTjwP25jPecEFtbjit0U-1708016344-1.0-AZRDfUYG2WUUIJESLMgVK/LlRVtxl7wML+nrfyLvy+mYR8UFbUP7AHv88Ph01o4G0YXO7stB+NmLXPk8+vuzrCc=; csrftoken=muf6aLxzVGYZZawntbhIORS9CxznmwtU8khHI17cpWCRyGQikdaEFyX74VmDBbWk',
};

async function make_comic_folder(file_name) {
  try {
    await fs.mkdir(`./${file_name}`);
    //console.log('資料夾創建完成!!');
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log('folder already exists!');
    } else {
      throw err;
    }
  }
}

async function geturl(url) {
  let t;
  try {
    const res = await axios.get(url, { headers: Headers });
    const cheer = cheerio.load(res.data);

    // get title
    const h2 = cheer('h2.title');
    const title = h2
      .find('span.pretty')
      .text()
      .replace(/[\/\\:*?"<>|]/g, '');
    t = title;
    console.log(`正在下載${title}.....`);

    // mkdir
    await make_comic_folder(title);

    // get img url
    const findHref = cheer('a.gallerythumb').toArray();

    for (const hrefElement of findHref) {
      const href = 'https://nhentai.net/' + cheer(hrefElement).attr('href');
      try {
        const resp = await axios.get(href, { headers: Headers });
        const incheer = cheerio.load(resp.data);

        // get img
        const elment = incheer('section#image-container');
        const img = elment.find('img').attr('src');

        // download !!!!!
        await downloadimg(img, Headers, `./${title}`);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log('失敗');
  }
  console.log(`${t}下載完成，祝你研究學問愉快q( ≧ ▽ ≦  q)`);
}

async function downloadimg(url, headers, path) {
  try {
    const img_name = url.split('/').pop();
    const file_name = path + '/' + img_name;
    const res = await axios.get(url, { headers, responseType: 'arraybuffer' });
    await fs.writeFile(file_name, res.data);
  } catch (err) {
    console.log('下載失敗', err);
  }
}

async function main() {
  try {
    const JsonData = await fs.readFile('./comic.json', 'utf-8');
    const data_a = JSON.parse(JsonData);

    for (const url_get of data_a.downloadlist) {
      await geturl(url_get);
    }
  } catch (err) {
    console.error('主函數出現錯誤:', err);
  }
  console.log('全部都下載完成，請盡情欣賞');
}

main();
