import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../models/RegisterDTO';
import { LoginDTO } from '../models/LoginDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http : HttpClient) { }

  async register(dto : RegisterDTO)
  {
    let x = await lastValueFrom(this.http.post<RegisterDTO>("http://localhost:5050/api/User/Register", dto));
    console.log(x);
  }

  async Login(dto : LoginDTO){
    let x = await lastValueFrom(this.http.post<any>("http://localhost:5050/api/User/Login", dto));
    console.log(x.token);
    localStorage.setItem("Token", x.token);
  }
}
