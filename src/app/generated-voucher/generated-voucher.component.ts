import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { GeneratedVoucherDto, GeneratedVoucherDtoPagedResultDto, GeneratedVoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedGeneratedVouchersRequestDto extends PagedRequestDto{
  keyword: string;
  isRedeemed: boolean;
}

@Component({
  selector: 'app-generated-voucher',
  templateUrl: './generated-voucher.component.html',
  styleUrls: ['./generated-voucher.component.css']
})
export class GeneratedVoucherComponent extends PagedListingComponentBase<GeneratedVoucherDto> {
  
  keyword = '';
  isRedeemed: boolean | null;
  unredeemedVouchers: GeneratedVoucherDto[] = [];
  redeemedVouchers: GeneratedVoucherDto[] = [];
  advancedFiltersVisible = false;

  totalRedeemed = 0;
  totalUnredeemed = 0;

  constructor(
    injector: Injector,
    private _generatedVoucherService: GeneratedVoucherServiceProxy,
  ) { 
    super(injector)
  }

  protected list(
    request: PagedGeneratedVouchersRequestDto, 
    pageNumber: number, 
    finishedCallback: Function
    ): void {
      request.keyword = this.keyword;
      request.isRedeemed = this.isRedeemed;

      this._generatedVoucherService
        .getAll(
          request.keyword, 
          request.isRedeemed,
          request.skipCount, 
          request.maxResultCount
          )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result: GeneratedVoucherDtoPagedResultDto) => {
          this.unredeemedVouchers = result.items;
          this.totalUnredeemed = result.totalCount;
          this.showPaging(result, pageNumber);
        });
  }
  protected delete(entity: GeneratedVoucherDto): void {
    throw new Error('Method not implemented.');
  }


}
