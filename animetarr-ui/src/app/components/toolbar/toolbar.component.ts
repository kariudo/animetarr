import {
  Component,
  Output,
  AfterContentInit,
  EventEmitter,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectedSeason } from '../../models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements AfterContentInit {
  selectedYear: number = new Date().getFullYear();
  selectedSeason: string = this.getCurrentSeason();

  @Output() onSeasonSelected = new EventEmitter<SelectedSeason>();

  constructor(iconReg: MatIconRegistry, sanitizer: DomSanitizer) {
    iconReg.addSvgIcon(
      'github-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/icons/github.svg')
    );
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
