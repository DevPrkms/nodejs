const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
let articleLink = new Array();

let home = "https://www.donga.com/news/List?p=1&m=NP";
const getHtml = async () => {
  try {
    return await axios.get(home);
  } catch (error) {
    console.error(error);
  }
};

getHtml().then((html) => {
  let newsarticle = [];
  const $ = cheerio.load(html.data);
  const $bodyList = $("div#content").children("div.articleList");

  $bodyList.each(function (i, elem) {
    // newsarticle[i] = {
    //   article: $(this).find("div.rightList a").attr("href"),
    // };
    articleLink[i] = $(this).find("div.rightList a").attr("href");
  });
  for (let k = 0; k < articleLink.length; k++) {
    const getNews = async () => {
      try {
        return await axios.get(articleLink[k]);
      } catch (error) {
        console.error(error);
      }
    };

    getNews()
      .then((html) => {
        let news = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div#dongawrap");

        $bodyList.each(function (i, elem) {
          news[i] = {
            title: $(this).find("h1.title").text(),
            content: $(this)
              .find("div.article_txt")
              .text()
              .trim()
              .replace(/\n/gi, " "),
          };
        });

        const data = news.filter((n) => n.title);
        return data;
      })
      .then((res) => log(res));
  }
});

// for (let k = 0; k < articleLink.length; k++) {
//   log("본문 크롤링");
//   const getNews = async () => {
//     try {
//       return await axios.get(articleLink[k]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   getNews()
//     .then((html) => {
//       let news = [];
//       const $ = cheerio.load(html.data);
//       const $bodyList = $("div#dongawrap");

//       $bodyList.each(function (i, elem) {
//         news[i] = {
//           title: $(this).find("h1.title").text(),
//           content: $(this).find("div.article_txt"),
//         };
//       });

//       const data = news.filter((n) => n.title);
//       return data;
//     })
//     .then((res) => log(res));
// }
