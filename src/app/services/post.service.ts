import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { CommentResponse } from '../models/comment-response';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly host = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): { headers: HttpHeaders } {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    return { headers };
  }

  likePost(postId: number, userId: number): Observable<any> {
    const headers = this.getHeaders().headers;
    const params = new HttpParams().set('userId', userId.toString());
    return this.httpClient.post<any>(`${this.host}/api/posts/posts/${postId}/like`, null, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  unlikePost(postId: number, userId: number): Observable<any> {
    const headers = this.getHeaders().headers;
    const params = new HttpParams().set('userId', userId.toString());
    return this.httpClient.post<any>(`${this.host}/api/posts/posts/${postId}/unlike`, null, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  createPostComment(postId: number, userId: number, content: string): Observable<CommentResponse | HttpErrorResponse> {
    const headers = this.getHeaders().headers;
    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', userId.toString()); // Ajoutez l'ID de l'utilisateur
    return this.httpClient.post<CommentResponse | HttpErrorResponse>(
      `${this.host}/api/posts/${postId}/comments/create`,
      formData,
      { headers }
    ).pipe(catchError(this.handleError));
  }

  getPostComments(postId: number, page: number, size: number, userId: number): Observable<CommentResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('userId', String(userId)); // Ajoutez userId comme paramètre
    const headers = this.getHeaders().headers;

    return this.httpClient.get<CommentResponse[]>(`${this.host}/api/posts/posts/${postId}/comments`, { params: reqParams, headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return []; // Retourne un tableau vide en cas de 404
          } else {
            return throwError(error); // Renvoie l'erreur pour être traitée par l'appelant
          }
        })
      );
  }

  
  getPostLikes(postId: number, page: number, size: number): Observable<UserModel[] | HttpErrorResponse> {
    console.log('Attempting to load post likes...');

    const headers = this.getHeaders().headers;
    const reqParams = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.httpClient.get<UserModel[] | HttpErrorResponse>(`${this.host}/api/posts/${postId}/likes`, { params: reqParams, headers });
  }

  deletePost(postId: number, isTypeShare: boolean): Observable<any | HttpErrorResponse> {
    const headers = this.getHeaders().headers;

			return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/${postId}/delete`, {headers});
		}
	
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
