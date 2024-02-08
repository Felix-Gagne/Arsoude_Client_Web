import { Component, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { Coordinates } from 'src/app/models/Coordinates';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailType } from 'src/app/models/enum/Type';

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
  trailType : TrailType = 0;
  imageUrl : string = "";

  private readonly storage: Storage = inject(Storage);

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
      console.log(this.trailType)
      
    });
  }

  async SendTrail(input: HTMLInputElement){
   await  this.uploadFile(input);
    if(this.imageUrl == ""){
      this.imageUrl = "";
    }
       

    const trail = new TrailDTO(this.text, this.description, this.location, this.trailType, this.imageUrl, undefined, undefined);

    localStorage.setItem("createTrail", JSON.stringify(trail));

    

    this.router.navigate(['/creation-step2']);

  }

  async uploadFile(input: HTMLInputElement) {
    if (!input.files) return
  
    const files: FileList = input.files;
  
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
            const storageRef = ref(this.storage, file.name);
            await uploadBytesResumable(storageRef, file);
            let test = await getDownloadURL(storageRef);
            this.imageUrl = test;
            console.log(test);
        }
    }
  }

  getComponentRoute() {
    return this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
  }
}
