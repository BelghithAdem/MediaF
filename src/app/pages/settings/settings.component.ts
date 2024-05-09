import { Component } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Add this import


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  image: any ; // Déclarez this.image comme de type File | string
  user: any;
  userInfoForm!: FormGroup;



  constructor(
    private backApiService: BackApiService,
    private fb: FormBuilder
  ) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
  
      this.userInfoForm = this.fb.group({
        firstName: [this.user.firstName || ''],
        lastName: [this.user.lastName || ''],
        currentCity: [this.user.city || ''],
        birthDate: [this.user.birth || ''],
        gender: [this.user.gender || '']
      });
    } else {
      // Gérer le cas où les informations de l'utilisateur ne sont pas disponibles dans le localStorage
    }
  }
 
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = file; // Stocker l'objet File

    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const userId = this.user.userId;
    const userInfo = {
      "nom": this.userInfoForm.get('lastName')?.value || '',
      "gender": this.userInfoForm.get('gender')?.value || '',
      "currentCity": this.userInfoForm.get('currentCity')?.value || '',
      "birthDate": this.userInfoForm.get('birthDate')?.value || '',
      "prenom": this.userInfoForm.get('firstName')?.value || ''
    };
  
    console.log('JSON envoyé :', userInfo);
  
    try {
      this.backApiService.updateUserInfo(userId, userInfo).pipe(
        tap((response) => {
          // Gérer la réponse de la mise à jour si nécessaire
        }),
        catchError((error) => {
          // Gérer les erreurs si nécessaire
          console.error('Erreur lors de la mise à jour des informations utilisateur :', error);
          // Retourner un observable vide pour continuer le flux
          return of(null);
        })
      ).subscribe();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations utilisateur :', error);
    }
  }
  onSubmit1() {
    const userId = this.user.userId;
    const photo = this.image as File;
  
    this.backApiService.addProfilePhoto(userId, photo).pipe(
      tap((response) => {
        // Handle update response if necessary
        console.log('Profile photo update response:', response);
      }),
      catchError((error) => {
        // Handle errors if necessary
        console.error('Error updating user profile photo:', error);
        // Return an empty observable to continue the flow
        return of(null);
      })
    ).subscribe();
  }
}
