import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-bg-overlay',
  templateUrl: './bg-overlay.component.html',
  styleUrls: ['./bg-overlay.component.scss']
})
export class BgOverlayComponent implements OnInit {
    @Output() bgoverlayclick = new EventEmitter<any>();

  constructor(element: ElementRef) {
      fromEvent(element.nativeElement, 'click')
          .subscribe(this.bgoverlayclick.emit.bind(this.bgoverlayclick));
  }

  ngOnInit() { }

}
