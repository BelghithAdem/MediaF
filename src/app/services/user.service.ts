import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = 'http://localhost:8081/user';

  constructor(private http: HttpClient) {}

  // Retrieve a list of all users except the currently logged-in user
  getAllUsersExceptCurrentUser(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      this.baseUrl.concat('/except/' + this.currentUser().userId)
    );
  }

  // Retrieve the conversation ID between two users
  getConversationIdByUser1IdAndUser2Id(
    user1Id: number,
    user2Id: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl.concat('/conversation/id'), {
      params: { user1Id: user1Id, user2Id: user2Id },
    });
  }

  // Retrieve the currently logged-in user from local storage
  currentUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
