import { Component, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { VoucherDto, VoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { EventEmitter } from 'events';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-create-voucher-dialog',
  templateUrl: './create-voucher-dialog.component.html',
  styleUrls: ['./create-voucher-dialog.component.css']
})
export class CreateVoucherDialogComponent extends AppComponentBase
  implements OnInit {


  saving = false;
  voucher = new VoucherDto();

  // @Output() onSave = new EventEmitter<any>();

  public voucherForm : FormGroup;

  constructor(
    injector: Injector,
    private _voucherService: VoucherServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.voucherForm = this._fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      minimum: ['', Validators.required],
      desc: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      enable: [true],
      limit: ['0'],
      type: ['0'],
      discountAmount: ['0'],
      principal: ['0'],
      addon: ['0'],
    });
  }

  save(): void{
    try{
      this.saving = true;

      this.voucher = this.voucherForm.value;

      this._voucherService
        .create(this.voucher)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
        })
    }
    catch(error){
      this.saving = false;
      console.log(error.message);
    }
  }

}
