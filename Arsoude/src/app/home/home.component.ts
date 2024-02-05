import { Component, inject } from '@angular/core';
import { HelloworldService } from '../service/helloworld.service';
import { Router } from '@angular/router';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FilterDTO } from '../models/FilterDTO';
import { TrailService } from '../service/trail.service';
import { TrailDTO } from '../models/TrailDTO';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
hello : String = "pas de bonjour :C";
filter : FilterDTO = new FilterDTO();
private readonly storage: Storage = inject(Storage);
trails : TrailDTO[] = []
searchInput: string = "";



constructor(private helloService : HelloworldService, private router: Router, private trailservice : TrailService){}
  

  async GetHello() : Promise<void> {
  
  this.hello = await this.helloService.GetWord()
  //let x = this.storage.getItem("téléchargement.png")

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
            console.log(test);
        }
    }
  }

  onEnter() : void {
    if(this.searchInput.length > 0){
      this.router.navigate(['/search']);
    }
  }

async FilterTrail(){
this.trails = await this.trailservice.searchTrails(this.filter);
}




}
