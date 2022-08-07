import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  url ='https://ministore1.herokuapp.com/currency/'
  currencies =new BehaviorSubject(null);
  rate =new BehaviorSubject({sign: '$', rate: 1,code:'usd'});

  constructor(private _HttpClient:HttpClient) { }

  getCurrencies():Observable<any>{
    return this._HttpClient.get(`${this.url}getCurrency`)
  }
}
