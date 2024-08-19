import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { BackApiService } from 'src/app/services/back-api.service';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.css'],
})
export class SidebarRightComponent implements OnInit {
  users: any[] = [];
  followedUserIds = new Set<number>(); // Utiliser un ensemble pour stocker les identifiants des utilisateurs suivis
  loggedInUserId: number | null = null;

  constructor(
    private userService: UserService,
    private backApiService: BackApiService
  ) {}

  ngOnInit(): void {
    this.getAllUsersExceptCurrentUser().subscribe((response) => {
      if (response.status === 'Success') {
        this.users = response.data;
      }
    });

    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserId = parsedUser.userId;

      // Obtenez les utilisateurs suivis
      this.backApiService.getUserFollowingUsers(parsedUser.userId).subscribe(
        (data) => {
          console.log('Utilisateurs suivis :', data);
          // Ajouter les identifiants des utilisateurs suivis à l'ensemble
          data.forEach((user: any) => this.followedUserIds.add(user.id));
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des utilisateurs suivis :',
            error
          );
        }
      );
    }
  }

  getAllUsersExceptCurrentUser(): Observable<any> {
    return this.userService.getAllUsersExceptCurrentUser();
  }

  toggleFollow(userId: number): void {
    if (!this.loggedInUserId) return; // Vérifier si l'utilisateur est connecté

    if (this.followedUserIds.has(userId)) {
      // Si l'utilisateur est déjà suivi, le désabonner
      this.backApiService.unfollowUser(userId).subscribe(
        () => {
          this.followedUserIds.delete(userId); // Retirer l'utilisateur de l'ensemble
        },
        (error) => {
          console.error(
            "Erreur lors de la désinscription de l'utilisateur :",
            error
          );
        }
      );
    } else {
      // Si l'utilisateur n'est pas suivi, le suivre
      this.backApiService.followUser(userId).subscribe(
        () => {
          this.followedUserIds.add(userId); // Ajouter l'utilisateur à l'ensemble
        },
        (error) => {
          console.error(
            "Erreur lors de la souscription à l'utilisateur :",
            error
          );
        }
      );
    }
  }
}
