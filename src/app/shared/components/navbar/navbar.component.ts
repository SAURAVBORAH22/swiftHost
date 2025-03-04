import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private config: NgbDropdownConfig,
    private authService: AuthService,
    private translationService: TranslationService
  ) {
    this.config.autoClose = 'outside'; // Dropdown will close when clicking outside
  }

  changeLanguage(language: string) {
    this.translationService.changeLanguage(language);
    window.location.reload();
  }

  onLogout() {
    this.authService.logoutUserFromSession();
  }

}
