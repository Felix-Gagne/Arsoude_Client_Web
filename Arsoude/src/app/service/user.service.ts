import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../models/RegisterDTO';
import { LoginDTO } from '../models/LoginDTO';
import { Router } from '@angular/router';
import { InfoRegDTO } from '../models/InfoRegDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http : HttpClient, public router : Router) { }

  async register(dto : RegisterDTO)
  {
    try{
      console.log(dto);
      let x = await lastValueFrom(this.http.post<RegisterDTO>("http://localhost:5050/api/User/Register", dto));
      console.log(x);
      this.router.navigate(['/infoReg', dto.Username]);
    }
    catch(e){
      console.log(e);
    }
  }

  async Login(dto : LoginDTO){
    try{
      let x = await lastValueFrom(this.http.post<any>("http://localhost:5050/api/User/Login", dto));
      console.log(x.token);
      localStorage.setItem("Token", x.token);
      this.router.navigate(['/login']);
    }
    catch(e){
      console.log("Erreur : " + e);
    }
  }

  async AddAditionnalInfo(dto : InfoRegDTO){
    try{
      console.log(dto);
      let x = await lastValueFrom(this.http.put<any>("http://localhost:5050/api/User/AddAditionnalInfo", dto));
      console.log(x);
      this.router.navigate(['']);
    }
    catch(e){
      console.log("Error : " + e);
    }
  }
}
