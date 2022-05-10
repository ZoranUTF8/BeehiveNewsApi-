const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
//* array that hold news articles
const articles = [];
//* array that hold news sources
const sources = [
  {
    name: "Sustainabilitynews",
    address: "https://sustainabilitynews.eu/category/news/",
    source: "Sustainability news",
    area: "International",
  },
  {
    name: "Oekonews",
    address: "https://www.oekonews.at/",
    source: "Oekonews",
    base: "https://www.oekonews.at",
    area: "Europe",
  },
  {
    name: "UtopiaEnergie",
    address: "https://utopia.de/energie/",
    source: "Utopia energie",
    area: "Europe",
  },
  {
    name: "UtopiaWissenTechnik",
    address: "https://utopia.de/wissen-technik/",
    source: "Utopia technik",
    area: "Europe",
  },
];

//* Returns the substring with our defaultNewsDescriptionLength as specified.
//* If you want the length of the news longer then just increase the defaultNewsDescriptionLength to your wishes
function trimNewsDescription(newsParam) {
  const defaultNewsDescriptionLength = 150;
  let newsParamOut = "";

  newsParam.length > defaultNewsDescriptionLength
    ? (newsParamOut =
        newsParam.substring(0, defaultNewsDescriptionLength - 3) + "...")
    : (newsParamOut = newsParam);

  return newsParamOut;
}
function fixDateSpaces(stringParam) {
  return stringParam.replace(/\s/g, "");
}
function removeExtraLines(stringParam) {
  return stringParam.replace(/[\n\r]/g, "");
}

//* Loop trough each of the news sources array and scrape the data that we want
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
      $(".td_module_10", sourceHtml).each((_, element) => {
        const imgLink = $(element)
          .children()
          .first()
          .children()
          .children("img")
          .attr("data-img-url");

        const title = $(element)
          .children()
          .first()
          .children()
          .children("img")
          .attr("title");

        let newsDate = $(element)
          .children()
          .last()
          .children(".td-module-meta-info")
          .text();
        const newsDateOut = fixDateSpaces(newsDate);

        let newsDescriptionIn = $(element)
          .children()
          .last()
          .children(".td-excerpt")
          .text();

        const newsDescriptionOut = trimNewsDescription(
          removeExtraLines(newsDescriptionIn.trim())
        );

        const newsLink = $(element).children().first().children().attr("href");

        const newsSource = source?.source;

        const area = source?.area;

        articles.push({
          title,
          imgLink,
          newsLink,
          newsDateOut,
          newsDescriptionOut,
          newsSource,
          area,
        });
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

        const area = source.area;

        const newsDate = $(element)
          .children("p")
          .first()
          .children()
          .children("time")
          .text();
        const newsDateOut = fixDateSpaces(newsDate);

        articles.push({
          title,
          imgLink,
          newsLink,
          newsDateOut,
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

        const newsLink = $(element).children().children().attr("href");

        const title = $(element).children().last().children("h3").text();

        const newsDate = $(element)
          .children()
          .last()
          .children("p")
          .children()
          .children()
          .children()
          .last()
          .children()
          .last()
          .text();

        let newsDescriptionIn = $(element)
          .children()
          .last()
          .children("p")
          .text();

        let newsDescriptionOut = trimNewsDescription(
          removeExtraLines(newsDescriptionIn.trim())
        );

        const newsSource = source.source;
        const area = source.area;

        articles.push({
          title,
          imgLink,
          newsLink,
          newsDate,
          newsDescriptionOut,
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

        const newsDescriptionIn = $(element)
          .children()
          .last()
          .children("p")
          .text();

        const newsDescriptionOut = trimNewsDescription(
          newsDescriptionIn.trim()
        );

        const newsDate = $(element)
          .children()
          .last()
          .children("p")
          .children()
          .children()
          .children()
          .last()
          .children()
          .last()
          .text();

        articles.push({
          title,
          imgLink,
          newsLink,
          newsDescriptionOut,
          newsDate,
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

// Todo
// app.get("/news/:sourceName", (req, res) => {
//   const { sourceName } = req.params;

//   const source = sources.filter((source) => source.name === sourceName);

//    GET SPECIFIC NEWS IF NEEDED
// });

//
app.listen(PORT, () => {
  console.log(`Server on  PORT: ${PORT}`);
});
