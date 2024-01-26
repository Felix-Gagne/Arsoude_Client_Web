import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InfoRegDTO } from 'src/app/models/InfoRegDTO';
import { UserService } from 'src/app/service/user.service';

interface InfoData{
  address?: string | null ; 
  street?: string | null ;
  province? : string | null;
  yearbirth? : string | null;
  monthbirth? : string | null;


}


@Component({
  selector: 'app-info-reg',
  templateUrl: './info-reg.component.html',
  styleUrls: ['./info-reg.component.css']
})
export class InfoRegComponent {
  constructor(private fb: FormBuilder, public service : UserService){}
   
  provinces: string[] = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon',
  ];

  state : string = "";
  city : string = "";
  street : string = "";
  houseNo : number = 0;
  yearOfBirth : number = 0;
  monthOfBirth : number = 0;

  hidePassword = true;

  form = this.fb.group({
    address : ['', [Validators.pattern(/^[0-9]+$/)]],
    street : ['', []],
    province : ['', []],
    yearbirth : ['',[Validators.pattern(/^[0-9]+$/), this.validYearValidator()]],
    monthbirth : ['',[Validators.pattern(/^[0-9]+$/),this.validMonthValidator()]]

  });
  // Le component contient une variable du même type que les champs du formulaire
  formData?: InfoData;
  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
  }

  async AddAditionnalInfo(){
    const info = new InfoRegDTO(this.houseNo, this.street, this.city, this.state, this.yearOfBirth, this.monthOfBirth);

    try{
      await this.service.AddAditionnalInfo(info);
    }
    catch(e){
      console.log("Error : " + e);
    }
  }

  validMonthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const monthValue = control.value;
  
      // Check if the month is a valid number between 1 and 12
      if (!/^\d+$/.test(monthValue) || +monthValue < 1 || +monthValue > 12) {
        return { validMonth: true };
      }
  
      return null; 
    };
  }
  validYearValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const yearValue = control.value;
  
      // Check if the year is a valid number (you can customize this based on your requirements)
      if (!/^\d+$/.test(yearValue) || +yearValue < 1900 || +yearValue > new Date().getFullYear()) {
        return { validYear: true };
      }
  
      return null; 
    };
  }




 
}
