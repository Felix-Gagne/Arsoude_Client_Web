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
      this.SelectLanguage = data;
    }
    this.useLanguage();

    this.lvl = await this.userService.getUserLevel();

    this.breakpointObserver.observe([
      Breakpoints.Handset,  // Matches portrait phones
      '(max-width: 959px)'  // Your custom media query for sizes smaller than 960px
    ]).subscribe(result => {
      const isSmallScreen = result.matches;

      if (this.isSmallScreen !== isSmallScreen) {
        this.isSmallScreen = isSmallScreen;
        if (!this.isSmallScreen) {
          this.toggleHamburger();
        }
      }
    });

  
    console.log(this.isSmallScreen);
  }

  toggleHamburger() {
    this.slideInOut = this.slideInOut === 'out' ? 'in' : 'out';
    console.log(this.slideInOut);
    this.isClassVisible = !this.isClassVisible;
  }

  getStyle() {

  }

  useLanguage() {
    this.translate.use(this.SelectLanguage);

    localStorage.setItem("preferedLanguage", this.SelectLanguage);

    if (this.SelectLanguage == "en") {
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
    this.router.navigate(['/search']);
  }

  logout(): void {
    if (this.subMenu) {
      this.subMenu.classList.remove("open-menu");
    }
    this.imageUrl = "";
    this.userService.Logout();
  }

}
