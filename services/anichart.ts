import { AnichartMedia } from "../models/AnichartMedia";
import { Format } from "../models/Format.enum";
import { Season } from "../models/Season.enum";
import fetch from "node-fetch";

const graphqlQuery = `query (
    $season: MediaSeason,
    $year: Int,
    $format: MediaFormat,
    $excludeFormat: MediaFormat,
    $status: MediaStatus,
    $minEpisodes: Int,
    $page: Int,
  ){
    Page(page: $page) {
      pageInfo {
        hasNextPage
        total
      }
      media(
        season: $season
        seasonYear: $year
        format: $format,
        format_not: $excludeFormat,
        status: $status,
        episodes_greater: $minEpisodes,
        isAdult: false,
        type: ANIME,
        sort: TITLE_ROMAJI,
      ) {  
        id
        idMal
        title {
          romaji
          native
          english
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        season
        format
        genres
        synonyms
        duration
        popularity
        episodes
        source(version: 2)
        countryOfOrigin
        hashtag
        averageScore
        siteUrl
        description
        bannerImage
        isAdult
        coverImage {
          extraLarge
          color
        }
        trailer {
          id
          site
          thumbnail
        }
        externalLinks {
          site
          url
        }
        rankings {
          rank
          type
          season
          allTime
        }
        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
        relations {
          edges {
            relationType(version: 2)
            node {
              id
              title {
                romaji
                native
                english
              }
              siteUrl
            }
          }
        }
        
        airingSchedule(
          notYetAired: true
          perPage: 2
        ) {
          nodes {
            episode
            airingAt
          }
        }
      }
    }
  }`;

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
      query: graphqlQuery,
      variables: queryVariables,
    }),
    method: "POST",
  });
  const json = await res.json();
  const shows = json.data.Page.media;
  return shows;
};
