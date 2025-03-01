import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private config: NgbDropdownConfig,
    private authService: AuthService
  ) {
    this.config.autoClose = 'outside'; // Dropdown will close when clicking outside
  }

  onLogout() {
    this.authService.logoutUserFromSession();
  }

}
