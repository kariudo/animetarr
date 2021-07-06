import { Season } from "./Season.enum";

export class SeriesData {
  tvdbId!: number;
  title!: string;
  queryYear!: number;
  originalTitle!: string;
  matchedQuery!: string;
  status!: string;
  season!: Season;
  description = "";
  imageUrl = "";
  airdate?: Date;
  posterUrl = "";
  aliases: string[] = [];
  tags: string[] = [];

  constructor(params: Partial<SeriesData>) {
    Object.assign(this, params);
  }

  print(): void {
    console.log(
      `[tvdb: ${this.tvdbId}] ${this.title} (${this.queryYear} - ${this.season})`
    );
    console.log(`\t↳ Matched query: "${this.matchedQuery}"`);
    if (this.originalTitle != this.matchedQuery) {
      console.log(`\t↳ Original query: "${this.originalTitle}"`);
    }
  }
}
