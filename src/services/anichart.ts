import fetch from "node-fetch";
import { AnichartMedia, Format, Season } from "../models";
import { anichartQuery } from "./graphQLQuery";

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
    const res = await fetch("https://graphql.anilist.co/", {
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
    shows.push(json.data.Page.media);
    hasNextPage = json.data.Page.pageInfo.hasNextPage;
  } while (hasNextPage);

  return shows;
};
