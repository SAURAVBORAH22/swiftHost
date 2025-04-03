import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {

    const params = new URLSearchParams(window.location.search);
    const sessionData = params.get("session");

    if (sessionData) {
      console.log("Extracted session data:", sessionData);
      try {
        const decodedData = JSON.parse(atob(sessionData));
        sessionStorage.setItem('userData', JSON.stringify(decodedData));

        // Remove session from URL and reload home
        this.router.navigate(['/home'], { replaceUrl: true });
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
  }
}
