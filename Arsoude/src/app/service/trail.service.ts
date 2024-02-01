import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { TrailDTO } from '../models/TrailDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrailService {

  constructor(public http : HttpClient, public router : Router) { }
  private baseUrl = environment.apiUrl + 'api/Trail/'
  async CreateTrail(trail : TrailDTO){
    try{
      let x = await lastValueFrom(this.http.post<any>(this.baseUrl+"CreateTrail", trail));
      console.log(x);
      this.router.navigate(['/']);
    }
    catch(e){
      console.log("Erreur : " + e)
    }
  }

  async GetUserTrails(trail : TrailDTO){
    try{
      let x = await lastValueFrom(this.http.get<any>(this.baseUrl+"GetUserTrails"));
      console.log(x);
    }
    catch(e){
      console.log(e);
    }
  }
}
