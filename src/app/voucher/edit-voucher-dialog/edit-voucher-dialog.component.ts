import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';
import { AddOnDto, AddOnServiceProxy, Principal, PrincipalDto, PrincipalDtoPagedResultDto, PrincipalServiceProxy, VoucherDto, VoucherServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './edit-voucher-dialog.component.html'
})
export class EditVoucherDialogComponent extends AppComponentBase
 implements OnInit {

  saving = false;
  voucher : VoucherDto = new VoucherDto();
  id: number;

  vStartDate;
  vEndDate;

  xFreeGift = true;
  xDiscount = true;
  principal : PrincipalDto[] = [];
  addon : AddOnDto[] = [];

  editVoucherVisible = false;


  editAddOn: any;
  editPrincipal: any;

  @Output() onSave = new EventEmitter<any>();

  public voucherForm : FormGroup;

  constructor(
    injector: Injector,
    private _voucherService: VoucherServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private calendar: NgbCalendar,
    private _principalService: PrincipalServiceProxy,
    private _addonService: AddOnServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this._voucherService
      .get(this.id)
      .subscribe((result: any) => {
        this.voucher = result;

        let year1 = new Date(this.voucher.startDate.toDate()).getFullYear();
        let year2 = new Date(this.voucher.stopDate.toDate()).getFullYear();
        let month1 = new Date(this.voucher.startDate.toDate()).getMonth() + 1;
        let month2 = new Date(this.voucher.stopDate.toDate()).getMonth() + 1;
        let day1 = new Date(this.voucher.startDate.toDate()).getDate();
        let day2 = new Date(this.voucher.stopDate.toDate()).getDate();

        let tempStartDate = {year: year1, month: month1, day: day1};
        let tempStopDate = {year: year2, month: month2, day: day2};
     
        if(this.voucher.giftId == 0){

          this.xFreeGift = false;
          this.xDiscount = true;
          

          this.voucherForm = this._fb.group({
            name: [this.voucher.name, Validators.required],
            code: [this.voucher.code, Validators.required],
            minimum: [this.voucher.minAmount, Validators.required],
            desc: [this.voucher.description],
            startDate: [tempStartDate, Validators.required],
            endDate: [tempStopDate, Validators.required],
            enable: [true],
            limit: [this.voucher.limit],
            type: [this.voucher.type],
            discountAmount: [this.voucher.discountAmount],
            principal: ['0'],
            addon: ['0'],
          });

          this.editVoucherVisible = true;
        }else{
          this._addonService
          .get(this.voucher.giftId)
          .pipe(
            finalize(() => {
              
            })
          )
          .subscribe((result: AddOnDto) =>{
            this.editAddOn = result;

            this._principalService
              .get(this.editAddOn.principalId)
              .pipe(
                finalize(() => {
                  
                })
              )
              .subscribe((result: Principal) =>{
                this.editPrincipal = result;

                this._principalService
                  .getPrincipal(this.editPrincipal.id)
                  .pipe(
                    finalize(() => {
                    })
                  )
                  .subscribe((result: Principal) => {
                    this.addon = result.addOns;

                    this.xFreeGift = true;
                    this.xDiscount = false;

                    this.voucherForm = this._fb.group({
                      name: [this.voucher.name, Validators.required],
                      code: [this.voucher.code, Validators.required],
                      minimum: [this.voucher.minAmount, Validators.required],
                      desc: [this.voucher.description],
                      startDate: [tempStartDate, Validators.required],
                      endDate: [tempStopDate, Validators.required],
                      enable: [true],
                      limit: [this.voucher.limit],
                      type: [this.voucher.type],
                      discountAmount: [this.voucher.discountAmount],
                      principal: [this.editPrincipal.id],
                      addon: [this.editAddOn.id],
                    });

                    this.editVoucherVisible = true;
                  });
              });

          });
        }

        
        
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
    let timeString = '00:00:00';
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.vStartDate = new Date(finalDate + ' ' + timeString);
    console.log(year);
    console.log(month);
    console.log(day);
    console.log(new Date(finalDate + ' ' + timeString));
  }

  onDateSelect2(event) {
    let timeString = '00:00:00';
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.vEndDate = new Date(finalDate + ' ' + timeString);
    console.log(year);
    console.log(month);
    console.log(day);
    console.log(new Date(finalDate + ' ' + timeString));
  }

  setDateFromDatePicker(datepickerdate){
    let year = datepickerdate.year;
    let month = datepickerdate.month <= 9 ? '0' + datepickerdate.month : datepickerdate.month;;
    let day = datepickerdate.day <= 9 ? '0' + datepickerdate.day : datepickerdate.day;;
    let finalDate = year + "/" + month + "/" + day;
    console.log(year);
    console.log(month);
    console.log(day);
    
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
        //this.voucher.code = this.voucherForm.controls.enable.value;
        this.voucher.limit = this.voucherForm.controls.limit.value;
        this.voucher.type = this.voucherForm.controls.type.value;
        this.voucher.discountAmount = this.voucherForm.controls.discountAmount.value;
        this.voucher.giftId = this.voucherForm.controls.addon.value;
      }
      else{
        this.voucher.name = this.voucherForm.controls.name.value;
        this.voucher.code = this.voucherForm.controls.code.value;
        this.voucher.minAmount = this.voucherForm.controls.minimum.value;
        this.voucher.description = this.voucherForm.controls.desc.value;
        this.voucher.startDate = this.vStartDate;
        this.voucher.stopDate = this.vEndDate;
        //this.voucher.code = this.voucherForm.controls.enable.value;
        this.voucher.limit = this.voucherForm.controls.limit.value;
        this.voucher.type = this.voucherForm.controls.type.value;
        this.voucher.discountAmount = this.voucherForm.controls.discountAmount.value;
        this.voucher.giftId = 0;
      }



      this._voucherService
        .update(this.voucher)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() =>  {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        })

    }
    catch(error){
      this.saving = false;
      console.log(error.message);
    }
  }

}
