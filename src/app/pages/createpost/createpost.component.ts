import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {
  postForm!: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient // Make sure you've injected HttpClient in the constructor
  ) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      media: [null, Validators.required],
      description: ['', Validators.required]
    });
  }

  get f() { return this.postForm.controls; }

  createPost() {
    console.log(this.postForm.value);
    this.submitted = true;

    // Assuming you have a PostApiService with a method named 'createPost'
    this.Post(this.postForm.value).subscribe(
      (response: any) => {
        console.log('Post created successfully:', response);
        // Handle success, maybe redirect or show a success message
      },
      (error: any) => {
        console.error('Error creating post:', error);
        // Handle errors, show an error message to the user
      }
    );
  }

  Post(post: any): Observable<any> {
    const apiUrl = 'your_api_url'; // Replace with your actual API URL
    const url = `${apiUrl}/post`;
    return this.http.post(url, post);
  }
}
