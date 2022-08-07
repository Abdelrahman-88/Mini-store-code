import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  image: any;
  show: boolean = false;
  touched:boolean = false;
  darkMode: boolean = false;

  registerForm: FormGroup = new FormGroup({
    "name": new FormControl(null, [Validators.required, Validators.pattern(/^[a-z A-Z]+$/)]),
    "email": new FormControl(null, [Validators.email, Validators.required]),
    "password": new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&])[0-9a-zA-Z@$&]{8,}$/)]),
    "cPassword":new FormControl(null, [Validators.required])
  })

  constructor(private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  formData = new FormData();
  onFileChange(event: any) {    
    this.touched= true;
    this.image = <File>event.target.files[0];    
    if (event.target.files.length == 1 && this.image.type.match(/^(image\/png|image\/jpg|image\/jpeg){1}$/) && this.image.size <= 1000 * 1000) {
      this.formData.append('profilePic', this.image, this.image.name);
      this.show = false;
    }else if(!event.target.files.length){
      this.show = false;
      this.touched= false;
      this.formData.delete('profilePic')
    }
    else {
      this.show = true;
      this.formData.delete('profilePic')
    }
  }

  setData(registerForm:FormGroup){
    if (registerForm.get('cPassword')?.value == registerForm.get('password')?.value) {
      if (registerForm.valid && !this.show) {
        this.formData.set('email', registerForm.controls['email'].value);
        this.formData.set('name', registerForm.controls['name'].value);
        this.formData.set('password', registerForm.controls['password'].value);
        this.formData.set('cPassword', registerForm.controls['cPassword'].value);
        this.register();
      } else {
        this.toastr.error('Invalid inputs', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      }
    } else {
      this.toastr.error('Confirm password must match password', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }


  register(){
    this.spinner.show();
    this._AuthService.register(this.formData).subscribe({
      next:(response) => {
        if (response.message == 'Register successfully please verify your email') {          
          this.spinner.hide();
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
        if (error.error.message == 'Register successfully but faild to send verification email please try login after some time') {
          this._Router.navigate(["/login"]);
        }
        this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
    }
      )
  }

}
