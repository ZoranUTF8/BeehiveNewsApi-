const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { index } = require("cheerio/lib/api/traversing");
const app = express();
// array that hold news articles
const articles = [];
// array that hold news sources
const sources = [
  {
    name: "sustainabilitynews",
    address: "https://sustainabilitynews.eu/category/news/",
    source: "sustainabilitynews",
    area: "international",
  },
  {
    name: "oekonews",
    address: "https://www.oekonews.at/",
    source: "oekonews",
    area: "europe",
  },
  {
    name: "utopiaEnergie",
    address: "https://utopia.de/energie/",
    source: "utopia",
    area: "europe",
  },
  {
    name: "utopiaWissenTechnik",
    address: "https://utopia.de/wissen-technik/",
    source: "utopia",
    area: "europe",
  },
];

sources.forEach(async function (source) {
  const result = await axios.get(source.address);

  const sourceHtml = result.data;
  const $ = cheerio.load(sourceHtml);

  switch (source.name) {
    case "sustainabilitynews":
      console.log("sustainabilitynews");
      $(".td-image-wrap ", sourceHtml).each((_, element) => {
        const imgLink = $(element).children("img").attr("data-img-url");
        const title = $(element).children("img").attr("title");
        const newsLink = $(element).attr("href");
        const source = "international";
        articles.push({ title, imgLink, newsLink, source });
      });
      break;
    case "oekonews":
      console.log("oekonews");
      break;
    case "utopiaEnergie":
      console.log("utopiaEnergie");
      break;
    case "utopiaWissenTechnik":
      console.log("utopiaWissenTechnik");
      break;
    default:
      console.err("No such option (sources.foreach())");
  }
});

// * API ROUTES

app.get("/", (req, res) => {
  res.json("ola");
});

app.get("/news", async (req, res) => {
  // try {
  //   const result = await axios.get(
  //     "https://sustainabilitynews.eu/category/news/"
  //   );
  //   const html = result.data;
  //   // pass HTML data to cherrio which will allow us to pick out what elements we want
  //   const $ = cheerio.load(html);
  //   // take the img link and news title
  //   $(".td-image-wrap ", html).each((_, element) => {
  //     const imgLink = $(element).children("img").attr("data-img-url");
  //     const title = $(element).children("img").attr("title");
  //     const newsLink = $(element).attr("href");
  //     const source = "international";
  //     articles.push({ title, imgLink, newsLink, source });
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  // // send the articles object as json
  res.json(articles);
});

app.listen(PORT, () => {
  console.log(`Server on : ${PORT}`);
});
