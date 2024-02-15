import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { last, lastValueFrom } from 'rxjs';
import { TrailDTO } from '../models/TrailDTO';
import { environment } from 'src/environments/environment';
import { FilterDTO } from '../models/FilterDTO';
import { Coordinates } from '../models/Coordinates';

@Injectable({
  providedIn: 'root'
})
export class TrailService {

  constructor(public http : HttpClient, public router : Router) { }
  private baseUrl = environment.apiUrl + 'api/Trail/'

  trail : TrailDTO | undefined;
  api_key = '82a714f1faf0468bbbb60aadf5bdec68';

  url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + this.api_key;
  public coordinates :Coordinates = new Coordinates();
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

  async AddFavorite(Id : number){
     try{
      let x = await lastValueFrom(this.http.post<any>(this.baseUrl+"ManageTrailFavorite/"+Id, null))
      console.log(x);
     }
     catch(e){
      console.log(e);
     }
  }

  async searchTrails(filter : FilterDTO){
    
    await this.http.get(this.url).subscribe((res : any)=> {
      this.coordinates.latitude = res.latitude
      this.coordinates.longitude = res.longitude
      console.log(this.coordinates)
    });
    filter.coordinates = this.coordinates;

    try{
      console.log(filter);

      let x = await lastValueFrom(this.http.post<any>(this.baseUrl + "GetFilteredTrails", filter));
      console.log(x)
      return x;
    }
    catch(e){
      console.log(e);
      throw e;
    }
  }

  async getTrailDetails(trailId : number){
    try{
      let x = await lastValueFrom(this.http.get<TrailDTO>(this.baseUrl+"get/"+ trailId))
      console.log(x);
      return x;
    }
    catch(e){
      console.log("GetTrailDetails : " + e)
      throw e;
    }
  }

  async manageTrailFavorite(trailId : number, isFavorite : boolean){
    try{
      await lastValueFrom(this.http.get<TrailDTO>(this.baseUrl+"ManageTrailFavorite/"+trailId))
    }
    catch(e){
      console.log("ManageTrailFavorite : " + e)
      throw e;
    }
  }

  async getFavTrails(){
    try{
      let x = await lastValueFrom(this.http.get<TrailDTO[]>(this.baseUrl+"GetFavoriteTrails"))
      console.log(x);
      return x;
    }
    catch(e){
      console.log("GetFavoriteTrails : " + e)
      throw e;
    }
  }

  async checkOwnerByTrailId(trailId: number){
    try{
      let x = await lastValueFrom(this.http.get<boolean>(this.baseUrl+"CheckOwnerByTrailId/" + trailId))
      console.log(x);
      return x;
    }
    catch(e){
      console.log("CheckOwnerByTrailId : " + e)
      throw e;
    }
  }
}
