import { Component, OnInit } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { PostModel } from 'src/app/models/post';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent implements OnInit {
  posts: PostModel[] = [];

  constructor(private backApiService: BackApiService) {}

  ngOnInit(): void {
    this.backApiService.getAllPosts().subscribe((data) => {
      this.posts = data;
    });
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
