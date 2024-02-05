import { Component } from '@angular/core';
import { TrailDTO } from '../models/TrailDTO';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  trails: TrailDTO[] = [];
  selectedType?: string;
  searchInput?: string;
  faArrowDown = faArrowDown;

  onEnter() {

  }
}
