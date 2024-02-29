import { Component, ElementRef, HostListener } from '@angular/core';
import { UserService } from './service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TrailService } from './service/trail.service';
import { Level } from './models/Level';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arsoude';

  faAngleDown = faAngleDown;
  subMenu: HTMLElement | null = null;
  SelectLanguage : string = "fr";
  SelectedLanguage : string = "Français";
  lvl !: Level;
  public href: string = "";
  userInfo !: ModifUserDTO;
  hasImage:boolean = false;
  imageUrl : String = "";
  constructor(public userService : UserService, private translate : TranslateService, public router: Router, public trailService : TrailService, private elementRef: ElementRef) { }

  async ngOnInit(){

   
    this.userService.verifyConnectedUser();
    this.subMenu = document.getElementById("subMenu");
    this.href = this.router.url;
    var data = localStorage.getItem("preferedLanguage");
    if(data != null){
      this.SelectLanguage = data;
    }
    this.useLanguage();

    this.lvl = await this.userService.getUserLevel();
    console.log(this.lvl);
  }

  useLanguage(){
    this.translate.use(this.SelectLanguage);

    localStorage.setItem("preferedLanguage", this.SelectLanguage);

    if(this.SelectLanguage == "en"){
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
  
  closeSubMenu(): void {
    if (this.subMenu && this.subMenu.classList.contains("open-menu")) {
      this.subMenu.classList.remove("open-menu");
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isClickInsideSubMenu = target.closest('.sub-menu-wrap') !== null;
    const isClickInsideUserBox = target.closest('.box') !== null; // Add this line to check if the click occurs within the user box
    
    if (!isClickInsideSubMenu && !isClickInsideUserBox) {
      this.closeSubMenu();
    }
  }


  explore(): void{
    this.router.navigate(['/search']);
  }

  logout(): void{
    console.log("Sa se call")
    if(this.subMenu){
      this.subMenu.classList.remove("open-menu");
    }
    this.imageUrl =  "";
    this.userService.Logout();
  }

}
