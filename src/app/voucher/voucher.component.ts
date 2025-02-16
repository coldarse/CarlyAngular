import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PrincipalDtoPagedResultDto, VoucherDto, VoucherDtoPagedResultDto, VoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateVoucherDialogComponent } from './create-voucher-dialog/create-voucher-dialog.component';
import { EditVoucherDialogComponent } from './edit-voucher-dialog/edit-voucher-dialog.component';


class PagedVouchersRequestDto extends PagedRequestDto{
  keyword: string;
}

@Component({
  templateUrl: './voucher.component.html',
  animations: [appModuleAnimation()]
})
export class VoucherComponent extends PagedListingComponentBase<VoucherDto> {

  vouchers: VoucherDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _vouchersService: VoucherServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }


  list(
    request: PagedVouchersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void{
    request.keyword = this.keyword;

    this._vouchersService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: VoucherDtoPagedResultDto) => {
        this.vouchers = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(voucher: VoucherDto): void {
    abp.message.confirm(
      this.l('VoucherDeleteWarningMessage', voucher.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._vouchersService
            .delete(voucher.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  generate(voucher: VoucherDto): void {
    this._vouchersService.generateVouchers(voucher.id)
    .pipe(
      finalize(() => {
      })
    ).subscribe((data: any) => {
      if(data == true){
        abp.notify.success(this.l('SuccessfullyGenerated'));
        this.refresh();
      }
    });
  }

  createVoucher(): void {
    this.showCreateOrEditVoucherDialog();
  }

  editVoucher(voucher: VoucherDto): void {
    this.showCreateOrEditVoucherDialog(voucher.id);
  }

  showCreateOrEditVoucherDialog(id?: number): void {
    let createOrEditVouchertDialog: BsModalRef;
    if (!id) {
      createOrEditVouchertDialog = this._modalService.show(
        CreateVoucherDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    }
    else {
      createOrEditVouchertDialog = this._modalService.show(
        EditVoucherDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditVouchertDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

}
