import fetch, { Headers } from "node-fetch";
import type { SonarrSeries } from "../models";

const baseUrl = process.env.SONARR_API_BASE_URL;
if (!baseUrl) {
  throw new Error("SONARR_API_BASE_URL is a required environment variable.");
}
const apiKey = process.env.SONARR_API_KEY;
if (!apiKey) {
  throw new Error("SONARR_API_KEY is a required environment variable.");
}
const headers = new Headers(
  [
    ["X-API-Key", apiKey],
    ["Content-Type", "application/json"],
    ["Accept", "application/json"]
  ]
);

/**
 * Get all TVDB IDs for currently tracked series in Sonarr.
 *
 * @returns A list of series TVDB IDs.
 */
export async function GetAllSeriesId(): Promise<number[]> {
  const allSeries = await GetAllSeries();
  const ids = allSeries.map((series: SonarrSeries) => series.tvdbId);
  return ids;
}

/**
 * Get all currently tracked series in Sonarr.
 *
 * @returns A list of series.
 */
export async function GetAllSeries(): Promise<SonarrSeries[]> {
  const endpoint = "/series";
  const data = await fetch(baseUrl + endpoint, {
    headers: headers,
  });
  const allSeries = await data.json() as SonarrSeries[];
  return allSeries;
}

/**
 * Add a series to Sonarr.
 *
 * @param tvdbId The TVDB ID of the series to add.
 * @returns Added series.
 */
export async function PostSeries(tvdbId: number): Promise<SonarrSeries> {
  // Use Sonarr to lookup the series for TVDB, since we need its properties.
  const tvdbSeriesResponse = await fetch(
    `${baseUrl}/series/lookup?term=tvdb:${tvdbId}`,
    { headers: headers }
  );
  let series: SonarrSeries = await tvdbSeriesResponse.json() as SonarrSeries;
  // If the series was returned as an array, we only want the first result. [This was introduced in Sonarr 4+]
  if (Array.isArray(series)) {
    series = series[0];
  }
  // Add the series to Sonarr.
  const endpoint = "/series";
  const bodyJson = JSON.stringify({
    tvdbId: tvdbId,
    title: series.title,
    qualityProfileId: process.env.SONARR_QUALITY_PROFILE_ID,
    titleSlug: series.titleSlug,
    seasons: series.seasons,
    images: series.images,
    rootFolderPath: process.env.SONARR_BASE_PATH,
    seasonFolder: true,
    monitored: true,
    seriesType: "anime",
    addOptions: {
      searchForMissingEpisodes: true,
    },
  });

  // console.log("URL:", baseUrl + endpoint, "Headers:", JSON.stringify(headers), "Body:", bodyJson);

  const data = await fetch(baseUrl + endpoint, {
    headers: headers,
    method: "POST",
    body: bodyJson
  });

  try {
    const result = await data.json();
    const addedSeries = Array.isArray(result) ? result[0] : result;
    if (addedSeries.errorMessage) {
      console.log("Error:", addedSeries.errorMessage);
      return {} as SonarrSeries;
    }
    return addedSeries;
  } catch (error) {
    console.log(error);
    console.log("Unable to add series.")
    return {} as SonarrSeries;
  }
}
