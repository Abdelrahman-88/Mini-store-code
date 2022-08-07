import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../auth.service';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { DarkModeService } from '../dark-mode.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  darkMode: boolean = false;

  loginForm: FormGroup = new FormGroup({
    "email": new FormControl(null, [Validators.email, Validators.required]),
    "password": new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/)])
    })

  constructor(private _SocialAuthService: SocialAuthService,private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  login(loginForm:FormGroup){
    this.spinner.show();
    if (loginForm.valid) {
      this._AuthService.login(loginForm.value).subscribe({
        next:(response) => {
          if (response.message == 'Login successfully') {          
            this.spinner.hide();
            localStorage.setItem("userToken", response.token);
            this._AuthService.saveUserData();
            this._Router.navigate(["/home"]);
            this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
          else if(response.response.error == 'Unverified email') {
            localStorage.setItem("userToken", response.response.token);
            this._AuthService.saveUserData();
            this._Router.navigate(["/resend"]);
            this.spinner.hide();
            this.toastr.error(response.response.error, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }else{
            this.spinner.hide();
            this.toastr.error(response.response.error, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
        },
        error:(error:any)=>{
          this.spinner.hide();
          this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          }
      }
        )
    } else {
      this.spinner.hide();
      this.toastr.error('Invalid inputs', "",{positionClass:'toast-bottom-right',timeOut: 5000});
    }
  }

  submitGoogleForm() {
    this.spinner.show();
    this._SocialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this._SocialAuthService.authState.subscribe((user) => {
      if (user) {
        const data = {
          token:user.response.access_token,
          name:user.name,
          profilePic:user.photoUrl}
        this._AuthService.googleLogin(data).subscribe({
          next:(response) => {            
            if (response.message == 'Login successfully') {          
              this.spinner.hide();
              localStorage.setItem("userToken", response.token);
              this._AuthService.saveUserData();
              this._Router.navigate(["/home"]);
              this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
            }
            else if(response.response.error == 'No user from google') {
              this.spinner.hide();
              this.toastr.error(response.response.error, "",{positionClass:'toast-bottom-right',timeOut: 5000});
            }else{
              this.spinner.hide();
              this.toastr.error(response.response.error, "",{positionClass:'toast-bottom-right',timeOut: 5000});
            }
          },
          error:(error:any)=>{
            this.spinner.hide();
            this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
            }
        }
          )
      }else{
        this.spinner.hide();
        this.toastr.error('No user from google', "",{positionClass:'toast-bottom-right',timeOut: 5000});
      }
    });
  }

}
