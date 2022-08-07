import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url = 'https://ministore1.herokuapp.com/cart/'

  headers:any;
  id:any;

  cartData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private _HttpClient: HttpClient,private _AuthService:AuthService) {
    if (localStorage.getItem("cartData") != null) {
      this.getCartData();
    }
  }

  saveCartData() {
    localStorage.setItem("cartData", JSON.stringify(this.cartData.value))
  }

  getCartData() {
    this.cartData.next(JSON.parse(localStorage.getItem("cartData")!))
  }

  addCart(data:FormData):Observable<any>{
    this.getToken();
    return this._HttpClient.post(`${this.url}addCart/${this.id}`,data,{headers:this.headers})
  }

  getAllUserCart(status:string,size:number,page:number,sort:number):Observable<any>{
    this.getToken();
    return this._HttpClient.get(`${this.url}getAllUserCart/${this.id}/?page=${page}&size=${size}&status=${status}&sort=${sort}`,{headers:this.headers})
  }

  getCart(cartId:string):Observable<any>{
    this.getToken();
    return this._HttpClient.get(`${this.url}getCart/${cartId}`,{headers:this.headers})
  }


  getToken(){
    if (localStorage.getItem("userToken")) {
      const token = localStorage.getItem("userToken");
      this.headers = { 'Authorization': `Bearer ${token}` };
      this._AuthService.userData.subscribe((res:any)=>{
        this.id = res?._id
      })
    }
  }
}
