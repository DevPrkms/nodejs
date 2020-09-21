const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
const articleLink = new Array();
const db_config = require("../config/database.js");
const conn = db_config.init();

db_config.connect(conn);

let sql = "SELECT COUNT(*) AS CNT FROM NEWS";
conn.query(sql, function (err, rows, fields) {
  if (err) console.log("query is not excuted. select fail...\n" + err);
  else {
    if (rows[0].CNT != 0) {
      let sql = "DELETE FROM NEWS";
      conn.query(sql, function (err, result, fields) {
        if (err) throw error;
        log("Delete");
        conn.query("ALTER TABLE NEWS AUTO_INCREMENT = 0", function (err) {
          if (err) throw error;
          log("Increment Set");
        });
      });
    }
  }
});

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

    getNews().then((html) => {
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
            .replace(/[^가-힣]/g, " ")
            .replace(/ +/g, " "),
        };
        let sql = "INSERT INTO NEWS(NEWS_TITLE, NEWS_CONTENTS) VALUES(?, ?)";
        let params = [news[0].title, news[0].content];
        conn.query(sql, params, function (err) {
          if (err) log("query is not excuted. insert fail...\n" + err);
          else log("Ok");
        });
      });
    });
  }
});
