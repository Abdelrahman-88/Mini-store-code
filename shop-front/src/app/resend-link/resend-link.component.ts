import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-resend-link',
  templateUrl: './resend-link.component.html',
  styleUrls: ['./resend-link.component.scss']
})
export class ResendLinkComponent implements OnInit {

  id:string = "";
  darkMode: boolean = false;

  constructor(private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._AuthService.userData.subscribe((res:any)=>{
      this.id = res._id      
    })
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  resendVerificationLink(){
    this.spinner.show();
    this._AuthService.resendVerificationLink(this.id).subscribe({
      next:(response) => {
        if (response.message == 'Verification email sent successfully') {          
          this.spinner.hide();
          this._Router.navigate(["/login"]);
          this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
        else {
          this.spinner.hide();          
          this.toastr.error(response.response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      error:(error:any)=>{
        this.spinner.hide();
        this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
    }
      )
  }

}
