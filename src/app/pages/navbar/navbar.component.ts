import { Component, OnInit } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userId!: number;
  searchInput: string = ''; // Champs pour la recherche flexible

  searchResults: any[] = [];
  constructor(private backApiService: BackApiService , private router: Router) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userId = user.userId;
    }

    this.searchUsers();

  }

  searchUsers() {
    // Effectuer la recherche uniquement si au moins un champ est renseigné
    if (this.searchInput.trim() !== '') {
      this.backApiService.searchUsers(this.searchInput).subscribe(
        (data: any[]) => {
          this.searchResults = data;
          console.log('Search results:', data); // Afficher les résultats dans la console
        },
        (error) => {
          console.error('Error while searching users:', error);
        }
      );
    } else {
      // Réinitialiser les résultats de la recherche si aucun champ n'est renseigné
      this.searchResults = [];
    }
  }

  isMenuOpen = false;
  isSettingsOpen = false;
  isLoginFormOpen = false;

  // Fonction pour fermer les paramètres
  closeSettings() {
    this.isSettingsOpen = false;
  }
  clickUserProfile(userId: number) {
    // Rediriger vers le profil de l'utilisateur
    this.router.navigate(['/profile', userId]);
  
    // Vider le champ de recherche
    this.searchInput = '';
  
    // Fermer la liste de recherche
    this.searchResults = [];
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.isMenuOpen = false;

  }
  toggleLoginForm() {
    this.isLoginFormOpen = !this.isLoginFormOpen;
    this.isSettingsOpen = false; // Fermez les paramètres lorsque le formulaire de connexion est ouvert
  }

  signOut() {
    // Supprimer les données utilisateur stockées localement
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');

    // Rediriger vers la page de connexion ou la page d'accueil
    // Remplacez 'connexion' par le chemin approprié de votre page de connexion
    window.location.href = '/connexion';
  }

}
