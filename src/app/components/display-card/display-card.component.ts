import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-card.component.html',
  styleUrl: './display-card.component.css',
})
export class DisplayCardComponent {
  @Input() smallHeader: string = '';
  @Input() mainHeader: string = '';
  @Input() footer: string = '';
  @Input() dataArray: any[] = [];
  @Input() directory?: string = '';

  constructor(
    private router: Router,
  ) {}

  navigateTo(directory: string) {
    if(directory){
      this.router.navigate([`${directory}`]);
    }
  }
}
