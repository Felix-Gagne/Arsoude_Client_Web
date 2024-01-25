import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterDTO } from '../models/RegisterDTO';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http : HttpClient) { }

  async register(service : RegisterDTO)
  {
    let x = await lastValueFrom(this.http.post<RegisterDTO>("https://localhost:7127/api/User/Register", service));
    console.log(x);
  }
}
