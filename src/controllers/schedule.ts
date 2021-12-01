import express from "express";

import { Season, Format, AnichartMedia, GetTitle } from "../models";
import { GetSeasonMedia } from "../services/anichart";
import { matchSeriesTitle as matchSeriesByTitle } from "../services/tvdb";

export const schedule = express.Router();

schedule.get("/:year/:season", async (req, res) => {
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
        if (matched.description == undefined) {
          if (show.description !== undefined) {
            // Use the AniList provided description (less prefered, but better than nothing).
            // We have to clean any HTML out of it though, as they may have formatting elements.
            matched.description = show.description.replace(/<[^>]+>/gm, "");
          }
          // handle missing descriptions from theTVDB
          else {
            matched.description =
              "No description available on theTVDB or AniList, yet...";
          }
        }
        // matched.print();
        return matched;
      } catch (err) {
        console.error(err);
      }
    })
  );

  return res.json(series);
});
