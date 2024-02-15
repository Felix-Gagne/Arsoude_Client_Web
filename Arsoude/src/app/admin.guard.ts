import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { UserService } from './service/user.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  var data = localStorage.getItem("role");
  if(inject(UserService).isAdmin){
    return true
  }
  
  return createUrlTreeFromSnapshot(route, ['/login']);
};
