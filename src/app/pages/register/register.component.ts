import { Component, OnInit } from '@angular/core';
import { BackApiService } from '../../services/back-api.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  verificationForm: FormGroup = this.formBuilder.group({ code: ['', Validators.required] });
  activation = { code: '' };
  utilisateur = { nom: '',prenom:'', email: '', password: '', confirmPassword: '' };
  verificationCodeEntered: boolean = false;
  passwordVisible: boolean = false;
  passwordVisible1: boolean = false;

  constructor(
    private authService: BackApiService,
    private formBuilder: FormBuilder,
    private router: Router,
  
  ) { this.form = new FormGroup({});}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglecPasswordVisibility() {
    this.passwordVisible1 = !this.passwordVisible1;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]]
    }, { validator: this.passwordMatchValidator });


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
  get f() { return this.form.controls; }

  inscrireUtilisateur() {
    console.log(this.form.value); // Ajoutez cette ligne
    this.submitted = true; // Désactive le bouton
    this.authService.inscription(this.form.value).subscribe(
      (response: HttpResponse<UserModel>) => {

        console.log('Inscription réussie:', response);
        this.verificationCodeEntered = true;
      },
      (error: any) => {
        console.log('Erreur générique:', error);
      }
    );
  }
  

  verifyCode() {
    this.authService.verification(this.verificationForm.value).subscribe(
      (response: HttpResponse<any>) => {
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


