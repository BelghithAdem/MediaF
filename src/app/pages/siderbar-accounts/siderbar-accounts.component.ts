import { Component, OnInit } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';
@Component({
  selector: 'app-siderbar-accounts',
  templateUrl: './siderbar-accounts.component.html',
  styleUrls: ['./siderbar-accounts.component.css'],
  providers: [BackApiService]
})
export class SiderbarAccountsComponent implements OnInit {
  posts: PostModel[] = [];

  constructor(private backApiService: BackApiService) {}

  ngOnInit(): void {
    this.backApiService.getAllPosts().subscribe((data) => {
      this.posts = data;
    });
  }
  
}
