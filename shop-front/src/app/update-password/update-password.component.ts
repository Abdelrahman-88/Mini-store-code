import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  darkMode: boolean = false;

  updateForm: FormGroup = new FormGroup({
    "oldPassword": new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/)]),
    "newPassword": new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/)]),
    "cNewPassword":new FormControl(null, [Validators.required])
  })

  constructor(private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  updatePassword(updateForm: FormGroup){
    this.spinner.show();
    if (updateForm.valid && updateForm.get('cNewPassword')?.value == updateForm.get('newPassword')?.value) {
      this._AuthService.updatePassword(updateForm.value).subscribe({
        next:(response) => {
          if (response.message == 'Password updated successfully') {          
            this.spinner.hide();
            this._Router.navigate(["/profile"]);
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
