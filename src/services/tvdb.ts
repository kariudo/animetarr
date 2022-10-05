import { SeriesData } from "../models/SeriesData";
import { TVDBSeries } from "../models/TVDBSeries";
import { Season } from "../models/Season.enum";
import fetch from "node-fetch";

class TVDB {
  private apiKey: string;
  private token = "";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private get isLoggedIn(): boolean {
    return this.token.length > 0;
  }

  /**
   * Get login token.
   *
   * Token is good for one month.
   */
  async login() {
    // call login (token good for a month)
    const res = await fetch("https://api4.thetvdb.com/v4/login", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: "8f406bec-6ddb-45e7-8f4b-e1861e10f1bb",
        // TODO: If "pin" is included here it can support subscription users.
      }),
    });
    if (res.status === 401) {
      throw new Error("Invalid API Key");
    }
    const json = await res.json();
    if (json.status !== "success") {
      throw new Error(json.status);
    }
    this.token = json.data.token;
  }

  async searchSeries(query: string, year?: number): Promise<TVDBSeries> {
    // TODO: Series should be cached
    if (!this.isLoggedIn) {
      await this.login();
    }
    let url = `https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(
      query
    )}&type=series`;
    if (typeof year === "number") {
      url += `&year=${year}`;
    }
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (res.status !== 200) {
      throw new Error("Search failed.");
    }
    const json = await res.json();
    if (json.status !== "success") {
      throw new Error(`Search failed with status '${json.status}'.`);
    }
    if (json.data.length === 0) {
      throw new Error("No results for TVDB search.");
    }
    const d = json.data[0];
    // TODO: the images are all the same currently.
    return {
      aliases: d.aliases,
      banner: d.image_url,
      firstAired: d.first_air_time,
      id: d.tvdb_id,
      image: d.image_url,
      network: d.network,
      overview: d.overviews["eng"],
      poster: d.image_url,
      seriesName: d.translations["eng"],
      slug: d.slug,
      status: d.status,
    };
  }
}

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
    const series = await tvdb.searchSeries(title, year);
    const seriesData: SeriesData = new SeriesData({
      tvdbId: series.id,
      title: series.seriesName,
      queryYear: year,
      airdate: new Date(series.firstAired),
      description: series.overview,
      imageUrl: series.image,
      posterUrl: series.poster, // these seem to be the same...
      aliases: series.aliases ?? [],
      season: season,
      matchedQuery: title,
      originalTitle: originalTitle ?? title,
      status: series.status,
    });
    return seriesData;
  } catch (err) {
    // eslint-disable-next-line prefer-rest-params
    console.debug("Error when searching for:", arguments);
    try {
      return retryWithShorterName(title, originalTitle, year, season);
    } catch (retryErr) {
      throw new Error("Exhausted shorter name retry attempts with no result.");
    }
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
  const shortenedTitle =
    typeof year === undefined ? title : removeLastWord(title);
  if (shortenedTitle) {
    return matchSeriesTitle(
      shortenedTitle,
      originalTitle ?? title,
      undefined, // Do not include year in truncated searches, since it is most likely continuing.
      season
    );
  } else {
    throw new Error("Name cannot be shortened");
  }
}

/**
 * Removes the last word from a string.
 *
 * @returns Shorter string.
 */
function removeLastWord(str: string): string {
  return str.substring(0, str.lastIndexOf(" ")).trim();
}
