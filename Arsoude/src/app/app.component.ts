import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arsoude';

  subMenu: HTMLElement | null = null;


  constructor(public userService : UserService) { }

  ngOnInit(): void{
    this.userService.verifyConnectedUser();
    this.subMenu = document.getElementById("subMenu");

  }

  toggleMenu(): void {
    console.log("Function called");
    if (this.subMenu) {
      this.subMenu.classList.toggle("open-menu");
    }
  }

  logout(): void{
    if(this.subMenu){
      this.subMenu.classList.remove("open-menu");
    }
    this.userService.Logout();
  }

}
