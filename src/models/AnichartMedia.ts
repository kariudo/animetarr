export interface AnichartMedia {
  id: number;
  idMal: number;
  title: Title;
  startDate: EndDateClass;
  endDate: EndDateClass;
  status: string;
  season: string;
  format: string;
  genres: string[];
  synonyms: string[];
  duration: null;
  popularity: number;
  episodes: number;
  source: string;
  countryOfOrigin: string;
  hashtag: string;
  averageScore: null;
  siteUrl: string;
  description: string;
  bannerImage: null;
  isAdult: boolean;
  coverImage: CoverImage;
  trailer: Trailer;
  externalLinks: ExternalLink[];
  rankings: Ranking[];
  studios: Studios;
  relations: Relations;
  airingSchedule: AiringSchedule;
}

export interface AiringSchedule {
  nodes: AiringScheduleNode[];
}

export interface AiringScheduleNode {
  episode: number;
  airingAt: number;
}

export interface CoverImage {
  extraLarge: string;
  color: string;
}

export interface EndDateClass {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface ExternalLink {
  site: string;
  url: string;
}

export interface Ranking {
  rank: number;
  type: string;
  season: null | string;
  allTime: boolean;
}

export interface Relations {
  edges: Edge[];
}

export interface Edge {
  relationType: string;
  node: EdgeNode;
}

export interface EdgeNode {
  id: number;
  title: Title;
  siteUrl: string;
}

export interface Title {
  romaji: string;
  native: string;
  english: string;
}

export interface Studios {
  nodes: StudiosNode[];
}

export interface StudiosNode {
  id: number;
  name: string;
  siteUrl: string;
}

export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

/**
 * Get the first available title of a Anichart Media item.
 *
 * @param media AnichartMedia entry.
 * @returns A title.
 */
export function GetTitle(media: AnichartMedia): string {
  return media.title.english ?? media.title.romaji ?? media.title.native;
}
