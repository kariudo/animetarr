import fetch from "node-fetch";
import bottleneck from "bottleneck";
import { type AnichartMedia, Format, Season } from "../models";
import { anichartQuery } from "./graphQLQuery";

// Limit to 1 request per second
const limiter = new bottleneck({
  minTime: 100,
  maxConcurrent: 1,
});
const throttledFetch = limiter.wrap(fetch) as typeof fetch;

export const GetSeasonMedia = async function (
  year: number,
  season: Season,
  format: Format
): Promise<AnichartMedia[]> {
  const queryVariables = {
    season: season,
    year: year,
    format: format,
    page: 1,
  };

  const shows: AnichartMedia[] = [];
  // Continue fetch until there are no more pages.
  let hasNextPage = true;
  do {
    const res = await throttledFetch("https://graphql.anilist.co/", {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: anichartQuery,
        variables: queryVariables,
      }),
      method: "POST",
    });
    const json: any = await res.json();
    shows.push(...json.data.Page.media);
    hasNextPage = json.data.Page.pageInfo.hasNextPage;
    // Log debug for the fetch
    console.debug(`Fetch: format: ${queryVariables.format}, season: ${queryVariables.season}, year: ${queryVariables.year}, page ${queryVariables.page}, hasNextPage: ${hasNextPage}, rolling total: ${shows.length}`, hasNextPage);
    queryVariables.page++;
  } while (hasNextPage);

  return shows;
};
