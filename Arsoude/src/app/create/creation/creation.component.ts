import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { Coordinates } from 'src/app/models/Coordinates';
import { TrailDTO } from 'src/app/models/TrailDTO';

interface LoginData { 
  text?: string | null ; 
}
@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent {

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, public router : Router){}

  text : string = ""; 
  password : string | undefined ;
  location: string = ""; 
  hidePassword = true;
  description: string = "";
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  trailType : number = 0;
  imageUrl : string = "";

  form = this.fb.group({
    text: ['', [Validators.required, Validators.required]],
    location: ['', [Validators.required, Validators.required]],
    description: ['', [Validators.required, Validators.required]],
    trailType: ['', [Validators.required]]
  });
  // Le component contient une variable du même type que les champs du formulaire
  formData?: LoginData;
  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
  }

  async SendTrail(){

    this.imageUrl = "https://www.velomag.com/wp-content/uploads/2021/03/guideachatgrave12021.jpg";
    const trail = new TrailDTO(this.text, this.description, this.location, this.trailType, this.imageUrl, undefined, undefined);

    localStorage.setItem("createTrail", JSON.stringify(trail));

    this.router.navigate(['/creation-step2']);

  }

  getComponentRoute() {
    return this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
  }
}
