import { Component, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModifUserDTO } from 'src/app/models/ModifUserDTO';
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

  constructor(private fb: FormBuilder, public userService : UserService, public router : Router) { }
  private readonly storage: Storage = inject(Storage);
  password : string = "";
  lastName : string = "";
  firstName : string = "";
  username : string = "";
  areaCode : string = "";
  HouseNo : string = "";
  Street : string = "";
  City : string = "";
  State : string = "";
  YearOfBirth : string = "";
  MonthOfBirth : string = "";
  confirmPassword : string = "";
  userInfo !: ModifUserDTO;
  imageUrl? : string = "";
  hidePassword = true;
  Hasimage : boolean = false;
  uploadInProgress:boolean = false;

  editProfilePrincipal = false;
  editProfileSecondary = false;

  
  form = this.fb.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    username: ['', [Validators.required]],
    codePostal: ['', [Validators.required, this.postalCodeValidator()]],
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
    this.form.disable();
    this.additionalForm.disable();
    this.lastName = this.userInfo.lastName!;
    this.firstName = this.userInfo.firstName!;
    this.username = this.userInfo.username!;
    this.areaCode = this.userInfo.areaCode!;
    this.imageUrl = this.userInfo.avatarUrl;
     if(this.imageUrl != undefined )
     {
        this.Hasimage = true;
     }

     if(this.userInfo.houseNo != null){
      this.HouseNo = this.userInfo.houseNo.toString()
    }

    if(this.userInfo.street != null){
      this.Street = this.userInfo.street
    }

    if(this.userInfo.city != null){
      this.City = this.userInfo.city
    }

    if(this.userInfo.state != null){
      this.State = this.userInfo.state
    }

    if(this.userInfo.yearOfBirth != null){
      this.YearOfBirth = this.userInfo.yearOfBirth.toString()
    }

    if(this.userInfo.monthOfBirth != null){
      this.MonthOfBirth = this.userInfo.monthOfBirth.toString()
    }
     
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

  editPrincipal() : void{
    this.editProfilePrincipal = true;
    this.form.enable();
    this.additionalForm.enable();
  }

  async update(){

    var newDto = new ModifUserDTO(
      this.lastName,
      this.firstName,
      this.areaCode,
      parseInt(this.HouseNo),
      this.Street,
      this.City,
      this.State,
      parseInt(this.YearOfBirth),
      parseInt(this.MonthOfBirth),
      this.imageUrl,
      this.username
     )
     console.log(newDto)
     var response = await this.userService.editUser(newDto);
     this.editProfilePrincipal = false;
     this.form.disable();
     this.additionalForm.disable();
  }

  cancel() : void{
    this.editProfilePrincipal = false;
    this.editProfileSecondary = false;
    this.lastName = this.userInfo.lastName!;
    this.firstName = this.userInfo.firstName!;
    this.username = this.userInfo.username!;
    this.areaCode = this.userInfo.areaCode!;
    if(this.userInfo.houseNo != null){
      this.HouseNo = this.userInfo.houseNo.toString()
    }

    if(this.userInfo.street != null){
      this.Street = this.userInfo.street
    }

    if(this.userInfo.city != null){
      this.City = this.userInfo.city
    }

    if(this.userInfo.state != null){
      this.State = this.userInfo.state
    }

    if(this.userInfo.yearOfBirth != null){
      this.YearOfBirth = this.userInfo.yearOfBirth.toString()
    }

    if(this.userInfo.monthOfBirth != null){
      this.MonthOfBirth = this.userInfo.monthOfBirth.toString();
    }
    
    this.form.disable()
    this.additionalForm.disable()
  }

  async uploadFile(input: HTMLInputElement) {
    console.log("T'es pd?")
    if (!input.files) return
    
    this.uploadInProgress = true;

    const files: FileList = input.files;
  
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
            const storageRef = ref(this.storage, file.name);
            await uploadBytesResumable(storageRef, file);
            let test = await getDownloadURL(storageRef);
            this.Hasimage = true;
            this.imageUrl = test;
            await this.update();
            console.log(test);
        }
    }

    this.uploadInProgress = false;
    input.value = '';
  }

}
