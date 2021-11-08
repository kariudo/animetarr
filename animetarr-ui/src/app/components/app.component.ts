import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeriesData } from 'src/models/SeriesData';
import { SonarrSeries } from 'src/models/SonarrSeries';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SelectedSeason } from '../models';
import { YoutubeService } from '../services/youtube.service';
// import { mockData } from './mockData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = false;
  shows: SeriesData[] = []; // mockData;
  existingSonarrSeriesIds: number[] = [];
  mismatches: number[] = JSON.parse(localStorage.getItem('mismatches') ?? '[]');

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private youtube: YoutubeService
  ) {}

  ngOnInit(): void {
    this.getSonarrSeriesIds();
  }

  get matchedShows(): SeriesData[] {
    return this.shows.filter((s) => !this.isMismatched(s));
  }

  get mismatchedShows(): SeriesData[] {
    return this.shows.filter((s) => this.isMismatched(s));
  }

  loadSchedule(event: SelectedSeason): void {
    this.isLoading = true;
    const loadingSnackbarRef = this.snackBar.open('Loading data...', '');

    this.http
      .get(`/schedule/${event.year}/${event.season}`)
      .subscribe((data) => {
        console.log(data);
        this.shows = data as SeriesData[];
        loadingSnackbarRef.dismiss();
        this.snackBar.open('Season loaded.', 'Dismiss', { duration: 3000 });
        this.isLoading = false;
      });
  }

  showCompleteDescription(show: SeriesData): void {
    window.alert(show.description);
  }

  /**
   * Pop a window with youtube results for a preview of the series.
   *
   * @param show Series to search for.
   */
  showVideo(show: SeriesData): void {
    window.open(this.youtube.GetPreviewSearchLink(show), '_blank');
  }

  alreadyExists(show: SeriesData): boolean {
    return this.existingSonarrSeriesIds.some((s) => s === show.tvdbId);
  }

  isMismatched(show: SeriesData): boolean {
    return this.mismatches.some((s) => s === show.tvdbId);
  }

  addToSonarr(show: SeriesData): void {
    show._isLoading = true;
    this.snackBar.open(`Adding "${show.title}" to Sonarr...`, '', {
      duration: 2000,
    });
    this.http
      .post<SonarrSeries>(`/series`, { tvdbId: show.tvdbId })
      .subscribe((data) => {
        console.debug('Added', data);
        this.snackBar.open(`Added "${show.title}" to Sonarr.`, '', {
          duration: 3000,
        });
        this.existingSonarrSeriesIds.push(show.tvdbId);
        show._isLoading = false;
      });
  }

  getSonarrSeriesIds(): void {
    this.http.get<number[]>(`/series/ids`).subscribe((seriesIds) => {
      this.existingSonarrSeriesIds = seriesIds;
    });
  }

  markMismatch(show: SeriesData): void {
    this.mismatches.push(show.tvdbId);
    localStorage.setItem('mismatches', JSON.stringify(this.mismatches));
    this.snackBar.open('Marked as mismatch.', '', { duration: 3000 });
  }
}
