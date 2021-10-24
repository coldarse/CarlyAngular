import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';
import { PrincipalComponent } from './principal/principal.component';
import { VoucherComponent } from './voucher/voucher.component';
import { AddOnServiceProxy, CustomerAddOnServiceProxy, CustomerPrincipalServiceProxy, GeneratedVoucherServiceProxy, IPay88ServiceProxy, LogoLinkServiceProxy, PackageServiceProxy, PrincipalServiceProxy, SaleServiceProxy, VoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreatePrincipalDialogComponent } from './principal/create-principal-dialog/create-principal-dialog.component';
import { EditPrincipalDialogComponent } from './principal/edit-principal-dialog/edit-principal-dialog.component';
import { CreateVoucherDialogComponent } from './voucher/create-voucher-dialog/create-voucher-dialog.component';
import { EditVoucherDialogComponent } from './voucher/edit-voucher-dialog/edit-voucher-dialog.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { PackageComponent } from './package/package.component';
import { CreatePackageDialogComponent } from './package/create-package-dialog/create-package-dialog.component';
import { EditPackageDialogComponent } from './package/edit-package-dialog/edit-package-dialog.component';
import { AddPackagePrincipalComponent } from './package/add-package-principal/add-package-principal.component';
import { EditPackagePrincipalComponent } from './package/edit-package-principal/edit-package-principal.component';

import { AddOnChecked } from './model/AddOnChecked';
import { GeneratedVoucherComponent } from './generated-voucher/generated-voucher.component';
import { GenerateLinkDialogComponent } from './package/generate-link-dialog/generate-link-dialog.component';
import { GenerateEmailDialogComponent } from './package/generate-email-dialog/generate-email-dialog.component'
import { ClipboardModule } from 'ngx-clipboard';
import { SaleComponent } from './sale/sale.component';
import { PaymentGatewayTransactionsComponent } from './payment-gateway-transactions/payment-gateway-transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
    PrincipalComponent,
    VoucherComponent,
    CreatePrincipalDialogComponent,
    EditPrincipalDialogComponent,
    CreateVoucherDialogComponent,
    EditVoucherDialogComponent,
    PackageComponent,
    CreatePackageDialogComponent,
    EditPackageDialogComponent,
    AddPackagePrincipalComponent,
    EditPackagePrincipalComponent,
    GeneratedVoucherComponent,
    GenerateLinkDialogComponent,
    GenerateEmailDialogComponent,
    SaleComponent,
    PaymentGatewayTransactionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    NgbDatepickerModule,
    ClipboardModule,
  ],
  providers: [
    PrincipalServiceProxy,
    VoucherServiceProxy,
    AddOnServiceProxy,
    PackageServiceProxy,
    CustomerPrincipalServiceProxy,
    CustomerAddOnServiceProxy,
    AddOnChecked,
    GeneratedVoucherServiceProxy,
    SaleServiceProxy,
    LogoLinkServiceProxy,
    IPay88ServiceProxy,
  ],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
  ],
})
export class AppModule {}
