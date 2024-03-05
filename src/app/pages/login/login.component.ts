import { Component, OnInit } from '@angular/core';
import { BackApiService } from 'src/app/services/back-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode, InvalidTokenError } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    private backApiService: BackApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  get f() {
    return this.form.controls;
  }

  login() {
    if (this.form.invalid) {
      // Form is invalid, stop processing
      return;
    }

    // Destructure the form values directly
    const { username, password } = this.form.value;

    // Make the login API call
    this.backApiService.login({ username, password }).subscribe(
      (response: any) => {
        // Assuming the token is in the response body as 'accessToken'
        const authToken = response?.bearer;

        if (authToken) {
          // Decode the JWT token to get user information
          const decodedToken = this.decodeJwt(authToken);

          // Handle successful login (e.g., store token and user info in local storage)
          console.log('Login successful. Token:', authToken);
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('user', JSON.stringify(decodedToken));
          this.router.navigate(['/accueil']);

          // Redirect or perform any additional actions as needed
        } else {
          // Handle the case where the token is not present in the response body
          console.error('Login error: Token not found in the response body.');
        }

        const userString = localStorage.getItem('user');

if (userString) {
  const user = JSON.parse(userString);

  // Vérifier si l'utilisateur et son ID existent
  if (user && user.userId) {
    // Afficher l'ID de l'utilisateur dans la console
    console.log('User ID:', user.userId);
  } else {
    console.error('User ID not found in localStorage.');
  }
} else {
  console.error('User data not found in localStorage.');
}
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          footer: '<p>Essaie une autre fois</p>',
        });
        // Handle login error
        console.error('Login error:', error);
        // Display error message to the user or perform other actions
      }
    );
  }

  // Decode JWT token using jwt-decode library
  private decodeJwt(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
}
