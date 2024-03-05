import { Component, OnInit } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent   implements OnInit {
  posts: PostModel[] = [];

  constructor(private backApiService: BackApiService) {}

  ngOnInit(): void {
    this.backApiService.getAllPosts().subscribe((data) => {
      this.posts = data;
    });
  }
  
}
