import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';

interface RegisterData { 
  email?: string | null ; 
  password?: string | null ; 
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private fb: FormBuilder){}
  email : string | undefined; 
  password : string | undefined ;

  hidePassword = true;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.min(8)]], 
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    username: ['', [Validators.required]],
    codePostal: ['', [Validators.required, this.postalCodeValidator()]],
    confirmPassword: ['', [Validators.required]],
  },{ validator: this.matchPasswordsValidator('password', 'confirmPassword') });



  // Le component contient une variable du même type que les champs du formulaire
  formData?: RegisterData;





  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
  }





  postalCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Utilisez une expression régulière pour valider le format du code postal (exemple pour le format canadien)
      const postalCodePattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  
      if (control.value && !postalCodePattern.test(control.value)) {
        return { 'invalidPostalCode': true };
      }
      return null;
    };
  }
  matchPasswordsValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = group.get(passwordKey);
      const confirmPasswordControl = group.get(confirmPasswordKey);
  
      if(passwordControl != null && confirmPasswordControl != null){
      if (passwordControl.value != confirmPasswordControl.value) {
        return { 'passwordMismatch': true };
      }
    }
  
      return null;
    };
  }
}
