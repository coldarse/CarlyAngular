import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { PrincipalComponent } from './principal/principal.component';
import { VoucherComponent } from './voucher/voucher.component';
import { PackageComponent } from './package/package.component';
import { GeneratedVoucherComponent } from './generated-voucher/generated-voucher.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'principal', component: PrincipalComponent, data: { permission: 'Pages.Principals' }, canActivate: [AppRouteGuard] },
                    { path: 'voucher', component: VoucherComponent, data: { permission: 'Pages.Vouchers' }, canActivate: [AppRouteGuard] },
                    { path: 'package', component: PackageComponent, data: { permission: 'Pages.Packages' }, canActivate: [AppRouteGuard] },
                    { path: 'generatedVouchers', component: GeneratedVoucherComponent, data: { permission: 'Pages.GeneratedVouchers' }, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
