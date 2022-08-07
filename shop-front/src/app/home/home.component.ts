import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './../product.service';
import { CurrencyService } from './../currency.service';
import { CartService } from '../cart.service';
import { DarkModeService } from '../dark-mode.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  terms: string = "";
  products: any[] = [];
  totalPages: number = 1;
  visablePages: any[] = [];
  currentPage: number = 1;
  lastPageLength:number = 0;
  spin:boolean = false;
  categories: string[] = ['all','mobile','fashion','game','computer','accessories'];
  category:string = ''
  sizeArray: number[] = [5, 10, 15];
  size:number = 10;
  rate:any;
  active:number=0;
  darkMode: boolean = false;
  response: boolean = false;

  searchForm: FormGroup = new FormGroup({
    "term": new FormControl(null, [Validators.pattern(/^[0-9a-zA-Z ]+$/)])
  })

  constructor(private _ProductService:ProductService,private _CurrencyService:CurrencyService,private _CartService:CartService,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getProducts(1);
    this._CurrencyService.rate.subscribe((res: any) => {
      this.rate = res;
    });
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  search(searchForm: FormGroup) {
    if (searchForm.valid) {
      this.spin = true
      this.terms = searchForm.controls['term'].value;
      this.getProducts(1)
    }
    else {
      this.toastr.error(`Error invalid input!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }

  }

  getSize(size:any) {
    const regex = new RegExp(/^(5|10|15){1}$/);
    if (regex.test(size)) {
      this.size = size;
      this.spinner.show();
      this.getProducts(1)
    }
    else {
      this.toastr.error(`Error invalid input!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

  getCategory(event:any,index:number){
    this.active = index
    let category = event.target.innerText.toLowerCase();   
    let regex = new RegExp(/^(all|mobile|fashion|game|computer|accessories){1}$/);
    if (regex.test(category)) {
      if (category == 'all') {
        this.category = '';
      } else {
        this.category = category
      }
      this.spinner.show();
      this.getProducts(1)
    } else{
      this.toastr.error(`Error invalid input!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

  
  getProducts(page:number) {
    this.currentPage = page;
    this._ProductService.getProducts(this.category, this.size,this.terms,page).subscribe({
      next:(response) => {
        this.response = true;
        if (response.message == 'done') {          
          this.products = response.data;
          this.totalPages = response.totalPages;        
          this.lastPageLength = response.total % response.limit
          this.setPages();
          this.spin = false
          this.spinner.hide();
        }
        else if (response.message == 'No products found') {
          this.products = [];
          this.spin = false
          this.spinner.hide();
        }
        else {
          this.spinner.hide();
          this.spin = false
        }
      },
      error:(error:any)=>{
        this.response = true;
        if (error.error.message == 'No products found') {
          this.products = [];
          this.spinner.hide();
          this.spin = false
        }else{
          this.spinner.hide();
          this.spin = false
          this.toastr.error(`Faild to get products`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
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

   // pagination
   setPages() {
    if (this.currentPage == 1) {
      if (this.totalPages == 1) {
        this.visablePages = [this.totalPages];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [this.totalPages - 1, this.totalPages];
      }
      else {
        this.visablePages = [1, 2, 3];
      }
    } else if (this.currentPage > 1 && this.currentPage <= this.totalPages - 2) {
      this.visablePages = [this.currentPage, this.currentPage + 1, this.currentPage + 2];
    } else if (this.currentPage > 1 && this.currentPage == this.totalPages - 1) {
      this.visablePages = [this.currentPage - 1, this.currentPage, this.currentPage + 1];
    } else if (this.currentPage > 2 && this.currentPage == this.totalPages) {
      this.visablePages = [this.currentPage - 2, this.currentPage - 1, this.currentPage];
    }
  }

  changePage(term: any) {
    if (term == "next" && this.visablePages.includes(this.totalPages) == false) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]++ });
      this.spinner.show();
      this.getProducts(this.currentPage + 1);
    }
    else if (term == "prev" && this.visablePages[0] > 1) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]-- })
      this.spinner.show();
      this.getProducts(this.currentPage - 1);
    }
    else if (term == "prev" && this.currentPage > 1) {
      this.spinner.show();
      this.getProducts(this.currentPage - 1);
    }
    else if (term == "next" && this.currentPage < this.totalPages) {
      this.spinner.show();
      this.getProducts(this.currentPage + 1);
    }
  }

  getCurrentPage(page: number) {
    this.spinner.show();
    this.currentPage = page;
    this.getProducts(page);
  }

  getLastPage(term: string) {
    if (term == "last") {
      this.spinner.show();
      if (this.totalPages == 1) {
        this.visablePages = [1];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [1, 2];
      }
      else {
        this.visablePages = [this.totalPages - 2, this.totalPages - 1, this.totalPages];
      }
      this.getProducts(this.totalPages);
    }
    else if (term == "first") {
      this.spinner.show();
      if (this.totalPages == 1) {
        this.visablePages = [1];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [1, 2];
      }
      else {
        this.visablePages = [1, 2, 3];
      }
      this.getProducts(1);
    }
  }


}
