import { SeriesData } from "../models/SeriesData";
import { TVDBSeries } from "../models/TVDBSeries";
import { Season } from "../models/Season.enum";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TVDB = require("node-tvdb");
const tvdbkey = process.env.TVDB_API_KEY;
if (!tvdbkey) {
  throw new Error("TVDB_API_KEY is a required environment variable.");
}
export const tvdb = new TVDB(tvdbkey);

/**
 * Look up an TVDB entry based on series title.
 *
 * @param title Title to search for.
 * @param originalTitle Optional original title (used when retrying).
 *
 * @returns Promise of SeriesData or an Error.
 */
export async function matchSeriesTitle(
  title: string,
  originalTitle?: string,
  year?: number,
  season?: Season
): Promise<SeriesData> {
  try {
    const results = await tvdb.getSeriesByName(title);
    const series: TVDBSeries = results[0];
    const seriesData: SeriesData = new SeriesData({
      tvdbId: series.id,
      title: series.seriesName,
      queryYear: year,
      airdate: new Date(series.firstAired),
      description: series.overview,
      imageUrl: `https://www.thetvdb.com${series.image}`,
      posterUrl: `https://www.thetvdb.com${series.poster}`, // these seem to be the same...
      aliases: series.aliases,
      season: season,
      matchedQuery: title,
      originalTitle: originalTitle ?? title,
      status: series.status,
    });
    return seriesData;
  } catch (err) {
    return retryWithShorterName(title, originalTitle, year, season);
  }
}

/**
 * Retry query with a shorter version of the title.
 *
 * @param title Title
 * @param originalTitle Original title
 * @returns Promise of SeriesData or Error.
 */
async function retryWithShorterName(
  title: string,
  originalTitle?: string,
  year?: number,
  season?: Season
): Promise<SeriesData> {
  const shortenedTitle = removeLastWord(title);
  if (shortenedTitle) {
    return matchSeriesTitle(
      shortenedTitle,
      originalTitle ?? title,
      year,
      season
    );
  } else {
    throw new Error("Name cannot be shortened.");
  }
}

export async function getSeries(tvdbId: number): Promise<TVDBSeries> {
  return tvdb.getSeriesById(tvdbId);
}

/**
 * Removes the last word from a string.
 *
 * @returns Shorter string.
 */
function removeLastWord(str: string): string {
  return str.substring(0, str.lastIndexOf(" ")).trim();
}
