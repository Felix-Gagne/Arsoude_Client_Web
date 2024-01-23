import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelloworldService {

  private baseUrl = environment.apiUrl + 'api/Home'

  constructor(private http: HttpClient, private router: Router) {}


}
