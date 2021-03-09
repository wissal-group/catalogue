import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chars-table',
  templateUrl: './chars-table.component.html',
  styleUrls: ['./chars-table.component.css']
})
export class CharsTableComponent implements OnInit {

  @Input() characteristics: any;


  constructor() {
  }

  ngOnInit(): void {
  }

}
