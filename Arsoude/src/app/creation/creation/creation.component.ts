import { Component, inject } from '@angular/core';
import { Storage ,getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { Coordinates } from 'src/app/models/Coordinates';
import { TrailDTO } from 'src/app/models/TrailDTO';
import { TrailService } from 'src/app/service/trail.service';


interface CreationData { 
  text?: string | null ; 
}

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})

export class CreationComponent {
  constructor(private fb: FormBuilder, public service : TrailService){}
  text : string | undefined; 
  private readonly storage: Storage = inject(Storage);
  password : string | undefined ;
  location: string = ""; 
  hidePassword = true;
  description: string = "";
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;
  trailType : number = 0;

  name : string = "";
  imageURL : string = "";

  form = this.fb.group({
    text: ['', [Validators.required, Validators.required]],
    location: ['', [Validators.required, Validators.required]],
    description: ['', [Validators.required, Validators.required]],
    trailType: ['', [Validators.required]]
  });

  // Le component contient une variable du même type que les champs du formulaire
  formData?: CreationData;

  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
  }

  async CreateTrail(){
    const StartingCoordinates = new Coordinates(45.536049, -73.495907);
    const EndingCoordinates = new Coordinates(45.543456, -73.491591);
    this.imageURL = "https://www.velomag.com/wp-content/uploads/2021/03/guideachatgravel2021.jpg";
    const trail = new TrailDTO(this.name, this.description, this.location, this.trailType, this.imageURL, StartingCoordinates, EndingCoordinates)
    
    try{
      this.service.CreateTrail(trail);
    }
    catch(e){
      console.log("Erreur : " + e);
    }
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
            this.imageURL = test;
        }
    }

}
}
