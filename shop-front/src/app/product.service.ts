import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url ='https://mini-store.up.railway.app/products/'
  // url = `http://localhost:3000/products/`

  constructor(private _HttpClient:HttpClient) { }

  getProducts(category:string,size:number,search:string,page:number):Observable<any>{
    return this._HttpClient.get(`${this.url}getAllProduct/?search=${search}&page=${page}&size=${size}&category=${category}`)
  }

  getProduct(productId:string):Observable<any>{
    return this._HttpClient.get(`${this.url}getProduct/${productId}`)
  }

}
