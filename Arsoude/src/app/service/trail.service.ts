import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { TrailDTO } from '../models/TrailDTO';

@Injectable({
  providedIn: 'root'
})
export class TrailService {

  constructor(public http : HttpClient, public router : Router) { }

  async CreateTrail(trail : TrailDTO){
    try{
      let x = await lastValueFrom(this.http.post<any>("http://localhost:5050/api/Trail/CreateTrail", trail));
      console.log(x);

    }
    catch(e){
      console.log("Erreur : " + e)
    }
  }

  async GetUserTrails(trail : TrailDTO){
    try{
      let x = await lastValueFrom(this.http.get<any>("http://localhost:5050/api/Trail/GetUserTrails"));
      console.log(x);
    }
    catch(e){
      console.log(e);
    }
  }
}
