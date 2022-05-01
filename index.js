const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
// array to hold news articles
const articles = [];

// * API ROUTES

app.get("/", (req, res) => {
  res.json("ola");
});

app.get("/news", async (req, res) => {
  console.log("====================================");
  console.log("GET NEWS");
  console.log("====================================");
  try {

    const result = await axios.get(
      "https://sustainabilitynews.eu/category/news/"
    );
    const html = result.data;

    // pass HTML data to cherrio which will allow us to pick out what elements we want
    const $ = cheerio.load(html);

    $(".entry-title", html).each((index, element) => {
      const title = $(this).text();
      const link = $(this).children("a").attr("href");
      console.log($(element).text());
    });
    
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server on : ${PORT}`);
});
