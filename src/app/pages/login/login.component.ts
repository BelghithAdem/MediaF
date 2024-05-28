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
  verificationForm: FormGroup; // Initialisation de verificationForm

  passwordVisible: boolean = false;
  showPassword: boolean = false;
  inputError: boolean = false;
  verificationCodeEntered: boolean = false;
  email: string = ''; // Stocker l'email du formulaire de connexion initial

  constructor(
    private backApiService: BackApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Initialisation de verificationForm
    this.verificationForm = this.formBuilder.group({
      verificationCode: ['', Validators.required],
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit(): void {
    this.inputError = false ; 
  }



  get f() {
    return this.form.controls;
  }


  

  login() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        footer: '<p>Champs Invalide</p>',
      });
      // Form is invalid, stop processing
      return;
    }

    // Destructure the form values directly
    const { username, password } = this.form.value;

    // Make the login API call
    this.backApiService.login({ username, password }).subscribe(
      (response: any) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "succès",
          showConfirmButton: false,
          timer: 1500
        });
        console.log("hhhhhhhhhhhhhhhh")
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
          this.email = username; // Stocker l'email pour l'utiliser lors de la vérification

          this.verificationCodeEntered = true;
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
        const error_message = error?.error?.error;

        this.inputError = true
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          footer: error_message,
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

  verifyCode() {
    if (this.verificationForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter both email and verification code',
      });
      return;
    }

    const { verificationCode } = this.verificationForm.value;

    // Afficher un indicateur de chargement pendant que la requête est en cours

    this.backApiService.verifyCode({ email: this.email, code: verificationCode }).subscribe(
      (response: any) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: " succès",
          showConfirmButton: false,
          timer: 1500
        });
        console.log("hhhhhhhhhhhhhhhh")
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
       

        }
      },
      (error: any) => {
        console.error('Verification error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Verification failed. Please try again.',
        });
      }
    );
  }
}

