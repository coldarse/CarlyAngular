import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CustomerPrincipalDto, PackageDto, PackageServiceProxy, PrincipalDto, SaleDto, SaleDtoPagedResultDto, SaleServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedSalesRequestDto extends PagedRequestDto{
  keyword: string;
}

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent extends PagedListingComponentBase<SaleDto> {

  keyword = "";
  sales: SaleDto[];
  packages: PackageDto[];
  advancedFiltersVisible = false;

  salesTable: any = [];
  backupSalesTable: any = [];

  constructor(
    injector: Injector,
    private _saleService: SaleServiceProxy,
    private _packageService: PackageServiceProxy,
  ) { 
    super(injector)
  }

  protected list(
    request: PagedSalesRequestDto, 
    pageNumber: number, 
    finishedCallback: Function
    ): void {
      request.keyword = this.keyword;

      this._saleService
        .getAllSale()
        .subscribe((result: SaleDto[]) => {
          this.sales = result;
          this.salesTable = [];
          this.backupSalesTable = [];
          console.log(this.sales);
          //this.showPaging(result, pageNumber);
          this.isTableLoading = true;
          this._packageService.getAllPackage()
            .subscribe((res: PackageDto[]) => {
              this.packages = res;
              let idcount = 1;
              this.sales.forEach((elem: SaleDto) => {
                this.packages.forEach((element: PackageDto) => {
                  if(elem.package == element.id){
                    let tempprincipal = "";
                    element.principals.forEach((x: CustomerPrincipalDto) => {
                      if(x.id == elem.selectedPrincipal){
                        tempprincipal = x.name;
                      }
                    })

                    let tempAddress = 
                      elem.address1 + ", " +
                      elem.address2 + ", " + 
                      elem.postcode + ", " + 
                      elem.city + ", " + 
                      elem.state

                    this.salesTable.push({
                      'Id': idcount,
                      'Name': element.ownerName,
                      'NRIC': element.ownerNRIC,
                      'VehicleReg': element.vehicleRegNo,
                      'Email': element.ownerEmail,
                      'Phone': element.ownerPhoneNo,
                      'Address': tempAddress,
                      'Principal': tempprincipal,
                      'AddOns': elem.selectedAddOns,
                      'Premium': elem.premium,
                      'TransactionDate': elem.transactionDateTime,
                    });

                    this.backupSalesTable = this.salesTable;

                    idcount += 1;
                  }
                });
              });

              this.isTableLoading = false;
              finalize(() => {
                finishedCallback();
              })
            })
        });
  }
  protected delete(entity: SaleDto): void {
    throw new Error('Method not implemented.');
  }

  search(){
    if(this.keyword != ""){
      this.salesTable = [];

      this.backupSalesTable.forEach((element: any) => {
        if(element.VehicleReg.toLowerCase().includes(this.keyword.toLowerCase())){
          console.log(element);
          this.salesTable.push(element);
        }
      });

      if(this.salesTable.length == 0){
        this.salesTable = this.backupSalesTable;
      }
    }
    else{
      this.salesTable = this.backupSalesTable;
    }
    
  }

}
