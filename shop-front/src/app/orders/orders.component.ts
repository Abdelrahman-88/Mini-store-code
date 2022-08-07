import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../dark-mode.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  terms: string = "";
  orders: any[] = [];
  totalPages: number = 1;
  visablePages: any[] = [];
  currentPage: number = 1;
  lastPageLength:number = 0;
  statuses: string[] = ['all','open', 'pending', 'closed'];
  status:string = ''
  sizeArray: number[] = [5, 10, 15];
  size:number = 10;
  sort:number = -1;
  darkMode: boolean = false;
  response: boolean = false;

  constructor(private _CartService:CartService,private toastr: ToastrService,private _DarkModeService:DarkModeService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllUserCart(1);
    this._DarkModeService.darkMode.subscribe((res:any)=>{
      this.darkMode = res;
    })
  }

  getSize(size:any) {
    const regex = new RegExp(/^(5|10|15){1}$/);
    if (regex.test(size)) {
      this.size = size;
      this.getAllUserCart(1);
    }
    else {
      this.toastr.error(`Error invalid input`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

  getStatus(status:any) {
    const regex = new RegExp(/^(all|open|pending|closed){1}$/);
    if (regex.test(status)) {
      if (status == 'all') {
        this.status = '';
      }else{
        this.status = status;
      }
      this.getAllUserCart(1);
    }
    else {
      this.toastr.error(`Error invalid input`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

  getSort(){
    if (this.sort == -1) {
      this.sort = 1;
    } else {
      this.sort = -1;
    }
    this.getAllUserCart(1);
  }

  getAllUserCart(page:number) {
    this.currentPage = page;
    this.spinner.show();
    this._CartService.getAllUserCart(this.status,this.size,page,this.sort).subscribe({
      next:(response) => {
        this.response = true;
        if (response.message == 'done') {                    
          this.orders = response.data;
          this.totalPages = response.totalPages;        
          this.lastPageLength = response.total % response.limit
          this.setPages();
          this.spinner.hide();
        }
        else if (response.message == 'No carts found') {
          this.orders = [];
          this.spinner.hide();
          this.toastr.error('No orders found', "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
        else {
          this.spinner.hide();
          this.orders = [];
          this.toastr.error(`Faild to get orders`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      error:(error:any)=>{    
        this.response = true;    
        if (error.error.message == 'No carts found') {
          this.orders = [];
          this.spinner.hide();
          this.toastr.error('No orders found', "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }else{
          this.spinner.hide();
          this.toastr.error(`Faild to get orders`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
        }
    }
      )
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
      this.getAllUserCart(this.currentPage + 1);
    }
    else if (term == "prev" && this.visablePages[0] > 1) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]-- })
      this.getAllUserCart(this.currentPage - 1);
    }
    else if (term == "prev" && this.currentPage > 1) {
      this.getAllUserCart(this.currentPage - 1);
    }
    else if (term == "next" && this.currentPage < this.totalPages) {
      this.getAllUserCart(this.currentPage + 1);
    }
  }

  getCurrentPage(page: number) {
    this.currentPage = page;
    this.getAllUserCart(page);
  }

  getLastPage(term: string) {
    if (term == "last") {
      if (this.totalPages == 1) {
        this.visablePages = [1];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [1, 2];
      }
      else {
        this.visablePages = [this.totalPages - 2, this.totalPages - 1, this.totalPages];
      }
      this.getAllUserCart(this.totalPages);
    }
    else if (term == "first") {
      if (this.totalPages == 1) {
        this.visablePages = [1];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [1, 2];
      }
      else {
        this.visablePages = [1, 2, 3];
      }
      this.getAllUserCart(1);
    }
  }



}
