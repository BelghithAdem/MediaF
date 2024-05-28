import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-sidebarleft',
  templateUrl: './sidebarleft.component.html',
  styleUrls: ['./sidebarleft.component.css']
})
export class SidebarleftComponent implements OnInit {
  isMenuOpen = false;
  userProfile!: UserModel; // Assuming UserModel is the model for user profile
  isSettingsOpen = false;


  constructor(
    private backApiService: BackApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      console.log('UserID:', parsedUser.userId);

      this.getUserProfile(parsedUser.userId); // Call getUserProfile function with userId

    }

   
  }
  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;

}
  // Fonction pour fermer les paramètres
  closeSettings() {
    this.isSettingsOpen = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getUserProfile(userId: number) {
    this.backApiService.getUserProfile(userId).subscribe((userProfile: UserModel) => {
      this.userProfile = userProfile;
      // Ajoutez ici votre code qui dépend de this.userProfile
    }, error => {
      console.error('Erreur lors de la récupération du profil utilisateur :', error);
      // Gérer l'erreur de manière appropriée, par exemple, afficher un message à l'utilisateur
    });
  }
}
