import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../models/RegisterDTO';
import { LoginDTO } from '../models/LoginDTO';
import { Router } from '@angular/router';
import { InfoRegDTO } from '../models/InfoRegDTO';
import { environment } from 'src/environments/environment';
import { TrailDTO } from '../models/TrailDTO';
import { TrailService } from './trail.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http : HttpClient, public router : Router, public trailService : TrailService) { }
  private baseUrl = environment.apiUrl + 'api/User';
  public isConnected : boolean = false;
  public isAdmin : boolean = false;
  public username ?: string ;
  public connectedUserId?: number;
  public favTrail : TrailDTO[] = [];
  async register(dto : RegisterDTO)
  {
    try{
      console.log(dto);
      let x = await lastValueFrom(this.http.post<any>(this.baseUrl+"/Register", dto));
      console.log(x);
      localStorage.setItem("Token", x.token);
      this.router.navigate(['/infoReg', dto.Username]);

    }
    catch(e){
      console.log(e);
    }
  }

  async Login(dto : LoginDTO){
    try{
      let x = await lastValueFrom(this.http.post<any>(this.baseUrl+"/Login", dto));
      console.log(x.token);
      localStorage.setItem("Token", x.token);
      localStorage.setItem("Username", dto.Username);
      let roles = x.roles;
        if(roles[0] == "Admin"){
          localStorage.setItem("admin", roles[0])
          this.isAdmin = true
        }
      if(localStorage.getItem('Username') != undefined && localStorage.getItem('Username') != null ){
        this.username = localStorage.getItem("Username")?.toString();
      }
      this.isConnected = true;
      
      this.favTrail = await this.trailService.getFavTrails();
      

      this.router.navigate(['/']);
    }
    catch(e){
      console.log("Erreur : " + e);
    }
  }

  async AddAditionnalInfo(dto : InfoRegDTO){
    try{
      console.log(dto);
      let x = await lastValueFrom(this.http.put<any>(this.baseUrl+"/AddAditionnalInfo", dto));
      console.log(x);
      this.router.navigate(['']);
    }
    catch(e){
      console.log("Error : " + e);
    }
  }

  Logout(){
    localStorage.removeItem('Token');
    localStorage.removeItem('admin');
    localStorage.removeItem('Username');
    this.isConnected = false;
    this.router.navigate(['/']);
  }

  verifyConnectedUser(){
    if(localStorage.getItem("Token") != undefined && localStorage.getItem("Token") != null){
      console.log(localStorage.getItem("Token"));
      this.isConnected = true;
    }
    if(localStorage.getItem('Username') != undefined && localStorage.getItem('Username') != null ){
      this.username = localStorage.getItem("Username")?.toString();
    }
    if(localStorage.getItem('admin') != undefined && localStorage.getItem('admin') != null)
    {
      this.isAdmin = true;
    }
  }
}
