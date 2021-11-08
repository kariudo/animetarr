import { Injectable } from '@angular/core';
import { SeriesData } from 'src/models/SeriesData';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  GetPreviewSearchLink(show: SeriesData): string {
    return `https://www.youtube.com/results?search_query=${show.title
      .split(' ')
      .join('+')}+pv`;
  }
}
