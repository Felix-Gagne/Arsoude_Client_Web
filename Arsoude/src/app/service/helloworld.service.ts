import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelloworldService {

  private baseUrl = environment.apiUrl + 'api/User'

  constructor(private http: HttpClient, private router: Router) {}

 async GetWord() : Promise<String> {
 

  let x = await lastValueFrom(this.http.get<any>(this.baseUrl+"/GetWord"))
  console.log(x);
   

  return x.text

  
}


}
