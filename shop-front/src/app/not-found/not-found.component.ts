import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../dark-mode.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  darkMode: boolean = false;

  constructor(private _DarkModeService:DarkModeService) { }

  ngOnInit(): void {
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

}
