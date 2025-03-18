import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
