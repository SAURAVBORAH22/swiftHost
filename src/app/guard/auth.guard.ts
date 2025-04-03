import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      return true;
    }
    window.location.href = `${environment.authAppUrl}`;
    return false;
  }
}