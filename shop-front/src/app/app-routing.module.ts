import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeSocialPasswordComponent } from './change-social-password/change-social-password.component';
import { ChangeGuard } from './change.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ResendLinkComponent } from './resend-link/resend-link.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "productDetails/:id", component: ProductDetailsComponent },
  { path: "login", canActivate:[LoginGuard], component: LoginComponent },
  { path: "resend", canActivate:[AuthGuard], component: ResendLinkComponent },
  { path: "register", canActivate:[LoginGuard], component: RegisterComponent },
  { path: "cart", canActivate:[AuthGuard], component: CartComponent },
  { path: "profile", canActivate:[AuthGuard], component: ProfileComponent },
  { path: "updateProfile", canActivate:[AuthGuard], component: UpdateProfileComponent },
  { path: "updatePassword", canActivate:[AuthGuard], component: UpdatePasswordComponent },
  { path: "verify/:term/:token", canActivate:[LoginGuard], component: VerifyComponent },
  { path: "forgetPassword", canActivate:[LoginGuard], component: ForgetPasswordComponent },
  { path: "changePassword", canActivate:[ChangeGuard] , component: ChangePasswordComponent },
  { path: "changeSocialPassword", canActivate:[AuthGuard], component: ChangeSocialPasswordComponent },
  { path: "orders", canActivate:[AuthGuard], component: OrdersComponent },
  { path: "orderDetails/:id", canActivate:[AuthGuard], component: OrderDetailsComponent },
  {path:"**" , component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
