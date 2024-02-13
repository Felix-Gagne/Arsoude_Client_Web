import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arsoude';

  subMenu: HTMLElement | null = null;
  SelectedLanguage : string = "Français"


  constructor(public userService : UserService, private translate : TranslateService) { }

  ngOnInit(): void{
    this.userService.verifyConnectedUser();
    this.subMenu = document.getElementById("subMenu");

  }

  useLanguage(language: string){
    this.translate.use(language);
    if(language == "en"){
      this.SelectedLanguage = "English"
    }
    else{
      this.SelectedLanguage = "Français"
    }
  }

  toggleMenu(): void {
    console.log("Function called");
    if (this.subMenu) {
      this.subMenu.classList.toggle("open-menu");
    }
  }

  logout(): void{
    console.log("Sa se call")
    if(this.subMenu){
      this.subMenu.classList.remove("open-menu");
    }
    this.userService.Logout();
  }

}
