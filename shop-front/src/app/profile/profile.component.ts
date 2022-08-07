import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user:any;
  darkMode: boolean = false;

  constructor(private _AuthService:AuthService,private _DarkModeService:DarkModeService) { }

  ngOnInit(): void {
    this._AuthService.userData.subscribe((res:any)=>{
      this.user = res
    })
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

}
