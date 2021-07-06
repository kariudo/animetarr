export interface SonarrSeries {
  title: string;
  alternateTitles: AlternateTitle[];
  sortTitle: string;
  seasonCount: number;
  totalEpisodeCount: number;
  episodeCount: number;
  episodeFileCount: number;
  sizeOnDisk: number;
  status: string;
  overview: string;
  previousAiring: string;
  network: string;
  images: Image[];
  seasons: Season[];
  year: number;
  path: string;
  profileId: number;
  languageProfileId: number;
  seasonFolder: boolean;
  monitored: boolean;
  useSceneNumbering: boolean;
  runtime: number;
  tvdbId: number;
  tvRageId: number;
  tvMazeId: number;
  firstAired: string;
  lastInfoSync: string;
  seriesType: string;
  cleanTitle: string;
  imdbId: string;
  titleSlug: string;
  certification: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: Ratings;
  qualityProfileId: number;
  id: number;
}

export interface AlternateTitle {
  title: string;
  sceneSeasonNumber: number;
}

export interface Image {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface Ratings {
  votes: number;
  value: number;
}

export interface Season {
  seasonNumber: number;
  monitored: boolean;
  statistics: Statistics;
}

export interface Statistics {
  episodeFileCount: number;
  episodeCount: number;
  totalEpisodeCount: number;
  sizeOnDisk: number;
  percentOfEpisodes: number;
  previousAiring?: string;
}
