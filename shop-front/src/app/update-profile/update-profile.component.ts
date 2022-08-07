import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  image: any;
  show: boolean = false;
  touched:boolean = false;
  user:any;
  darkMode: boolean = false;

  updateForm: FormGroup = new FormGroup({
    "name": new FormControl(null, [Validators.required, Validators.pattern(/^[a-z A-Z]+$/)]),
    "email": new FormControl(null, [Validators.email, Validators.required])
  })

  constructor(private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._AuthService.userData.subscribe((res:any)=>{ this.user=res});
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
    this.setValue(); 
  }

  setValue(){
    this.updateForm.controls['name'].setValue(this.user.name)
    this.updateForm.controls['email'].setValue(this.user.email)
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

  setData(updateForm:FormGroup){
    if (updateForm.valid && !this.show) {
      this.formData.set('email', updateForm.controls['email'].value);
      this.formData.set('name', updateForm.controls['name'].value);
      this.updateProfile();
    } else {
      this.toastr.error('Invalid inputs', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }


  updateProfile(){
    this.spinner.show();
    this._AuthService.updateProfile(this.formData).subscribe({
      next:(response) => {
        this.spinner.hide();
        if (response.message == 'Profile updated successfully') {          
          localStorage.setItem("userToken", response.token);
          this._AuthService.saveUserData();
          this._Router.navigate(["/profile"]);
          this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }else if(response.message == 'Profile updated successfully please verify your email'){
          localStorage.removeItem("userToken");
          this._AuthService.userData.next(null)
          this._Router.navigate(["/login"]);
          this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }else if(response.message == 'Profile updated successfully but faild to send verification email please try login after some time'){
          localStorage.removeItem("userToken");
          this._AuthService.userData.next(null)
          this._Router.navigate(["/login"]);
          this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
        else {
          this.toastr.error(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      error:(error:any)=>{
        this.spinner.hide();
        if (error.error.message == 'Profile updated successfully but faild to send verification email please try login after some time') {
          localStorage.removeItem("userToken");
          this._AuthService.userData.next(null)
          this._Router.navigate(["/login"]);          
        }
        this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
    }
      )
  }

}
