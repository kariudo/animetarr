import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectedSeason } from 'src/app/models';
import { AnimetarrService } from 'src/app/services/animetarr.service';
import { SeriesData } from 'src/models/SeriesData';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  shows: SeriesData[] = []; // mockData;
  existingSonarrSeriesIds: number[] = [];
  mismatches: string[] = JSON.parse(localStorage.getItem('mismatches') ?? '[]');

  constructor(
    private snackBar: MatSnackBar,
    private animetarr: AnimetarrService
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

  loadSchedule(season: SelectedSeason): void {
    this.isLoading = true;
    const loadingSnackbarRef = this.snackBar.open('Loading data...', '');

    this.animetarr.GetSchedule(season).subscribe((seriesData) => {
      console.debug(seriesData);
      this.shows = seriesData;
      loadingSnackbarRef.dismiss();
      this.snackBar.open('Season loaded.', 'Dismiss', { duration: 3000 });
      this.isLoading = false;
    });
  }

  isMismatched(show: SeriesData): boolean {
    return this.mismatches.some((s) => s === show.originalTitle);
  }

  getSonarrSeriesIds(): void {
    this.animetarr.GetSonarrSeriesIds().subscribe((seriesIds) => {
      this.existingSonarrSeriesIds = seriesIds;
    });
  }
}
