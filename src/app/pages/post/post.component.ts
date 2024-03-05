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
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postData!: PostModel;
  likedByAuthUser: boolean = false;
  commentText: string = '';
  postId: number = 0; // Initialisez avec une valeur par défaut
  userId: number = 0; // Initialisez avec une valeur par défaut
  postComments: CommentResponse[] = [];
  postLikes: UserModel[] = []; // Liste des likes du post

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.likedByAuthUser = this.postData.liked;
    this.route.paramMap.subscribe(params => {
      const postIdParam = params.get('id');
      const userIdParam = params.get('userId');
      this.postId = postIdParam ? +postIdParam : 0; // Assurez-vous de vérifier si les paramètres ne sont pas nuls
      this.userId = userIdParam ? +userIdParam : 0; // Assurez-vous de vérifier si les paramètres ne sont pas nuls
      this.loadPostComments();
    });

    this.likedByAuthUser = this.postData.liked;
    this.route.paramMap.subscribe(params => {
      const postIdParam = params.get('id');
      const userIdParam = params.get('userId');
      this.postId = postIdParam ? +postIdParam : 0;
      this.userId = userIdParam ? +userIdParam : 0;
      this.loadPostComments();
      this.loadPostLikes(); // Charger les likes du post lors de l'initialisation
    });}
  likeOrUnlikePost() {
    const userString = localStorage.getItem('user');

    if (userString !== null) {
      const user = JSON.parse(userString);

      if (user.userId !== undefined && user.userId !== null) {
        const userId = user.userId;

        if (this.likedByAuthUser) {
          this.postService.unlikePost(this.postData.id, userId).subscribe({
            next: (response: any) => {
              this.likedByAuthUser = false;
              this.postData.likeCount--;
            },
            error: (errorResponse: HttpErrorResponse) => {
              console.error('Erreur lors du "dislike" du post :', errorResponse);
            }
          });
        } else {
          this.postService.likePost(this.postData.id, userId).subscribe({
            next: (response: any) => {
              this.likedByAuthUser = true;
              this.postData.likeCount++;
            },
            error: (errorResponse: HttpErrorResponse) => {
              console.error('Erreur lors du "like" du post :', errorResponse);
            }
          });
        }
      } else {
        console.error('Erreur : Impossible de récupérer l\'ID utilisateur à partir de l\'objet utilisateur stocké dans le localStorage.');
      }
    } else {
      console.error('Erreur : Impossible de récupérer l\'objet utilisateur depuis le localStorage.');
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
          this.postService.createPostComment(this.postData.id, userId, this.commentText).subscribe({
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
                author: user
              });
              // Réinitialisez le champ de texte du commentaire après l'ajout
              this.commentText = '';
            },
            error: (errorResponse: HttpErrorResponse) => {
              console.error('Erreur lors de l\'ajout du commentaire :', errorResponse);
            }
          });
        }
      } else {
        console.error('Erreur : Impossible de récupérer l\'ID utilisateur à partir de l\'objet utilisateur stocké dans le localStorage.');
      }
    } else {
      console.error('Erreur : Impossible de récupérer l\'objet utilisateur depuis le localStorage.');
    }
}
loadPostComments(): void {

  const userString = localStorage.getItem('user');
  if (userString !== null) {
    const user = JSON.parse(userString);
    if (user.userId !== undefined && user.userId !== null) {
      const userId = user.userId;
  this.postService.getPostComments(this.postData.id, 1, 1, userId)
    .subscribe((response: CommentResponse[] | HttpErrorResponse) => {
      if (Array.isArray(response)) {
        this.postComments = response; // Mettre à jour les commentaires si la réponse est un tableau
      } else {
        console.error('Erreur lors du chargement des commentaires :', response);
        // Traitez l'erreur ici selon votre logique
        // Par exemple, rediriger l'utilisateur vers une page d'erreur
      }
    });
}


  }}
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isMenuOpen1 = false;

  toggleMenu1() {
    this.isMenuOpen1 = !this.isMenuOpen1;
  }
  isMenuOpen2 = false;

  toggleMenu2() {
    this.isMenuOpen2 = !this.isMenuOpen2;
  }


  loadPostLikes(): void {
    this.postService.getPostLikes(this.postData.id, 1, 10).subscribe({
      next: (response: UserModel[] | HttpErrorResponse) => {
        if (Array.isArray(response)) {
          this.postLikes = response; // Mettre à jour la liste des likes
        } else {
          console.error('Erreur lors du chargement des likes du post :', response);
          // Traitez l'erreur ici
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des likes du post :', errorResponse);
      }
    });
  }

}