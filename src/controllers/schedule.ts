import express, { Request, Response, Router } from "express";

import { Season, Format, AnichartMedia, GetTitle } from "../models";
import { GetSeasonMedia } from "../services/anichart";
import { matchSeriesTitle as matchSeriesByTitle } from "../services/tvdb";

export const schedule: Router = express.Router();

schedule.get("/:year/:season", async (req: Request<{ year: string; season: string }>, res: Response): Promise<void> => {
  const year = Number(req.params.year);
  const season = req.params.season.toUpperCase() as Season;

  if (!year || !season) {
    res.status(400);
    return;
  }

  // Get both TV, and ONA
  const tv = await GetSeasonMedia(year, season, Format.TV);
  const ona = await GetSeasonMedia(year, season, Format.ONA);
  const shows = [...tv, ...ona];
  const series = await Promise.all(
    shows.map(async (show: AnichartMedia) => {
      try {
        const matched = await matchSeriesByTitle(
          GetTitle(show),
          undefined,
          year,
          season,
          show
        );
        if (matched === null || matched === undefined) {
          throw new Error("Match was undefined or null.");
        }
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
      } catch (err: any) {
        console.error(err.message);
        console.warn(
          "Failed to match (a translation alias probably needs to be added to the TVDB): ",
          GetTitle(show),
          season,
          year
        );
      }
    })
  );

  res.json(series.filter((x) => x !== undefined));
});
