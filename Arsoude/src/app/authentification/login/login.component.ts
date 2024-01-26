import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginDTO } from 'src/app/models/LoginDTO';
import { UserService } from 'src/app/service/user.service';

interface LoginData { 
  email?: string | null ; 
  password?: string | null ; 
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private fb: FormBuilder, public service : UserService){}
  username : string = ""; 
  password : string = "";

  hidePassword = true;

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['',[Validators.required, Validators.min(8)]],
  });
  // Le component contient une variable du même type que les champs du formulaire
  formData?: LoginData;
  ngOnInit(): void {
    // À chaque fois que les valeurs changent, notre propriétés formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
    });
  }

  async Login(){
    const login = new LoginDTO(this.username, this.password);

    try{
      this.service.Login(login);
    }
    catch(e){
      console.log("Erreur : " + e);
    }
  }

}
