import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebarleft',
  templateUrl: './sidebarleft.component.html',
  styleUrls: ['./sidebarleft.component.css']
})
export class SidebarleftComponent implements OnInit {
 

  constructor() { }

  ngOnInit(): void {
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
