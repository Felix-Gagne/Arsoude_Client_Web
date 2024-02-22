import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { last, lastValueFrom } from 'rxjs';
import { TrailDTO } from '../models/TrailDTO';
import { environment } from 'src/environments/environment';
import { FilterDTO } from '../models/FilterDTO';
import { Coordinates } from '../models/Coordinates';
import { NotifierService } from '../notifier.service';

@Injectable({
  providedIn: 'root'
})
export class TrailService {

  constructor(public http : HttpClient, public router : Router, public notifierService: NotifierService) { }
  private baseUrl = environment.apiUrl + 'api/Trail/'
  private formData: any;

  trail : TrailDTO | undefined;
  api_key = '82a714f1faf0468bbbb60aadf5bdec68';

  url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + this.api_key;
  public coordinates :Coordinates = new Coordinates();
  
  async checkConnection(): Promise<boolean> {
    if (!navigator.onLine) {
      return false;
    } else {
      return true;
    }
  }

  checkToken(): boolean {
    const token = localStorage.getItem('Token');
    console.log(token);
    return !!token;
  }

  async CreateTrail(trail: TrailDTO) {
    try {
      let response = await lastValueFrom(this.http.post<any>(this.baseUrl + "CreateTrail", trail));
      console.log(response);
      this.router.navigate(['/']);  
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error instanceof ErrorEvent) {
        console.error('Une erreur s\'est produite:', error.error.message);
        this.notifierService.showNotification('Erreur de connexion au serveur, veuillez réessayer', 'error');
        throw error;
      } else {
        console.error(`Erreur côté serveur : ${error}`);
        this.notifierService.showNotification('Une erreur est survenue lors de la création de la randonnée', 'error');
        throw error;
      }
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

  async allTrails(){
    
    try{
      let x = await lastValueFrom(this.http.get<any>(this.baseUrl + "GetAllTrails"));
      console.log(x);
      return x;
    }
    catch(error){
      console.log(error);
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

      let trails = await lastValueFrom(this.http.post<any>(this.baseUrl + "GetFilteredTrails", filter));
      console.log(trails)
      return trails;
    }
    catch(error : any){
      console.log(error.error);
      return error.error;
    }
  }

  async getTrailDetails(trailId : number){
    try{
      let x = await lastValueFrom(this.http.get<TrailDTO>(this.baseUrl+"GetTrail/"+ trailId))
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
  
   public setFormData(formData: any): void {
    this.formData = formData;
  }

  public getFormData(): any {
    return this.formData;  
  }


  async SetVisibility(trailId : number, status : boolean){
    try{

    let x = await lastValueFrom(this.http.get<any>(this.baseUrl+"SetTrailStatus/"+trailId+"/"+status))
    console.log(x)

    }
    catch(e){

    console.log(e);
    throw e;

    }


  }
}
