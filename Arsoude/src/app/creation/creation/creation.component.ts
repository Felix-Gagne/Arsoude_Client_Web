import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';

interface LoginData { 
  text?: string | null ; 
}
@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent {
  constructor(private fb: FormBuilder){}
  text : string | undefined; 
  password : string | undefined ;
  location: string | undefined; 
  hidePassword = true;
  description: string | undefined;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;

  form = this.fb.group({
    text: ['', [Validators.required, Validators.required]],
    location: ['', [Validators.required, Validators.required]],
    description: ['', [Validators.required, Validators.required]],
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
