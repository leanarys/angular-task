import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'boldAsterisk',
  standalone: true, // This allows direct import in standalone components
})
export class BoldAsteriskPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return value;
    const boldedText = value.replace(/\*(.*?)\*/g, '<b>$1</b>'); // Convert *text* to <b>text</b>
    return this.sanitizer.bypassSecurityTrustHtml(boldedText); // Allow HTML rendering
  }
}
