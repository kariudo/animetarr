import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit = 25,
    completeWords = false,
    ellipsis = '...'
  ): string {
    const shouldTruncate = value.length > limit;
    if (shouldTruncate && completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return shouldTruncate ? value.substr(0, limit) + ellipsis : value;
  }
}
