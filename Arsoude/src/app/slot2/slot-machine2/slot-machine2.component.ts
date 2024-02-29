import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-slot-machine2',
  templateUrl: './slot-machine2.component.html',
  styleUrls: ['./slot-machine2.component.css'],
  animations: [
    trigger('cardSpinner', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, display: 'none', transform: 'translateY(-100%)' })),
      transition('in => out', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('0.1s', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ]),
      transition('out => in', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.1s', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class SlotMachine2Component {

  currentIndex = 0;
    
  cards = [
    {value: 0, state: 'out', color: '#F44336'},
    {value: 1, state: 'out', color: '#E91E63'},
    {value: 2, state: 'out', color: '#9C27B0'},
    {value: 3, state: 'out', color: '#673AB7'},
    {value: 4, state: 'out', color: '#3F51B5'},
    {value: 5, state: 'out', color: '#2196F3'},
    {value: 6, state: 'out', color: '#03A9F4'},
    {value: 7, state: 'out', color: '#00BCD4'},
    {value: 8, state: 'out', color: '#009688'},
    {value: 9, state: 'out', color: '#4CAF50'}
  ];

  animateSpin() {
    this.cards.forEach(card => card.state = 'out');
    this.currentIndex = 0;
    this.cards[this.currentIndex].state = 'in';

    const interval = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex === this.cards.length) {
        this.currentIndex = 0;
      }
      if (this.currentIndex !== 0 ) {
        this.cards[this.currentIndex - 1].state = 'out';
      } else {
        this.cards[this.cards.length - 1].state = 'out';
      }
      this.cards[this.currentIndex].state = 'in';

      const itemIndex = Math.floor((Math.random() * ((this.cards.length * 5) - this.cards.length)) + this.cards.length);
      console.log(itemIndex);
      setTimeout(() => {
        clearInterval(interval);
        const randomCard = this.cards.filter(card => card.state === 'in');
        console.log(randomCard);
      }, itemIndex * 100);

    }, 100);
}
}
