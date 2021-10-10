import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CustomerPrincipalDto, IPay88Dto, IPay88ServiceProxy, PackageDto, PackageServiceProxy, PrincipalDto, SaleDto, SaleDtoPagedResultDto, SaleServiceProxy } from '@shared/service-proxies/service-proxies';
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
  iPay88s: IPay88Dto[];
  advancedFiltersVisible = false;

  salesTable: any = [];
  backupSalesTable: any = [];

  constructor(
    injector: Injector,
    private _saleService: SaleServiceProxy,
    private _packageService: PackageServiceProxy,
    private _iPay88Service: IPay88ServiceProxy,
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
          this.isTableLoading = true;
          this._packageService.getAllPackage()
            .subscribe((res: PackageDto[]) => {
              this.packages = res;
              this._iPay88Service.getAlliPay88()
                .subscribe((iresult: IPay88Dto[]) => {
                  this.iPay88s = iresult;
                  this.sales.forEach((elem: SaleDto) => {
                    this.packages.forEach((element: PackageDto) => {
                      if(elem.package == element.id){
                        let refNo = 'INV' + element.id.toString().padStart(5, '0');
                        this.iPay88s.forEach((ielem: IPay88Dto) => {
                          if(ielem.refNo == refNo){
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
                              'Id': element.id,
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
                              'ClaimedVoucher': elem.claimedVoucher,
                              'Policy': element.coveragePeriod,
                              'Invoice': ielem.refNo,
                              'TransactionId': ielem.transId,
                              'Status': ielem.status == "1"? 'Paid' : 'Failed',
                              'CCName': ielem.ccName,
                              'CCNo': ielem.ccNo,
                            });

                            this.backupSalesTable = this.salesTable;
                          }
                        })
                      }
                    });
                  });

                  this.isTableLoading = false;
                  finalize(() => {
                    finishedCallback();
                  })
                });
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
