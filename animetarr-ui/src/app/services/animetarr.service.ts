import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeriesData } from 'src/models/SeriesData';
import { SonarrSeries } from 'src/models/SonarrSeries';
import { SelectedSeason } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AnimetarrService {
  constructor(private http: HttpClient) {}

  GetVersion(): Observable<string> {
    return this.http.get<string>('/version');
  }

  GetSchedule(season: SelectedSeason): Observable<SeriesData[]> {
    return this.http.get<SeriesData[]>(
      `/schedule/${season.year}/${season.season}`
    );
  }

  GetSonarrSeriesIds(): Observable<number[]> {
    return this.http.get<number[]>(`/series/ids`);
  }

  AddByTvDbId(tvdbId: number): Observable<SonarrSeries> {
    return this.http.post<SonarrSeries>(`/series`, { tvdbId: tvdbId });
  }
}
