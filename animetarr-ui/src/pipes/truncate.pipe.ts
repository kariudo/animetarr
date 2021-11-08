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
    let absoluteLimit = Math.abs(limit);

    if (shouldTruncate && completeWords) {
      absoluteLimit = value.substr(0, absoluteLimit).lastIndexOf(' ');
    }

    return shouldTruncate
      ? limit > 0
        ? value.substr(0, absoluteLimit) + ellipsis
        : ellipsis + value.substr(absoluteLimit + 1) // Negative limit, we want the part that is "normally" truncated instead.
      : value; // No need to truncate, return original string.
  }
}
