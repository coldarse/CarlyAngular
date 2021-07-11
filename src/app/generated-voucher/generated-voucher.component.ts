import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { GeneratedVoucherDto, GeneratedVoucherDtoPagedResultDto, GeneratedVoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedGeneratedVouchersRequestDto extends PagedRequestDto{
  keyword: string;
}

@Component({
  selector: 'app-generated-voucher',
  templateUrl: './generated-voucher.component.html',
  styleUrls: ['./generated-voucher.component.css']
})
export class GeneratedVoucherComponent extends PagedListingComponentBase<GeneratedVoucherDto> {
  
  keyword = '';
  generatedVouchers: GeneratedVoucherDto[] = [];
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

    this._generatedVoucherService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: GeneratedVoucherDtoPagedResultDto) => {
        this.generatedVouchers = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: GeneratedVoucherDto): void {
    throw new Error('Method not implemented.');
  }


}
