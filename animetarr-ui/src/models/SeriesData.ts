import { Season } from './Season.enum';

export interface SeriesData {
  tvdbId: number;
  title: string;
  queryYear: number;
  originalTitle: string;
  matchedQuery: string;
  status: string;
  season: Season | string;
  description: string;
  imageUrl: string;
  airdate: Date | string;
  posterUrl: string;
  aliases: string[];
  tags?: string[];
}
