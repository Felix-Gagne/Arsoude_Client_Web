import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-helldive',
  templateUrl: './helldive.component.html',
  styleUrls: ['./helldive.component.css']
})
export class HelldiveComponent implements AfterViewInit {
  @ViewChild('iframeRef', { static: false }) iframeRef!: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit() {
    // this.iframeRef.nativeElement.querySelector('iframeRef').addEventListener('keydown', this.onKeyDown.bind(this))
  }

  addEventListenerTest() {
    this.iframeRef.nativeElement.addEventListener('keypress', (event) => this.onKeyDown(event))
  }

  constructor() { }
  onKeyDown(key: KeyboardEvent) {
    console.log(key);

    if (key.key.startsWith('Arrow')) {
      console.log(key.key);
      key.preventDefault();
    }
  }

}
