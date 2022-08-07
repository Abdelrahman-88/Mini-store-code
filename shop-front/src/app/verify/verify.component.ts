import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  token:string = '';
  term:string = '';

  constructor(private _ActivatedRoute: ActivatedRoute,private toastr: ToastrService,private _AuthService:AuthService,private _Router:Router,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.token = this._ActivatedRoute.snapshot.params['token'];
    this.term = this._ActivatedRoute.snapshot.params['term'];
    this.verify(this.term,this.token);
  }

  verify(term:string,token:string){
    this.spinner.show();
    this._AuthService.verify(term,token).subscribe({
      next:(response) => {        
        this.toastr.success(response.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        if (response.message == 'Email verified successfully') {          
          this._Router.navigate(["/login"]);
        }
        else if(response.message == 'Password reseted successfully'){                    
          localStorage.setItem("changeToken", token);
          this._Router.navigate(["/changePassword"]);
        }
        else {
          this._Router.navigate(["/login"]);
        }
        this.spinner.hide();
      },
      error:(error:any)=>{
        this.spinner.hide();
        this._Router.navigate(["/login"]); 
        this.toastr.error(error.error.message, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
    }
      )
  }

}
