import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-change-social-password',
  templateUrl: './change-social-password.component.html',
  styleUrls: ['./change-social-password.component.scss']
})
export class ChangeSocialPasswordComponent implements OnInit {

  darkMode: boolean = false;

  changeForm: FormGroup = new FormGroup({
    "newPassword": new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/)]),
    "cNewPassword":new FormControl(null, [Validators.required])
  })

  constructor(private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  changeSocialPassword(changeForm: FormGroup){
    this.spinner.show();
    if (changeForm.valid && changeForm.get('cNewPassword')?.value == changeForm.get('newPassword')?.value) {
      this._AuthService.changeSocialPassword(changeForm.value).subscribe({
        next:(response) => {
          if (response.message == 'Password changed successfully') {          
            this.spinner.hide();
            this._Router.navigate(["/profile"]);
            localStorage.setItem("userToken", response.token);
            this._AuthService.saveUserData();
            this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
          else {
            this.spinner.hide();
            this._Router.navigate(["/profile"]);
            this.toastr.error(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
        },
        error:(error:any)=>{
          this.spinner.hide();          
          this._Router.navigate(["/profile"]);
          this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
      }
        )
    } else {
      this.spinner.hide();   
      this.toastr.error('Invalid inputs', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

}
