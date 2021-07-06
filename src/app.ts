import dotenv from "dotenv-safe";
dotenv.config();

import { Format } from "./models/Format.enum";
import { Season } from "./models/Season.enum";
import { GetSeasonMedia } from "./services/anichart";
import { AnichartMedia, GetTitle } from "./models/AnichartMedia";
import { GetAllSeries, GetAllSeriesId, PostSeries } from "./services/sonarr";
import { matchSeriesTitle as matchSeriesByTitle } from "./services/tvdb";
import express from "express";

const app = express();
const port = Number(process.env.API_PORT ?? 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/animetarr-ui/dist/animetarr-ui/"));

app.set("json spaces", 2);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/animetarr-ui/dist/animetarr-ui/index.html");
});

app.get("/series/ids", async (req, res) => res.json(await GetAllSeriesId()));
app.get("/series", async (req, res) => res.json(await GetAllSeries()));

app.post("/series", async (req, res) => {
  const newSeriesId = req.body.tvdbId;
  const newSeries = await PostSeries(newSeriesId);
  res.json(newSeries);
});

app.get("/schedule/:year/:season", async (req, res) => {
  const year = Number(req.params.year);
  const season = req.params.season.toUpperCase() as Season;

  if (!year || !season) {
    return res.status(400);
  }

  const shows = await GetSeasonMedia(year, season, Format.tv);
  const series = await Promise.all(
    shows.map(async (show: AnichartMedia) => {
      try {
        const matched = await matchSeriesByTitle(
          GetTitle(show),
          undefined,
          year,
          season
        );
        matched.tags = show.genres;
        // matched.print();
        return matched;
      } catch (err) {
        console.error(err);
      }
    })
  );

  return res.json(series);
});

app.listen(port, () => {
  console.log(`Animetarr server is listening on port ${port}`);
});
