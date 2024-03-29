import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimetarrService } from 'src/app/services/animetarr.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { SeriesData } from 'src/models/SeriesData';

@Component({
  selector: 'app-series-card',
  templateUrl: './series-card.component.html',
  styleUrls: ['./series-card.component.scss'],
})
export class SeriesCardComponent {
  @Input()
  series!: SeriesData;

  @Input()
  existingSonarrSeriesIds!: number[];

  @Input()
  mismatches!: string[];

  @Input()
  isMismatched = false;

  constructor(
    private youtube: YoutubeService,
    private animetarr: AnimetarrService,
    private snackBar: MatSnackBar
  ) {}

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

  showCompleteDescription(show: SeriesData): void {
    window.alert(show.description);
  }

  /**
   * Add series to Sonarr.
   *
   * @param show Series to add.
   */
  addToSonarr(show: SeriesData): void {
    show._isLoading = true;
    console.debug('Adding', show);
    this.snackBar.open(`Adding "${show.title}" to Sonarr...`, '', {
      duration: 2000,
    });
    this.animetarr.AddByTvDbId(show.tvdbId).subscribe((sonarrSeries) => {
      console.debug('Added', sonarrSeries);
      this.snackBar.open(`Added "${show.title}" to Sonarr.`, '', {
        duration: 3000,
      });
      this.existingSonarrSeriesIds.push(show.tvdbId);
      show._isLoading = false;
    });
  }

  markMismatch(show: SeriesData): void {
    this.mismatches.push(show.originalTitle);
    localStorage.setItem('mismatches', JSON.stringify(this.mismatches));
    this.snackBar.open('Marked as mismatch.', '', { duration: 3000 });
  }

  clearMismatch(show: SeriesData): void {
    const mismatch = this.mismatches.indexOf(show.originalTitle);
    if (mismatch < 0) {
      this.snackBar.open('Mismatch was not found by title.', '', {
        duration: 3000,
      });
    }
    this.mismatches.splice(mismatch, 1);
    localStorage.setItem('mismatches', JSON.stringify(this.mismatches));
    this.snackBar.open('Marked as matched.', '', { duration: 3000 });
  }
}
