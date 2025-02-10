import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-display-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./display-card.component.html",
  styleUrl: "./display-card.component.css",
})
export class DisplayCardComponent {
  @Input() smallHeader: string = "";
  @Input() mainHeader: string = "";
  @Input() footer: string = "";
  @Input() directory: string = "";

  constructor(private router: Router) {}

  navigateTo(directory: string): void {
    if (directory?.trim()) {
      this.router.navigateByUrl(
        directory.startsWith("/") ? directory : `/${directory}`
      );
    }
  }
}
