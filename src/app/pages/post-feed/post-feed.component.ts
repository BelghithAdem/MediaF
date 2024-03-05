import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css'],
  providers: [BackApiService]
})
export class PostFeedComponent implements OnInit {
  posts: PostModel[] = [];
  imageFile: File | null = null;
  caption: string = '';

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(private backApiService: BackApiService) {}

  ngOnInit(): void {
    this.backApiService.getAllPosts().subscribe((data) => {
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
      // Handle validation error, show a message to the user
      return;
    }
  
    const postData = new FormData();
    postData.append('caption', this.caption);
    postData.append('mediaFile', this.imageFile);
  
    this.backApiService.postCreate(postData).subscribe(
      (response: any) => {
        console.log('Post created successfully:', response);
        // Réinitialiser les champs après la création réussie du post
        this.caption = ''; // Réinitialiser le champ de texte
        this.imageFile = null; // Réinitialiser le champ de fichier
  
        // Handle success, maybe redirect or show a success message
      },
      (error: any) => {
        console.error('Error creating post:', error);
        // Handle errors, show an error message to the user
      }
    );
  }
}
