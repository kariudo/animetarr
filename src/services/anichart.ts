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
  const json = await res.json();
  const shows = json.data.Page.media;
  return shows;
};
