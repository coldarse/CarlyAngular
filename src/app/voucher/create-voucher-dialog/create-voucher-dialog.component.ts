import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';
import { AddOnDto, Principal, PrincipalDto, PrincipalDtoPagedResultDto, PrincipalServiceProxy, VoucherDto, VoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-create-voucher-dialog',
  templateUrl: './create-voucher-dialog.component.html',
  styleUrls: ['./create-voucher-dialog.component.css']
})
export class CreateVoucherDialogComponent extends AppComponentBase
implements OnInit {

  xFreeGift = true;
  xDiscount = true;

  saving = false;
  voucher = new VoucherDto();
  principal : PrincipalDto[] = [];
  addon : AddOnDto[] = [];

  selectAddOn : any ;

  codeExist = false;

  vStartDate;
  vEndDate;

  @Output() onSave = new EventEmitter<any>();

  public voucherForm : FormGroup;

  constructor(
    injector: Injector,
    private _voucherService: VoucherServiceProxy,
    private _principalService: PrincipalServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private calendar: NgbCalendar
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.voucherForm = this._fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      minimum: ['', Validators.required],
      desc: [''],
      startDate: [this.calendar.getToday(), Validators.required],
      endDate: [this.calendar.getToday(), Validators.required],
      enable: [true],
      limit: ['0'],
      type: ['0'],
      discountAmount: ['0'],
      principal: ['0'],
      addon: ['0'],
    });

    this._principalService
      .getAll('', 0, 12345)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result: PrincipalDtoPagedResultDto) => {
        this.principal = result.items;
      });

  }

  onDateSelect1(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "/" + month + "/" + day;
    this.vStartDate = new Date(finalDate);
  }

  onDateSelect2(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "/" + month + "/" + day;
    this.vEndDate = new Date(finalDate);
  }

  setDateFromDatePicker(datepickerdate){
    let year = datepickerdate.year;
    let month = datepickerdate.month <= 9 ? '0' + datepickerdate.month : datepickerdate.month;;
    let day = datepickerdate.day <= 9 ? '0' + datepickerdate.day : datepickerdate.day;;
    let finalDate = year + "/" + month + "/" + day;
    return new Date(finalDate);
  }

  voucherType(event: any){
    if(event.target.value == 'discount'){
      this.xFreeGift = false;
      this.xDiscount = true;
    }
    else if(event.target.value == 'gift'){
      this.xFreeGift = true;
      this.xDiscount = false;
    }
    else{
      this.xFreeGift = true;
      this.xDiscount = true;
    }
  }

  selectedPrincipal(event: any){
    this._principalService
      .getPrincipal(event.target.value)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result: Principal) => {
        this.addon = result.addOns;
      });
  }

  
  save(): void{
    try{
      this.codeExist = false;
      this.saving = true;

      if(this.vStartDate == undefined){
        this.vStartDate = this.setDateFromDatePicker(this.voucherForm.controls.startDate.value);
      }

      if(this.vEndDate == undefined){
        this.vEndDate = this.setDateFromDatePicker(this.voucherForm.controls.endDate.value);
      }


      if(this.voucherForm.controls.type.value == 'gift'){
        this.voucher.name = this.voucherForm.controls.name.value;
        this.voucher.code = this.voucherForm.controls.code.value;
        this.voucher.minAmount = this.voucherForm.controls.minimum.value;
        this.voucher.description = this.voucherForm.controls.desc.value;
        this.voucher.startDate = this.vStartDate;
        this.voucher.stopDate = this.vEndDate;
        this.voucher.limit = this.voucherForm.controls.limit.value;
        this.voucher.type = this.voucherForm.controls.type.value;
        this.voucher.discountAmount = this.voucherForm.controls.discountAmount.value;
        this.voucher.giftId = this.voucherForm.controls.addon.value;
        this.voucher.isGenerated = false;
      }
      else{
        this.voucher.name = this.voucherForm.controls.name.value;
        this.voucher.code = this.voucherForm.controls.code.value;
        this.voucher.minAmount = this.voucherForm.controls.minimum.value;
        this.voucher.description = this.voucherForm.controls.desc.value;
        this.voucher.startDate = this.vStartDate;
        this.voucher.stopDate = this.vEndDate;
        this.voucher.limit = this.voucherForm.controls.limit.value;
        this.voucher.type = this.voucherForm.controls.type.value;
        this.voucher.discountAmount = this.voucherForm.controls.discountAmount.value;
        this.voucher.giftId = 0;
        this.voucher.isGenerated = false;
      }


      this._voucherService
        .createNewVoucher(this.voucher)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe((data: any) => {
          if(data.result == 'true'){
            this.notify.info(this.l('SavedSuccessfully'));
            this.bsModalRef.hide();
            this.onSave.emit();
          }
          else{
            this.codeExist = true;
          }
        });
    }
    catch(error){
      this.saving = false;
      console.log(error.message);
    }
  }

}
