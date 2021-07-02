import fetch from "node-fetch";
import { Headers } from "node-fetch";
import { SonarrSeries } from "../models/SonarrSeries";

const baseUrl = process.env.SONARR_API_BASE_URL;
if (!baseUrl) {
  throw new Error("SONARR_API_BASE_URL is a required environment variable.");
}
const apiKey = process.env.SONARR_API_KEY;
if (!apiKey) {
  throw new Error("SONARR_API_KEY is a required environment variable.");
}
const headers = new Headers({ "X-API-Key": apiKey });

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
  const allSeries = await data.json();
  return allSeries;
}
