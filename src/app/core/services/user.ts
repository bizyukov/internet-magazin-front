import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = 'http://localhost:3000/user';
  private profileSubject = new BehaviorSubject<any>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any) {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}
