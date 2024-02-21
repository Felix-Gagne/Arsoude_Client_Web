import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';

interface RegisterData { 
  password?: string | null ; 
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private fb: FormBuilder) { }

  password : string = "";
  lastName : string = "";
  firstName : string = "";
  username : string = "";
  areaCode : string = "";
  HouseNo : number = 0;
  Street : String = "";
  City : String = "";
  State : String = "";
  YearOfBirth : String = "";
  MonthOfBirth : String = "";
  confirmPassword : string = "";

  hidePassword = true;
  
  form = this.fb.group({
    password: ['',[Validators.required, Validators.min(8),this.passwordValidator()]], 
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    username: ['', [Validators.required]],
    codePostal: ['', [Validators.required, this.postalCodeValidator()]],
    confirmPassword: ['', [Validators.required]],
  },{ validator: this.matchPasswordsValidator('password', 'confirmPassword') });


  additionalForm = this.fb.group({
    houseNo: [''],
    street: [''],
    city: [''],
    state: [''],
    yearOfBirth: [''],
    monthOfBirth: [''],
  });

  // Le component contient une variable du même type que les champs du formulaire
  formData?: RegisterData;





  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
    this.form.disable();
    this.additionalForm.disable();
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
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!/[a-z]/.test(value)) {
        return { 'lowercaseMissing': true };
      }

      if (!/[A-Z]/.test(value)) {
        return { 'uppercaseMissing': true };
      }

      if (!/\d/.test(value)) {
        return { 'numberMissing': true };
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
