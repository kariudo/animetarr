import { AfterContentInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeriesData } from 'src/models/SeriesData';
import { SonarrSeries } from 'src/models/SonarrSeries';
import { mockData } from './mockData';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterContentInit {
  selectedYear: number = new Date().getFullYear();
  selectedSeason: string = this.getCurrentSeason();
  isLoading = false;
  shows: SeriesData[] = []; // mockData;
  existingSonarrSeriesIds: number[] = [];
  mismatches: number[] = JSON.parse(localStorage.getItem('mismatches') ?? '[]');

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getSonarrSeriesIds();
  }

  ngAfterContentInit(): void {
    this.loadSchedule();
  }

  get matchedShows(): SeriesData[] {
    return this.shows.filter((s) => !this.isMismatched(s));
  }

  get mismatchedShows(): SeriesData[] {
    return this.shows.filter((s) => this.isMismatched(s));
  }

  loadSchedule(): void {
    this.isLoading = true;
    const loadingSnackbarRef = this.snackBar.open('Loading data...', '');

    this.http
      .get(`/schedule/${this.selectedYear}/${this.selectedSeason}`)
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

  showVideo(show: SeriesData): void {
    window.open(
      `https://www.youtube.com/results?search_query=${show.title
        .split(' ')
        .join('+')}+pv`,
      '_blank'
    );
  }

  alreadyExists(show: SeriesData): boolean {
    return this.existingSonarrSeriesIds.some((s) => s === show.tvdbId);
  }

  isMismatched(show: SeriesData): boolean {
    return this.mismatches.some((s) => s === show.tvdbId);
  }

  addToSonarr(show: SeriesData): void {
    this.http
      .post<SonarrSeries>(`/series`, { tvdbId: show.tvdbId })
      .subscribe((data) => {
        console.debug('Added', data);
        this.snackBar.open(`Added "${show.title}" to Sonarr.`, '', {
          duration: 3000,
        });
        this.existingSonarrSeriesIds.push(show.tvdbId);
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

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    switch (month) {
      case 11:
      case 12:
      case 1:
        return 'winter';
      case 2:
      case 3:
      case 4:
        return 'spring';
      case 5:
      case 6:
      case 7:
        return 'summer';
      default:
        return 'fall';
    }
  }
}
