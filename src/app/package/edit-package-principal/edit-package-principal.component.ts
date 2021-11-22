import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddOnChecked } from '@app/model/AddOnChecked';
import { AppComponentBase } from '@shared/app-component-base';
import { AddOnDto, CustomerAddOnDto, CustomerAddOnServiceProxy, CustomerPrincipalDto, CustomerPrincipalServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-package-principal',
  templateUrl: './edit-package-principal.component.html',
  styleUrls: ['./edit-package-principal.component.css']
})
export class EditPackagePrincipalComponent extends AppComponentBase implements OnInit {

  saving = false;
  customerPrincipal: CustomerPrincipalDto[] = [];
  selectedCustomerPrincipal: CustomerPrincipalDto = new CustomerPrincipalDto();
  tempaddonChecked: AddOnChecked[] = [];
  id: number;
  editCustomerPrincipalVisible = false;
  currentPrincipal = 0;

  deleteDisabled = true;

  constructor(
    injector: Injector,
    private _customerPrincipalService: CustomerPrincipalServiceProxy,
    private _customerAddonService: CustomerAddOnServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();
  public principalForm : FormGroup;

  ngOnInit(): void {
    this._customerPrincipalService.getSelectedCustomerPrincipal(this.id).subscribe((result: CustomerPrincipalDto[]) => {
      this.customerPrincipal = result;

      this.principalForm = this._fb.group({
        name: ['0', Validators.required],
        prindesc: ['', Validators.required],
        sumInsured: ['', Validators.required],
        imagelink: [''],
        premium: ['0', Validators.required],
        loading1: ['', Validators.required],
        loading2: ['', Validators.required],
        excess: [0],
        ncda: ['', Validators.required],
        ncdp: ['', Validators.required],
        grossPremium: [{value: '', disabled: true}, Validators.required],
        addOns: this._fb.array([])
      });


      this.editCustomerPrincipalVisible = true;
    })
  }


  initEditAddOn(addon: any){
    return this._fb.group({
      addonname: [addon.addonname],
      desc: [addon.desc],
      price: [addon.price],
      checked: [addon.checked],
      id: [addon.id]
    });
  }

  toggleAddOn(event: any, index: number){
    let toggle = event.target.checked;
    this.tempaddonChecked[index].checked = toggle;
    ((this.principalForm.get('addOns') as FormArray).at(index) as FormGroup).get('checked').patchValue(toggle);
  }

  selectedPrincipal(event: any){
    if(this.principalForm.controls.name.value.toString() == "0"){
      this.deleteDisabled = true;

      this.tempaddonChecked = [];
      const control = <FormArray>this.principalForm.controls['addOns'];
      control.clear();
      this.saving = true;
    }
    else{
      this.deleteDisabled = false;
      this.saving = false;
      this.tempaddonChecked = [];
      const control = <FormArray>this.principalForm.controls['addOns'];
      control.clear();

      let c = this.customerPrincipal.map((x) => {return x.id.toString()}).indexOf(event.target.value.toString());
      this.principalForm.controls.premium.setValue(this.customerPrincipal[c].premium);
      this.principalForm.controls.prindesc.setValue(this.customerPrincipal[c].description);
      this.principalForm.controls.imagelink.setValue(this.customerPrincipal[c].imageLink);

      this.principalForm.controls.sumInsured.setValue(this.customerPrincipal[c].sumInsured);
      this.principalForm.controls.loading1.setValue(this.customerPrincipal[c].loading1);
      this.principalForm.controls.loading2.setValue(this.customerPrincipal[c].loading2);
      this.principalForm.controls.excess.setValue(this.customerPrincipal[c].excess);
      this.principalForm.controls.ncda.setValue(this.customerPrincipal[c].ncda);
      this.principalForm.controls.ncdp.setValue(this.customerPrincipal[c].ncdp);
      this.principalForm.controls.grossPremium.setValue(this.customerPrincipal[c].grossPremium);

      this.currentPrincipal = this.customerPrincipal[c].id;

      this.customerPrincipal[c].addOns.forEach((obj) => {
        this.tempaddonChecked.push(new AddOnChecked(obj));
      });
      this.tempaddonChecked.forEach(elements => {
        elements.checked = true;
        control.push(this.initEditAddOn(elements));
      });
    }

  }

  removePrincipal(){
    let c = this.customerPrincipal.map((x) => {return x.id.toString()}).indexOf(this.principalForm.controls.name.value.toString());

    abp.message.confirm(
      this.l('PrincipalDeleteWarningMessage', this.customerPrincipal[c].name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._customerPrincipalService
            .deleteCustomerPrincipal(this.currentPrincipal)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.bsModalRef.hide();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  calculate(){
    let basicpremium = Number(this.principalForm.controls.premium.value);
    let loading_1 = Number(this.principalForm.controls.loading1.value);
    let loading_2 = Number(this.principalForm.controls.loading2.value);
    let excess = Number(this.principalForm.controls.excess.value);
    let ncd = Number(this.principalForm.controls.ncda.value);

    let gross = basicpremium + loading_1 + loading_2 + excess - ncd;
    this.principalForm.controls.grossPremium.setValue(gross);
  }


  save(): void {
    try{
      this.saving = true;

      let c = this.customerPrincipal.map((x) => {return x.id.toString()}).indexOf(this.principalForm.controls.name.value.toString());
      this.selectedCustomerPrincipal.name = this.customerPrincipal[c].name;
      this.selectedCustomerPrincipal.id = this.principalForm.controls.name.value;
      this.selectedCustomerPrincipal.premium = this.principalForm.controls.premium.value;
      this.selectedCustomerPrincipal.packageId = this.id;
      this.selectedCustomerPrincipal.description = this.principalForm.controls.prindesc.value;
      this.selectedCustomerPrincipal.imageLink = this.principalForm.controls.imagelink.value;

      this.calculate();
      this.principalForm.controls.grossPremium.enable();
      this.selectedCustomerPrincipal.sumInsured = this.principalForm.controls.sumInsured.value;
      this.selectedCustomerPrincipal.loading1 = this.principalForm.controls.loading1.value;
      this.selectedCustomerPrincipal.loading2 = this.principalForm.controls.loading2.value;
      this.selectedCustomerPrincipal.excess = this.principalForm.controls.excess.value;
      this.selectedCustomerPrincipal.ncda = this.principalForm.controls.ncda.value;
      this.selectedCustomerPrincipal.ncdp = this.principalForm.controls.ncdp.value;
      this.selectedCustomerPrincipal.grossPremium = this.principalForm.controls.grossPremium.value;
      this.principalForm.controls.grossPremium.disable();

      this.selectedCustomerPrincipal.addOns = [];


      const control = <FormArray>this.principalForm.controls['addOns'];

      let indexes = control.length - 1;

      for(let i = indexes; i >= 0; i--){
        if(control.at(i).value.checked == false){
          this._customerAddonService.delete(control.at(i).value.id)
            .subscribe();

          control.removeAt(i)
        }
      }

      for(let j = 0; j < control.length; j++){
        ((this.principalForm.get('addOns') as FormArray).at(j) as FormGroup).removeControl('checked');
      }

      this.principalForm.controls.addOns.value.forEach(element => {
        let addon = new CustomerAddOnDto();
        addon.addonname = element.addonname;
        addon.desc = element.desc;
        addon.price = element.price;
        addon.customerPrincipalId = this.selectedCustomerPrincipal.id;
        addon.id = element.id;

        this.selectedCustomerPrincipal.addOns.push(addon);
      });

      this._customerPrincipalService
        .update(this.selectedCustomerPrincipal)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        });
    } catch(error){
      this.saving = false;
      console.log(error.message);
    }

  }

}
