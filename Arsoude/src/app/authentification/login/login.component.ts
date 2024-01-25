import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

interface LoginData { 
  email?: string | null ; 
  password?: string | null ; 
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private fb: FormBuilder){}
  email : string | undefined; 
  password : string | undefined ;

  hidePassword = true;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.min(8)]],
  });
  // Le component contient une variable du même type que les champs du formulaire
  formData?: LoginData;
  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
  }

}
