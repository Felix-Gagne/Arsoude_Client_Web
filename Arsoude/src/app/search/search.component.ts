import { Component } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import { faPersonWalking, faBicycle, faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  trails: TrailDTO[] = [];
  selectedType?: string;
  searchInput?: string;
  faAngleDown = faAngleDown;
  faBicycle = faBicycle;
  faPersonWalking = faPersonWalking;

  onEnter() {

  }
}
