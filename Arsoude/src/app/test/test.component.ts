import { Component } from '@angular/core';
import { trigger, state, style, transition, animate} from '@angular/animations';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
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
export class TestComponent {
  // @Input() slideInOut: String;
  slideInOut: String = 'out';
  isClassVisible = false;
  constructor() {
    setInterval(
      () => {
        console.log(this.slideInOut);
      }, 2000
    );
  }

  ngOnInit() {
  }

  toggleMenu() {
    // 1-line if statement that toggles the value:
    this.slideInOut = this.slideInOut === 'out' ? 'in' : 'out';
    this.isClassVisible = !this.isClassVisible;
  }

  getStyle() {

  }
}
