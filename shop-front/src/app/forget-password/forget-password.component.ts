import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  darkMode: boolean = false;

  forgetForm: FormGroup = new FormGroup({
    "email": new FormControl(null, [Validators.email, Validators.required])
  })

  constructor(private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  forgetPassword(forgetForm: FormGroup){
    this.spinner.show();
    if (forgetForm.valid) {
      this._AuthService.forgetPassword(forgetForm.value).subscribe({
        next:(response) => {
          if (response.message == 'Password reseted successfully please verify your email') {          
            this.spinner.hide();
            localStorage.setItem("userToken", response.token);
            this._AuthService.saveUserData();
            this._Router.navigate(["/login"]);
            this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
          else if(response.message == 'Faild to send verification email please try after some time'){
            this._Router.navigate(["/login"]);
            this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
          else {
            this.spinner.hide();
            this.toastr.error(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
        },
        error:(error:any)=>{
          this.spinner.hide();
          if (error.error.message == 'Faild to send verification email please try after some time') {
            this._Router.navigate(["/login"]);          
          }
          this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
      }
        )
    } else {
      this.spinner.hide();
      this.toastr.error('Invalid input', "",{positionClass:'toast-bottom-right',timeOut: 5000});
    }
  }

}
