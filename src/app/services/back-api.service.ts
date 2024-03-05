// back-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { activation } from '../models/activation.model';
import { environment } from 'src/environments/environment';
import { PostModel } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class BackApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Private method to get HTTP headers with authorization token
  private getHeaders(): { headers: HttpHeaders } {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return { headers };
  }

  // API endpoint for user registration
  inscription(utilisateur: any): Observable<any> {
    const url = `${this.apiUrl}/inscription`;
    return this.http.post(url, utilisateur);
  }

  // API endpoint for activation verification
  verification(activation: activation): Observable<any> {
    const url = `${this.apiUrl}/activation`;
    return this.http.post(url, activation);
  }

  // API endpoint for user login
  login(loginData: any): Observable<any> {
    const url = `${this.apiUrl}/connexion`; // Update with your login API endpoint
    return this.http.post(url, loginData);
  }

  // API endpoint to get all posts with authentication headers
  getAllPosts(): Observable<PostModel[]> {
    const url = `${this.apiUrl}/api/posts/all`;
    return this.http.get<PostModel[]>(url, this.getHeaders());
  }

  // Méthode pour créer un post pour un utilisateur donné
  postCreate(postData: FormData): Observable<PostModel[]> {
    const userId = JSON.parse(localStorage.getItem('user') || '').userId;
    const url = `${this.apiUrl}/api/posts/user/${userId}`;
    return this.http.post<PostModel[]>(url, postData, this.getHeaders());
  }
  


  // Additional methods can be added here...

}
