import { Component, ElementRef, HostListener } from '@angular/core';
import { UserService } from './service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { faAngleDown, faBicycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { TrailService } from './service/trail.service';
import { Level } from './models/Level';
import { trigger, state, style, transition, animate} from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut2', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class AppComponent {
  title = 'Arsoude';

  faAngleDown = faAngleDown;
  subMenu: HTMLElement | null = null;
  SelectLanguage: string = "fr";
  SelectedLanguage: string = "Français";
  frenchTraduction: boolean = true;
  lvl !: Level;
  public href: string = "";
  
  isSmallScreen: boolean = false;
  slideInOut: String = 'in';
  isClassVisible = false;

  hasImage: boolean = false;
  imageUrl: String = "";
  constructor(public userService: UserService, private translate: TranslateService, public router: Router, public trailService: TrailService, private elementRef: ElementRef,private breakpointObserver: BreakpointObserver) {}

  async ngOnInit() {

    this.userService.verifyConnectedUser();
    this.subMenu = document.getElementById("subMenu");
    this.href = this.router.url;
    var data = localStorage.getItem("preferedLanguage");
    if (data != null) {
      if(data == "fr"){
        this.frenchTraduction = true
      }
      else{
        this.frenchTraduction = false
      }
      this.translate.use(data)
    }
    if(localStorage.getItem("Token") != null){
      this.lvl = await this.userService.getUserLevel();
    }
    console.log(this.lvl);

    this.breakpointObserver.observe([
      Breakpoints.Handset, 
      '(max-width: 959px)' 
    ]).subscribe(result => {
      const isSmallScreen = result.matches;

      if (this.isSmallScreen !== isSmallScreen) {
        this.isSmallScreen = isSmallScreen;
        if (!this.isSmallScreen) {
          this.toggleHamburger();
        }
      }
    });
  
  }

  toggleHamburger() {
    this.slideInOut = this.slideInOut === 'out' ? 'in' : 'out';
    this.isClassVisible = !this.isClassVisible;
  }

  getStyle() {

  }

  useLanguage() {
    var language;
    if(this.frenchTraduction == true){
      language = "en";
      this.frenchTraduction = false
      this.translate.use(language);
    }
    else{
      language = "fr";
      this.frenchTraduction = true
      this.translate.use(language);    
    }

    localStorage.setItem("preferedLanguage", language);

    if (language== "en") {
      this.SelectedLanguage = "English"
    }
    else {
      this.SelectedLanguage = "Français"
    }
  }

  toggleMenu(): void {
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


  explore(): void {
    this.router.navigate(['/newSearch/home']);
}

  logout(): void {
    if (this.subMenu) {
      this.subMenu.classList.remove("open-menu");
    }
    this.imageUrl = "";
    this.userService.Logout();
  }

}
