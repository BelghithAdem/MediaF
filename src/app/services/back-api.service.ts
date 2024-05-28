import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostModel } from '../models/post';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BackApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Méthode privée pour obtenir les en-têtes HTTP avec le jeton d'authentification
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        headers = headers.set('Authorization', `Bearer ${authToken}`);
      } else {
        // Gérer le cas où le jeton d'authentification n'est pas disponible dans le localStorage
        console.error('Le jeton d\'authentification est introuvable dans le localStorage.');
      }
    } catch (error) {
      // Gérer les erreurs lors de la récupération du jeton d'authentification
      console.error('Une erreur s\'est produite lors de la récupération du jeton d\'authentification :', error);
    }
    return headers;
  }

  // Point de terminaison de l'API pour l'inscription de l'utilisateur
  inscription(utilisateur: any): Observable<any> {
    const url = `${this.apiUrl}/inscription`;
    return this.http.post(url, utilisateur);
  }

  // Point de terminaison de l'API pour la vérification de l'activation
  verification(activation: any): Observable<any> {
    const url = `${this.apiUrl}/activation`;
    return this.http.post(url, activation);
  }

  // Point de terminaison de l'API pour la connexion de l'utilisateur
  login(loginData: any): Observable<any> {
    const url = `${this.apiUrl}/connexion`; // Mettez à jour avec votre point de terminaison API de connexion
    return this.http.post(url, loginData);
  }

  // Point de terminaison de l'API pour obtenir tous les posts avec les en-têtes d'authentification
  getAllPosts(): Observable<PostModel[]> {
    const url = `${this.apiUrl}/api/posts/all`;
    return this.http.get<PostModel[]>(url, { headers: this.getHeaders() });
  }

  // Méthode pour créer un post pour un utilisateur donné
  postCreate(postData: FormData): Observable<PostModel[]> {
    const userId = JSON.parse(localStorage.getItem('user') || '').userId;
    const url = `${this.apiUrl}/api/posts/user/${userId}`;
    return this.http.post<PostModel[]>(url, postData, { headers: this.getHeaders() });
  }

  // Méthodes pour obtenir les utilisateurs suivis et les utilisateurs qui suivent
  getUserFollowingUsers(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/following`, { headers: this.getHeaders() });
  }
  
  getUserFollowerUsers(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/followers`, { headers: this.getHeaders() });
  }

  // Méthodes pour suivre et ne plus suivre un utilisateur
  followUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/account/follow/${userId}`;
    return this.http.post(url, null, { headers: this.getHeaders() });
  }


  
  unfollowUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/account/unfollow/${userId}`;
    return this.http.post(url, null, { headers: this.getHeaders() });
  }
  
  // Méthode pour mettre à jour les informations de l'utilisateur
  updateUserInfo(userId: number, userInfo: any): Observable<any> {
    const url = `${this.apiUrl}/account/update/info?userId=${userId}`; // Utilisez le userId fourni
    return this.http.post<any>(url, userInfo, { headers: this.getHeaders() });
  }

  // D'autres méthodes peuvent être ajoutées ici...
 // Méthode pour ajouter la photo de profil pour un utilisateur donné
 addProfilePhoto(userId: number, photo: File): Observable<any> {
  const url = `${this.apiUrl}/utilisateurs/${userId}/photo`;
  
  // Create FormData and append the photo
  const formData: FormData = new FormData();
  formData.append('photo', photo);

  // Send POST request with formData
  return this.http.post(url, formData, { headers: this.getHeaders() });
}
getPostsByUserId(userId: number): Observable<PostModel[]> {
  const url = `${this.apiUrl}/api/posts/user/${userId}/posts`; // Utilisation de ${this.baseUrl} au lieu de $${this.apiUrl}
  return this.http.get<PostModel[]>(url, { headers: this.getHeaders() });
}

getUserProfile(userId: number): Observable<UserModel> {
  const url = `${this.apiUrl}/users/${userId}`; // Construire l'URL pour récupérer les informations du profil de l'utilisateur
  return this.http.get<UserModel>(url, { headers: this.getHeaders()});
}


searchUsers(query: string): Observable<any[]> {
  const url = `${this.apiUrl}/users`; // Utiliser l'URL de base de l'API
  const params = { query: query }; // Créer un objet avec les paramètres de recherche
  return this.http.get<any[]>(url, { params: params, headers: this.getHeaders() });
}
verifyCode(verificationRequest: any): Observable<any> {
  const url = `${this.apiUrl}/verify`; // URL pour la vérification du code
  return this.http.post<any>(url, verificationRequest);
}
}
