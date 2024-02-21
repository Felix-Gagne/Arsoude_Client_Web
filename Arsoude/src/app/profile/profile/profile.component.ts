import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { UserService } from 'src/app/service/user.service';

interface RegisterData { 
  password?: string | null ; 
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private fb: FormBuilder, public userService : UserService) { }

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
  userInfo !: TrailDTO;

  hidePassword = true;
  
  form = this.fb.group({
    password: [''], 
    nom: [''],
    prenom: [''],
    username: [''],
    codePostal: [''],
    confirmPassword: [''],
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





  async ngOnInit(){
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
    this.userInfo = await this.userService.getUserInfo(); 
    console.log(this.userInfo);
    //this.form.disable();
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

      if(value)

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
  
      if (passwordControl && confirmPasswordControl) {
        const password = passwordControl.value;
        const confirmPassword = confirmPasswordControl.value;

        if(password != null && password != ''){
          passwordControl.setValidators([Validators.min(8), this.passwordValidator()]);
        
          if (confirmPassword.trim() === '') { // Check if confirmPassword is empty
            group.get(confirmPasswordKey)?.setErrors({ 'required': true }); // Set it to required
            return { 'required': true };
          }
  
          if (password !== confirmPassword) {
              group.get(confirmPasswordKey)?.setErrors({ 'passwordMismatch': true });
              return { 'passwordMismatch': true };
          }
        }       
        
      }      
      
      return null;
    };
  }

  onButtonClick(): void {
    // Clear and update validators when the button is clicked
    const passwordControl = this.form.get('password');
    const confirmPasswordControl = this.form.get('confirmPassword');
    if (passwordControl && confirmPasswordControl) {
      passwordControl.clearValidators();
      confirmPasswordControl.clearValidators();
      passwordControl.updateValueAndValidity();
      confirmPasswordControl.updateValueAndValidity();
    }
  }

}
