import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  posts: PostModel[] = [];
  imageFile: File | null = null;
  caption: string = '';
  userProfile: UserModel | undefined;
  numberOfPosts: number = 0;
  loggedInUserId: string | null = null;
  userId: number | undefined;
  isLinkDisabled: boolean = true;
  userconnected: number = 0;
  userafficher: number = 0;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(
    private backApiService: BackApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      this.loggedInUserId = parsedUser.userId;
      this.userconnected = parsedUser.userId;
    }

    this.route.params.subscribe((params) => {
      this.userId = params['userId'];

      if (this.userId !== undefined) {
        console.log('UserID:', this.userId);
        this.userafficher = this.userId;

        this.backApiService.getPostsByUserId(this.userId).subscribe((data) => {
          this.posts = data;
          this.numberOfPosts = this.posts.length;
          console.log('Number of posts by user:', this.numberOfPosts);
          console.log('User to display:', this.userafficher);
          console.log('Logged in user:', this.userconnected);

          // Moved the equality check here
          this.checkEquality();
        });

        this.backApiService.getUserProfile(this.userId).subscribe((data) => {
          this.userProfile = data;
          console.log('Logged in user ID:', this.loggedInUserId);
        });
      }
    });

    console.log('Logged in user ID:', this.loggedInUserId);
  }

  openFileInput(event: Event) {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
    event.preventDefault();
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  createPost() {
    if (!this.caption || !this.imageFile) {
      return;
    }

    const postData = new FormData();
    postData.append('caption', this.caption);
    postData.append('mediaFile', this.imageFile);

    this.backApiService.postCreate(postData).subscribe(
      (response: any) => {
        console.log('Post created successfully:', response);
        this.caption = '';
        this.imageFile = null;
      },
      (error: any) => {
        console.error('Error creating post:', error);
      }
    );
  }

  // Function to check equality and disable the link accordingly
  checkEquality() {
    if (this.userafficher == this.userconnected) {
      this.isLinkDisabled = false;
      console.log('Result:', this.isLinkDisabled);
    }
  }
}
