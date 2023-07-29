import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { CurrencyService } from '../currency.service';
import { DarkModeService } from '../dark-mode.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  paymentHandler: any = null;
  publishablekey='pk_test_51LLXgWLU7APQD4WNDky9kkkj0Z8EJwwwBXKvYw1nxtC1zNnIATOJhC8XgFitAElSaCSW9C4XuQWGf2t4yCxseOKx00I1zupbBt'
  currencies:any;
  rate:any;
  count: number = 1;
  services: any = [];
  total: number = 0;
  error:any;
  user:any;
  darkMode: boolean = false;
  prefix: string = "https://mini-store.up.railway.app/products/file/";

  cartForm: FormGroup = new FormGroup({
    "contactNumber": new FormControl(null, [Validators.required,Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)]),
    "shippingAddress": new FormControl(null, [Validators.required,Validators.pattern(/^[0-9a-zA-Z\s\r\n]+$/)]),
    "payment": new FormControl(null, [Validators.required,Validators.pattern(/^(cash|card){1}$/)]),
    "currency": new FormControl(null),
    "products": new FormControl(null),
    "email": new FormControl(null)
  })

  constructor(private _CurrencyService:CurrencyService,private _CartService: CartService,private _AuthService: AuthService,private _Router: Router, private toastr: ToastrService,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this._CurrencyService.rate.subscribe((res: any) => {
      this.rate = res;
    });
    this._AuthService.userData.subscribe((res:any)=>{
      this.user = res
    })
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
    this.getCartData();
    this.invokeStripe();
  }

  
  getCartData() {
    this._CartService.getCartData();
    this._CartService.cartData.subscribe((res) => {
      if (res) {
        this.services = res;
      }

    });
    this.getTotal();
  }

  counter(id: any, term: any) {
    this._CartService.getCartData();
      this._CartService.cartData.value.find((cart: any) => {
        if (cart.serviceId == id) {
          if (term == 1) {
            cart.quantity++
          } else {
            if (cart.quantity > 1) {
              cart.quantity--
            }
          }
          cart.total = cart.price * cart.quantity;
        }
      })
      this._CartService.saveCartData();
      this.getCartData();
  }

  removeFromCart(id: any) {
    this._CartService.getCartData();
    this._CartService.cartData.next(this._CartService.cartData.value.filter((cart: any) => {
      if (cart.serviceId != id) {
        return cart;
      }
    }))
    this._CartService.saveCartData();
    this.getCartData();
    this.clearLocal();
  }

  getTotal() {
    this.total = 0
    this.services.map((ser: any) => {
      this.total += ser.total
    })
  }

  clearLocal() {
    if (!this.services.length) {
      localStorage.removeItem("cartData");
    }
  }

  setData(cartForm: FormGroup){    
    if (cartForm.valid) {
      this.getCartData();
      let data = this.services.map((value: any) => {
      const { serviceId, quantity } = value;
      return {product:serviceId,quantity}
    })
    this.cartForm.patchValue({
      currency: this.rate?.code, 
      products: data
    });  
    
      this.makePayment();
    } else {
      this.toastr.error(`Invalid inputs`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    }
    
  }

  makePayment() {
    if (this.cartForm.get('payment')?.value == 'card') {
      let amount = this.total*this.rate?.rate;
      let convert:any;
      if (this.rate?.code == 'jpy') {
        convert = (amount).toFixed(0)
      }else{
        convert = (amount*100).toFixed(2)
      }
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: this.publishablekey,
        locale: 'auto',
        token: (stripeToken: any)=> {
          this.paymentstripe(stripeToken?.email);
        },
      });
      paymentHandler.open({
        name: 'Test payment',
        description: 'Test card 4242 4242 4242 4242',
        amount: convert,
        currency:this.rate?.code
      });
    } else {
      this.paymentstripe(this.user?.email);
    }
  }

  paymentstripe(email:string) {
    this.spinner.show();   
    this.cartForm.patchValue({
      email: email
    });   
    this._CartService.addCart(this.cartForm.value).subscribe({next:(response: any) => {
      if (response.message === "Cart added successfully") {
        this.spinner.hide();
        localStorage.removeItem("cartData");
        this._CartService.cartData.next([]);
        if (this.cartForm.get('payment')?.value == 'card') {
          this.toastr.success('Your Payment completed successfully', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
        } else {
          this.toastr.success('Order submitted successfully', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
        }
        this._Router.navigate(["/orders"]);
      }
      else {
        this.spinner.hide();
        if (this.cartForm.get('payment')?.value == 'card') {
          this.toastr.error(`Some Error is taken place inside the payment`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
        } else {
          this.toastr.error(`Faild to add cart`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
        }
      }
    },
    error:(error:any)=>{                         
      this.spinner.hide();        
      if (this.cartForm.get('payment')?.value == 'card') {
        this.toastr.error(`Some Error is taken place inside the payment`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      } else {
        this.toastr.error(`Faild to add cart`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      }    }});
  };

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.publishablekey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }


}
