import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'https://mini-store.up.railway.app/users/'
  // url = `http://localhost:3000/users/`
  userData = new BehaviorSubject(null);
  headers:any;
  id:any;


  constructor(private _HttpClient: HttpClient,private _Router:Router) { 
    if (localStorage.getItem("userToken")) {
      this.saveUserData();
      this.userData.subscribe((res:any)=>{
        this.id = res?._id
      })
    }
  }

  register(data:FormData):Observable<any>{
    return this._HttpClient.post(`${this.url}register`,data)
  }

  login(data:FormGroup):Observable<any>{
    return this._HttpClient.post(`${this.url}login`,data)
  }

  googleLogin(data:object):Observable<any>{    
    return this._HttpClient.post(`${this.url}google`,data)
  }

  forgetPassword(data:FormGroup):Observable<any>{
    return this._HttpClient.post(`${this.url}resetLink`,data)
  }

  verify(term:string,token:string):Observable<any>{
    return this._HttpClient.get(`${this.url}${term}/${token}`)
  }

  resendVerificationLink(id:string):Observable<any>{
    return this._HttpClient.get(`${this.url}reSend/${id}`)
  }

  updateProfile(data:FormData):Observable<any>{
    this.getToken();
    return this._HttpClient.patch(`${this.url}updateProfile/${this.id}`,data,{headers:this.headers})
  }

  updatePassword(data:FormGroup):Observable<any>{
    this.getToken();
    return this._HttpClient.patch(`${this.url}updatePassword/${this.id}`,data,{headers:this.headers})
  }

  changePassword(data:FormGroup):Observable<any>{
    this.getChangeData();
    return this._HttpClient.patch(`${this.url}changePassword/${this.id}`,data,{headers:this.headers})
  }

  changeSocialPassword(data:FormGroup):Observable<any>{
    this.getToken();
    return this._HttpClient.patch(`${this.url}changePassword/${this.id}`,data,{headers:this.headers})
  }

  saveUserData(){
    let codedUserData = JSON.stringify(localStorage.getItem("userToken"));
    try {
      this.userData.next(jwtDecode(codedUserData));
      this.userData.subscribe((res:any)=>{
        this.id = res?._id
      })
    } catch (error) {      
      localStorage.removeItem("userToken");
      this._Router.navigate(["/login"]);
    }
  }

  getToken(){
    if (localStorage.getItem("userToken")) {
      const token = localStorage.getItem("userToken");
      this.headers = { 'Authorization': `Bearer ${token}` };
    }
  }

  getChangeData(){
    if (localStorage.getItem("changeToken")) {
      const token = localStorage.getItem("changeToken");
      this.headers = { 'Authorization': `Bearer ${token}` };
      let codedUserData = JSON.stringify(localStorage.getItem("changeToken"));
      let decodedUserData:any = jwtDecode(codedUserData);
      this.id = decodedUserData?._id      
    }
  }
}
