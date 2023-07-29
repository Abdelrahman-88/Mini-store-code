import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart.service';
import { CurrencyService } from '../currency.service';
import { DarkModeService } from '../dark-mode.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 10,
    dots: false,
    navSpeed: 800,
    navText: ['', ''],
    nav: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 8000,
    autoplaySpeed: 5000,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      },
      1440: {
        items: 1
      },
      2640: {
        items: 1
      }
    }
  }

  public ngAfterViewInit(): void {window.dispatchEvent(new Event('resize'));}

  productId:string='';
  product:any={};
  error:string='';
  rate:any;
  src:string='';
  active:number=0;
  owl:boolean=false;
  darkMode: boolean = false;
  prefix: string = "https://mini-store.up.railway.app/products/file/";

  constructor(private _ProductService:ProductService,private _ActivatedRoute: ActivatedRoute,private _Router:Router,private _CurrencyService:CurrencyService,private _CartService:CartService,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.params['id'];
    this.getProduct(this.productId);
    this._CurrencyService.rate.subscribe((res: any) => {
      this.rate = res;      
    });
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  @HostListener("window:resize", [])
  onResize() {
    var width = window.innerWidth;
    this.owl = width < 1024;
  }

  getProduct(productId:string) {
    this.spinner.show();
    this._ProductService.getProduct(productId).subscribe({
      next:(response) => {
        if (response.message == 'done') {          
          this.product = response.product;          
          this.spinner.hide();
        }
        else {
          this.spinner.hide();
          this.error = 'Faild to get product'
          this._Router.navigate(["/home"]);
          this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      error:(error:any)=>{
        this.spinner.hide();
        this.error = 'Faild to get product'
        this._Router.navigate(["/home"]);
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});

        }
    }
      )
  }

  addToCart(product:any) {
    let newCart: any = {
      serviceId: product?._id,
      quantity: 1,
      name: product?.name,
      price: product?.price,
      total: product?.price,
      poster:product?.poster
    }
    if (localStorage.getItem("cartData") != null) {
      let add = true;
      this._CartService.getCartData();
      this._CartService.cartData.value.find((cart: any) => {
        if (cart.serviceId == newCart.serviceId) {
          add = false;
          this.toastr.error(`Already added to cart`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
        }
      })
      if (add) {
        this._CartService.cartData.next([...this._CartService.cartData.value, newCart])
        this.toastr.success(`Added to cart successfully`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      }
    } else {
      this._CartService.cartData.next([newCart])
      this.toastr.success(`Added to cart successfully`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
    this._CartService.saveCartData();
    this._CartService.getCartData();
  }

  changeImg(event:any,index:number){
    this.active = index
    this.src = event.target.src;    
  }


}
