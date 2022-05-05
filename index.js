"use strict";

const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
// array that hold news articles
const articles = [];
// array that hold news sources
const sources = [
  {
    name: "Sustainabilitynews",
    address: "https://sustainabilitynews.eu/category/news/",
    source: "sustainabilitynews",
  },
  {
    name: "Oekonews",
    address: "https://www.oekonews.at/",
    source: "oekonews",
    base: "https://www.oekonews.at",
  },
  {
    name: "UtopiaEnergie",
    address: "https://utopia.de/energie/",
    source: "utopia-energie",
  },
  {
    name: "UtopiaWissenTechnik",
    address: "https://utopia.de/wissen-technik/",
    source: "utopia-technik",
  },
];

sources.forEach(async function (source) {
  // fetch source page html
  const result = await axios.get(source.address);
  // Assign the page html
  const sourceHtml = result.data;
  // Load the source html into cherrio
  const $ = cheerio.load(sourceHtml);

  // Retrive the elements data as needed
  switch (source.name) {
    case "Sustainabilitynews":
      $(".td-image-wrap ", sourceHtml).each((_, element) => {
        const imgLink = $(element).children("img").attr("data-img-url");
        const title = $(element).children("img").attr("title");
        const newsLink = $(element).attr("href");
        const newsSource = source.source;
        const area = "international";

        articles.push({ title, imgLink, newsLink, newsSource, area });
      });

      break;

    case "Oekonews":
      $(".uebersicht", sourceHtml).each((_, element) => {
        const imgLink =
          sources[1].base +
            $(element).children("a").children("img").attr("src") ||
          $(element).children("h2").children("a").attr("href");

        const newsLink = $(element).children("a").attr("href").slice(2);
        const title = $(element).children("h2").text();
        const newsSource = source.source;
        const area = "europe";

        articles.push({
          title,
          imgLink,
          newsLink,
          newsSource,
          area,
        });
      });
      break;

    case "UtopiaEnergie":
      $(".standard-post", sourceHtml).each((_, element) => {
        const imgLink =
          $(element)
            .children()
            .first()
            .children()
            .children()
            .attr("data-lazy-src") ||
          $(element).children().first().children().children().attr("src");

        const newsLink = $(element)
          .children()
          .last()
          .children()
          .children("a")
          .attr("href");

        const title = $(element).children().last().children("h3").text();
        const newsSource = source.source;
        const area = "europe";

        articles.push({
          title,
          imgLink,
          newsLink,
          newsSource,
          area,
        });
      });
      break;

    case "UtopiaWissenTechnik":
      $(".standard-post", sourceHtml).each((_, element) => {
        const imgLink =
          $(element)
            .children()
            .first()
            .children()
            .children()
            .attr("data-lazy-src") ||
          $(element).children().first().children().children().attr("src");

        const newsLink = $(element)
          .children()
          .last()
          .children()
          .children("a")
          .attr("href");

        const title = $(element).children().last().children("h3").text();
        const newsSource = source.source;
        const area = "europe";

        articles.push({
          title,
          imgLink,
          newsLink,
          newsSource,
          area,
        });
      });

      break;
    default:
      console.err("No such option (sources.foreach())");
  }
});

// * API ROUTES

app.get("/", (req, res) => {
  res.json("Welcome to beehivve news api, to get the news go to /news!");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:sourceName", (req, res) => {
  const { sourceName } = req.params;

  const source = sources.filter((source) => source.name === sourceName);

  //  GET SPECIFIC NEWS IF NEEDED
});

//
app.listen(PORT, () => {
  console.log(`Server on : ${PORT}`);
});
