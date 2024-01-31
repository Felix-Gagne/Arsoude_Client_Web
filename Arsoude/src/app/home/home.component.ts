import { Component, inject } from '@angular/core';
import { HelloworldService } from '../service/helloworld.service';
import { Router } from '@angular/router';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {
hello : String = "pas de bonjour :C";
private readonly storage: Storage = inject(Storage);



constructor(private helloService : HelloworldService, private router: Router){}
  

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


}
