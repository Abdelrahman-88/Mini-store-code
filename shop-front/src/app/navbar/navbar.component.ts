import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CurrencyService } from './../currency.service';
import { trigger, style, state, transition, animate, group } from '@angular/animations';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from './../dark-mode.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('500ms ease-in-out', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({transform: 'translateX(100%)'}))
      ])
      
    ]), trigger('fadeInOut', [
      state('in', style({ opacity: 0 })),
      transition(':leave', [
        style({ opacity: 1 }),

        group([
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ opacity: 0 }),

        group([
          animate(300, style({ width: 0 })),
          animate('200ms ease-in-out', style({ 'opacity': '0' }))
        ])

      ]),
      transition(':enter', [
        style({ width: '0', opacity: 0 }),

        group([
          animate(300, style({ width: '*' })),
          animate('400ms ease-in-out', style({ 'opacity': '1' }))
        ])

      ])
    ])
]
})
export class NavbarComponent implements OnInit {

  currencies:any;
  rate:any;
  signs: string[] = ['$', 'د.إ', '¥','€'];
  activeSign:string = '$';
  count: number = 1;
  cart: boolean = false;
  services: any = [];
  total: number = 0;
  show: boolean = false;
  error:any;
  user:any;
  darkMode: boolean = false;
  prefix: string = "https://mini-store.up.railway.app/products/file/";
  profilePrefix: string = "https://mini-store.up.railway.app/users/file/";

  constructor(private _CurrencyService:CurrencyService,private _CartService: CartService,private _AuthService:AuthService,private _Router:Router,private _DarkModeService:DarkModeService) { }

  ngOnInit(): void {
    this.getCurrencies();
    this._CurrencyService.currencies.subscribe((res: any) => {
      this.currencies = res;
    });
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
  }

  activateDarkMode(){
    this.darkMode = !this.darkMode;
    this._DarkModeService.darkMode.next(this.darkMode);
  }

  getCurrencies() {
    this._CurrencyService.getCurrencies().subscribe({
      next:(response) => {
        if (response.message == 'done') {
          this._CurrencyService.currencies.next(response.currency)
        }
        else {
          this.error = 'Faild to get currencies'
        // this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      error:(error:any)=>{
        this.error = 'Faild to get currencies'
        // this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
    }
      )
  }

  getSign(sign:string){
    this.activeSign = sign;
    if (sign== '$') {
      this._CurrencyService.rate.next(this.currencies?.usd)
    }else if (sign== 'د.إ') {
      this._CurrencyService.rate.next(this.currencies?.aed)
    }else if (sign== '¥') {
      this._CurrencyService.rate.next(this.currencies?.jpy)
    }else if (sign== '€') {
      this._CurrencyService.rate.next(this.currencies?.eur)
    }else{
      this.activeSign = '$';
      this._CurrencyService.rate.next(this.currencies?.usd)
    }
  }

  slide() {
    this.show = !this.show
    this.cart = !this.cart
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

  logOut(){
    this._AuthService.userData.next(null);
    localStorage.removeItem("userToken");
    this._Router.navigate(["/login"]);
  }


}
