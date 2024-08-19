import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css'],
  providers: [BackApiService],
})
export class PostFeedComponent implements OnInit {
  posts: PostModel[] = [];
  imageFile: File | null = null;
  caption: string = '';

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(private backApiService: BackApiService) {}

  ngOnInit(): void {
    this.loadPosts(); // Chargez les posts initialement
  }
  loadPosts() {
    this.backApiService.getAllPosts().subscribe((data) => {
      // Tri des posts par date de création (ordre décroissant)
      this.posts = data;
    });
  }
  openFileInput(event: Event) {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
    event.preventDefault(); // Empêche le comportement par défaut du lien
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  createPost() {
    if (!this.caption || !this.imageFile) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erreur lors de la création du post',
        text: "Une erreur s'est produite.",
        showConfirmButton: true,
        customClass: {
          popup: 'my-popup-class', // Classe CSS personnalisée pour ajuster la taille de l'alerte
        },
      });
      return;
    }

    const postData = new FormData();
    postData.append('caption', this.caption);
    postData.append('mediaFile', this.imageFile);

    // Utilisez postData ici pour envoyer les données du post au service
    this.backApiService.postCreate(postData).subscribe(
      (response: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post créé avec succès',
          showConfirmButton: false,
          timer: 1500,
        });
        console.log('Post created successfully:', response);
        // Réinitialiser les champs après la création réussie du post
        this.caption = ''; // Réinitialiser le champ de texte
        this.imageFile = null; // Réinitialiser le champ de fichier

        // Handle success, maybe redirect or show a success message
        // Rechargez les posts après avoir ajouté un nouveau post
        this.loadPosts();
      },
      (error: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erreur lors de la création du post',
          text: error.message || "Une erreur s'est produite.",
          showConfirmButton: true,
          customClass: {
            popup: 'my-popup-class', // Classe CSS personnalisée pour ajuster la taille de l'alerte
          },
        });
        console.error('Error creating post:', error);
        // Handle errors, show an error message to the user
      }
    );
  }
}
