import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from 'src/app/services/post.service';
import { PostModel } from 'src/app/models/post';
import { CommentResponse } from 'src/app/models/comment-response';
import { throwError } from 'rxjs'; // Importez throwError depuis 'rxjs'
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() postData!: PostModel;
  likedByAuthUser: boolean = false;
  commentText: string = '';
  postId: number = 0; // Initialisez avec une valeur par défaut
  userId: number = 0; // Initialisez avec une valeur par défaut
  postComments: CommentResponse[] = [];
  allPostComments: CommentResponse[] = []; // Déclarer la nouvelle propriété allPostComments
  postLikes: UserModel[] = []; // Assurez-vous que UserModel est correctement défini
  userData: any; // Ajout de la variable userData pour vérifier si l'utilisateur est connecté

  isMenuOpen2 = false; // Ajoutez cette déclaration

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postIdParam = params.get('id');
      const userIdParam = params.get('userId');
      this.postId = postIdParam ? +postIdParam : 0;
      this.userId = userIdParam ? +userIdParam : 0;
      this.loadPostComments();
      this.loadAllPostComments();
      this.loadPostLikes();
      this.checkUserLikeStatus();
      this.checkUserLoggedIn(); // Vérifie si l'utilisateur est connecté lors du chargement initial de la page
    });
  }

  closeSettings() {
    this.isMenuOpen2 = false;
    this.isMenuOpen1 = false;
  }
  // Nouvelle méthode pour vérifier si l'utilisateur est connecté
  checkUserLoggedIn() {
    this.userData = localStorage.getItem('user');
  }

  // Méthode pour vérifier l'état du like de l'utilisateur
  checkUserLikeStatus() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.userId !== undefined && user.userId !== null) {
        const userId = user.userId;
        const likedPosts = JSON.parse(
          localStorage.getItem('likedPosts') || '[]'
        );
        this.likedByAuthUser = likedPosts.includes(this.postData.id);
      }
    }
  }

  // Méthode pour gérer les likes/unlikes
  likeOrUnlikePost() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.userId !== undefined && user.userId !== null) {
        const userId = user.userId;
        if (this.likedByAuthUser) {
          // Unlike
          this.postService.unlikePost(this.postData.id, userId).subscribe({
            next: (response: any) => {
              this.likedByAuthUser = false;
              this.postData.likeCount--;
              const likedPosts = JSON.parse(
                localStorage.getItem('likedPosts') || '[]'
              );
              const index = likedPosts.indexOf(this.postData.id);
              if (index !== -1) {
                likedPosts.splice(index, 1);
                localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
              }
            },
            error: (errorResponse: HttpErrorResponse) => {
              console.error(
                'Erreur lors du "dislike" du post :',
                errorResponse
              );
            },
          });
        } else {
          // Like
          this.postService.likePost(this.postData.id, userId).subscribe({
            next: (response: any) => {
              this.likedByAuthUser = true;
              this.postData.likeCount++;
              const likedPosts = JSON.parse(
                localStorage.getItem('likedPosts') || '[]'
              );
              likedPosts.push(this.postData.id);
              localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            },
            error: (errorResponse: HttpErrorResponse) => {
              console.error('Erreur lors du "like" du post :', errorResponse);
            },
          });
        }
      }
    }
  }

  addComment() {
    // Récupérer l'ID de l'utilisateur à partir du localStorage
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.userId !== undefined && user.userId !== null) {
        const userId = user.userId;
        // Vérifiez si le texte du commentaire n'est pas vide
        if (this.commentText.trim() !== '') {
          this.postService
            .createPostComment(this.postData.id, userId, this.commentText)
            .subscribe({
              next: (response: any) => {
                // Assurez-vous que this.postData.comments est défini
                if (!this.postData.comments) {
                  this.postData.comments = [];
                }
                // Ajoutez le commentaire à la liste des commentaires du post
                this.postData.comments.push({
                  id: response.id,
                  content: this.commentText,
                  likeCount: 0,
                  dateCreated: response.dateCreated,
                  dateLastModified: response.dateLastModified,
                  author: user,
                });
                // Réinitialisez le champ de texte du commentaire après l'ajout
                this.commentText = '';
                // Rechargez la liste de tous les commentaires après avoir ajouté un nouveau commentaire
                this.loadAllPostComments();
                this.loadPostComments();
              },
              error: (errorResponse: HttpErrorResponse) => {
                console.error(
                  "Erreur lors de l'ajout du commentaire :",
                  errorResponse
                );
              },
            });
        }
      } else {
        console.error(
          "Erreur : Impossible de récupérer l'ID utilisateur à partir de l'objet utilisateur stocké dans le localStorage."
        );
      }
    } else {
      console.error(
        "Erreur : Impossible de récupérer l'objet utilisateur depuis le localStorage."
      );
    }
  }

  loadPostComments(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.userId !== undefined && user.userId !== null) {
        const userId = user.userId;
        this.postService
          .getPostComments(this.postData.id, 1, 1, userId)
          .subscribe((response: CommentResponse[] | HttpErrorResponse) => {
            if (Array.isArray(response)) {
              this.postComments = response; // Mettre à jour les commentaires si la réponse est un tableau
            } else {
              console.error(
                'Erreur lors du chargement des commentaires :',
                response
              );
              // Traitez l'erreur ici selon votre logique
              // Par exemple, rediriger l'utilisateur vers une page d'erreur
            }
          });
      } else {
        console.error(
          "Erreur : Impossible de récupérer l'ID utilisateur à partir de l'objet utilisateur stocké dans le localStorage."
        );
      }
    } else {
      console.error(
        "Erreur : Impossible de récupérer l'objet utilisateur depuis le localStorage."
      );
    }
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isMenuOpen1 = false;

  toggleMenu1() {
    this.isMenuOpen1 = !this.isMenuOpen1;
  }

  toggleMenu2() {
    this.isMenuOpen2 = !this.isMenuOpen2;
  }

  loadPostLikes(): void {
    console.log('Tentative de chargement des likes...');
    this.postService.getPostLikes(this.postData.id, 1, 0).subscribe({
      next: (response: UserModel[] | any) => {
        if (Array.isArray(response)) {
          console.log('Likes chargés avec succès :', response);
          this.postLikes = response;
        } else {
          console.error('Erreur lors du chargement des likes :', response);
          // Traitez l'erreur ici
        }
      },
      error: (errorResponse: any) => {
        console.error('Erreur lors du chargement des likes :', errorResponse);
      },
    });
  }

  loadAllPostComments(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.userId !== undefined && user.userId !== null) {
        const userId = user.userId;
        this.postService
          .getPostComments(this.postData.id, 1, 0, userId)
          .subscribe((response: CommentResponse[] | HttpErrorResponse) => {
            if (Array.isArray(response)) {
              this.allPostComments = response; // Mettre à jour les commentaires si la réponse est un tableau
              // Rechargez la liste de tous les commentaires après avoir ajouté un nouveau commentaire
            } else {
              console.error(
                'Erreur lors du chargement des commentaires :',
                response
              );
              // Traitez l'erreur ici selon votre logique
              // Par exemple, rediriger l'utilisateur vers une page d'erreur
            }
          });
      } else {
        console.error(
          "Erreur : Impossible de récupérer l'ID utilisateur à partir de l'objet utilisateur stocké dans le localStorage."
        );
      }
    } else {
      console.error(
        "Erreur : Impossible de récupérer l'objet utilisateur depuis le localStorage."
      );
    }
  }
}
