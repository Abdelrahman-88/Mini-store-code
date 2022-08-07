import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart.service';
import { CurrencyService } from '../currency.service';
import { DarkModeService } from '../dark-mode.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  cartId:string='';
  cart:any={};
  error:string='';
  currency:any;
  darkMode: boolean = false;
  response: boolean = false;

  constructor(private _CurrencyService:CurrencyService,private _ActivatedRoute: ActivatedRoute,private _CartService:CartService,private _Router:Router,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cartId = this._ActivatedRoute.snapshot.params['id'];
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
    this.getCart(this.cartId);
  }

  getCart(cartId:string) {
    this.spinner.show();
    this._CartService.getCart(cartId).subscribe({
      next:(response) => {
        this.response = true;
        if (response.message == 'done') {          
          this.cart = response.cart;    
          this._CurrencyService.currencies.subscribe((res: any) => {
            try {
              this.currency = res[this.cart?.currency];              
            } catch (error) {
              
            }
            
            
          });
          this.spinner.hide();
        }
        else {
          this.spinner.hide();
          this.error = 'Faild to get order'
          this._Router.navigate(["/orders"]);
          this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      error:(error:any)=>{       
        this.response = true; 
        this.spinner.hide();
        this.error = 'Faild to get order'
        this._Router.navigate(["/orders"]);
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
    }
      )
  }

}
