import { Component, OnInit } from '@angular/core';
import { BackApiService } from '../../services/back-api.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { RequestRegister } from 'src/app/models/RequestRegister ';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  showPassword: boolean = false;
  qrCodeUri: string = ''; // Ajout du champ pour stocker le code QR

  verificationForm: FormGroup = this.formBuilder.group({
    code: ['', Validators.required],
  });
  activation = { code: '' };
  utilisateur = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    mfaEnabled: '',
  };
  verificationCodeEntered: boolean = false;
  passwordVisible: boolean = false;
  passwordVisible1: boolean = false;

  constructor(
    private authService: BackApiService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglecPasswordVisibility() {
    this.passwordVisible1 = !this.passwordVisible1;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required]],
        mfaEnabled: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  isConfirmPasswordInvalid() {
    const confirmPasswordControl = this.form.get('confirmPassword');
    return (
      confirmPasswordControl?.touched &&
      confirmPasswordControl?.errors &&
      confirmPasswordControl?.errors['passwordMismatch']
    );
  }

  get vf() {
    return this.verificationForm.controls;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  inscrireUtilisateur() {
    console.log(this.form.value);
    this.submitted = true;
    const formData = { ...this.form.value };
    this.authService.inscription(formData).subscribe(
      (response: any) => {
        if (!response.qrCodeUri) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'succès',
            showConfirmButton: false,
            timer: 1500,
          });
          // Utilisation de 'any' car le type exact de la réponse n'est pas connu

          this.verificationCodeEntered = true;
          console.log(response);
        } else {
          // Vérification de la présence de la clé 'qrCodeUri' dans la réponse
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Enregistré avec authentificateur',
            showConfirmButton: false,
            timer: 1500,
          });
          this.verificationCodeEntered = true;

          this.qrCodeUri = response.qrCodeUri; // Stockage du code QR extrait dans le champ
          console.log(this.qrCodeUri); // Vérifiez que le code QR est correctement stocké
        }
      },
      (error: any) => {
        const error_message = error?.error?.detail;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error_message,
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        console.error('Erreur générique:', error);
      }
    );
  }

  verifyCode() {
    this.authService.verification(this.verificationForm.value).subscribe(
      (response: HttpResponse<any>) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'succès',
          showConfirmButton: false,
          timer: 1500,
        });
        console.log('Validation réussie:', response);
        this.router.navigate(['']);
        // Affichez un message de succès.
      },
      (error: any) => {
        console.error('Erreur lors de la validation:', error);
        // Gérez les erreurs spécifiques ici, par exemple, code incorrect.
      }
    );
  }
}
