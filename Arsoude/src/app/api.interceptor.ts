import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './service/user.service';
import { NotifierService } from './notifier.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
 
  constructor(private user: UserService, private snackBar: NotifierService) {}
 
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
       'Authorization' : 'Bearer '+ localStorage.getItem("Token")
      }})
 
     //console.log(request)
      
     const authorizationHeader = request.headers.get('Authorization');
      //console.log(authorizationHeader);

    if(authorizationHeader == "Bearer null"){
      this.user.removeToken();
    }
    return next.handle(request);
 
}
}
