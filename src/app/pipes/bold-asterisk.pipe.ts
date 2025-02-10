import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: "boldAsterisk",
  standalone: true, // Allows direct import in standalone components
})
export class BoldAsteriskPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value?.trim()) return value ?? ""; // Ensure a safe return value

    // Convert *text* to <b>text</b>, handling cases where * is not properly enclosed
    const boldedText = value.replace(/\*(\S(.*?)?\S)\*/g, "<b>$1</b>");

    return this.sanitizer.bypassSecurityTrustHtml(boldedText); // Allow safe HTML rendering
  }
}
