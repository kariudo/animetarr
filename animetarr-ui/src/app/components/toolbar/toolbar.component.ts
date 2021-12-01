import {
  Component,
  Output,
  AfterContentInit,
  EventEmitter,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AnimetarrService } from 'src/app/services/animetarr.service';
import { SelectedSeason } from '../../models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements AfterContentInit {
  selectedYear: number = this.getCurrentYear();
  selectedSeason: string = this.getCurrentSeason();
  yearsToDisplay: number[] = this.getDisplayYears();
  version = 'Loading...';

  @Output() onSeasonSelected = new EventEmitter<SelectedSeason>();

  constructor(
    iconReg: MatIconRegistry,
    sanitizer: DomSanitizer,
    private animetarr: AnimetarrService
  ) {
    iconReg.addSvgIcon(
      'github-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/icons/github.svg')
    );
    animetarr.GetVersion().subscribe((version: string) => {
      this.version = `v${version}`;
    });
  }

  private getCurrentYear(): number {
    const year = new Date().getFullYear();
    return this.getCurrentSeason() == 'winter' ? year + 1 : year;
  }

  ngAfterContentInit(): void {
    this.EmitSeasonSelected();
  }

  EmitSeasonSelected(): void {
    this.onSeasonSelected.emit({
      season: this.selectedSeason,
      year: this.selectedYear,
    });
  }

  showGithub(): void {
    window.open('https://github.com/kariudo/animetarr', '_blank');
  }

  buyMeACoffee(): void {
    window.open('https://www.buymeacoffee.com/kariudo', '_blank');
  }

  private getDisplayYears(): number[] {
    const startingYear = 2000;
    const yearsToDisplay = this.getCurrentYear() - startingYear + 1;
    const range = [...Array(yearsToDisplay)].map((_, i) => startingYear + i);
    return range.reverse(); // Return in reverse. Makes more sense in the UI.
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    switch (month) {
      case 11:
      case 0:
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
