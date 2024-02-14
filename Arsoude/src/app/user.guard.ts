import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { UserService } from './service/user.service';

export const userGuard: CanActivateFn = (route, state) => {
  var data = localStorage.getItem("role");
  if(inject(UserService).isConnected){
    return true
  }
  
  return createUrlTreeFromSnapshot(route, ['/login']);
};
