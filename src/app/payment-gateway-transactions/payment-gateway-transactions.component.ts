import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { IPay88Dto, IPay88DtoPagedResultDto, IPay88ServiceProxy } from '@shared/service-proxies/service-proxies';
import { result } from 'lodash-es';
import { finalize } from 'rxjs/operators';

class PagedPaymentGatewayTransactionsRequestDto extends PagedRequestDto{
  keyword: string;
}

@Component({
  selector: 'app-payment-gateway-transactions',
  templateUrl: './payment-gateway-transactions.component.html',
  styleUrls: ['./payment-gateway-transactions.component.css']
})
export class PaymentGatewayTransactionsComponent extends PagedListingComponentBase<IPay88Dto> {

  keyword = '';
  iPay88: any[] = [];
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _iPay88Service: IPay88ServiceProxy,
  ) {
    super(injector)
  }

  protected list(
    request: PagedPaymentGatewayTransactionsRequestDto,
    pageNumber: number,
    finishedCallback: Function
    ): void {
      request.keyword = this.keyword;

      this._iPay88Service
        .getAll(
          request.keyword,
          request.skipCount,
          request.maxResultCount
        )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result: IPay88DtoPagedResultDto) => {
          this.iPay88 = result.items;
          this.setPayment();
          this.showPaging(result, pageNumber);
        });
  }
  protected delete(entity: IPay88Dto): void {
    throw new Error('Method not implemented.');
  }


  setPayment(){
    this.iPay88.forEach((element: any) => {
      if(element.paymentId == 6){
        element.paymentId = 'Maybank2U';
      }
      else if(element.paymentId == 8){
        element.paymentId = 'Alliance Online (Personal)';
      }
      else if(element.paymentId == 10){
        element.paymentId = 'AmBank';
      }
      else if(element.paymentId == 14){
        element.paymentId = 'RHB Bank';
      }
      else if(element.paymentId == 15){
        element.paymentId = 'Hong Leong Bank';
      }
      else if(element.paymentId == 20){
        element.paymentId = 'CIMB Clicks';
      }
      else if(element.paymentId == 31){
        element.paymentId = 'Public Bank';
      }
      else if(element.paymentId == 102){
        element.paymentId = 'Bank Rakyat';
      }
      else if(element.paymentId == 103){
        element.paymentId = 'Affin Bank';
      }
      else if(element.paymentId == 122){
        element.paymentId = 'Pay4Me (Delay Payment)';
      }
      else if(element.paymentId == 124){
        element.paymentId = 'BSN';
      }
      else if(element.paymentId == 134){
        element.paymentId = 'Bank Islam';
      }
      else if(element.paymentId == 152){
        element.paymentId = 'UOB Bank';
      }
      else if(element.paymentId == 166){
        element.paymentId = 'Bank Muamalat';
      }
      else if(element.paymentId == 167){
        element.paymentId = 'OCBC Bank';
      }
      else if(element.paymentId == 168){
        element.paymentId = 'Standard Chartered Bank';
      }
      else if(element.paymentId == 178){
        element.paymentId = 'Maybank2E';
      }
      else if(element.paymentId == 198){
        element.paymentId = 'HSBC Bank';
      }
      else if(element.paymentId == 199){
        element.paymentId = 'Kuwait Finance House';
      }
      else if(element.paymentId == 405){
        element.paymentId = 'Agro bank';
      }
      else if(element.paymentId == 18){
        element.paymentId = 'China UnionPay Online Banking (MYR)';
      }
      else if(element.paymentId == 2){
        element.paymentId = 'Creidt Card (MYR)';
      }
      else if(element.paymentId == 55){
        element.paymentId = 'Credit Card (MYR) Pre-Auth';
      }
      else if(element.paymentId == 111){
        element.paymentId = 'Public Bank EPP (Instalment Payment)';
      }
      else if(element.paymentId == 112){
        element.paymentId = 'Maybank EzyPay (Visa/Mastercard Instalment Payment)';
      }
      else if(element.paymentId == 115){
        element.paymentId = 'Maybank EzyPay (AMEX Instalment Payment)';
      }
      else if(element.paymentId == 157){
        element.paymentId = 'HSBC (Instalment Payment)';
      }
      else if(element.paymentId == 174){
        element.paymentId = 'CIMB Easy Pay (Instalment Payment)';
      }
      else if(element.paymentId == 179){
        element.paymentId = 'Hong Leong Bank EPP-MIGS (Instalment Payment)';
      }
      else if(element.paymentId == 430){
        element.paymentId = 'OCBC Instalment';
      }
      else if(element.paymentId == 433){
        element.paymentId = 'Hong Leong Bank EPP-MPGS (Instalment Payment)';
      }
      else if(element.paymentId == 534){
        element.paymentId = 'RHB (Instalment Payment)';
      }
      else if(element.paymentId == 606){
        element.paymentId = 'Ambank EPP';
      }
      else if(element.paymentId == 727){
        element.paymentId = 'Standard Chartered Bank Instalment';
      }
      else if(element.paymentId == 22){
        element.paymentId = 'Kiple Online';
      }
      else if(element.paymentId == 48){
        element.paymentId = 'PayPal (MYR)';
      }
      else if(element.paymentId == 210){
        element.paymentId = 'Boost Wallet Online';
      }
      else if(element.paymentId == 244){
        element.paymentId = 'MCash';
      }
      else if(element.paymentId == 382){
        element.paymentId = 'NETS QR Online';
      }
      else if(element.paymentId == 523){
        element.paymentId = 'GrabPay Online';
      }
      else if(element.paymentId == 538){
        element.paymentId = "Touch 'n Go eWallet";
      }
      else if(element.paymentId == 542){
        element.paymentId = 'Maybank PayQR Online';
      }
      else if(element.paymentId == 801){
        element.paymentId = 'ShopeePay Online';
      }
      else if(element.paymentId == 890){
        element.paymentId = 'BNPL MobyPay';
      }
    });
  }

}
