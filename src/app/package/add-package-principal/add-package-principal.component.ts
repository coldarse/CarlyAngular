import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddOnChecked } from '@app/model/AddOnChecked';
import { AppComponentBase } from '@shared/app-component-base';
import { AddOnDto, CustomerPrincipalDto, CustomerPrincipalServiceProxy, Principal, PrincipalDto, PrincipalDtoPagedResultDto, PrincipalServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-add-package-principal',
  templateUrl: './add-package-principal.component.html',
  styleUrls: ['./add-package-principal.component.css']
})
export class AddPackagePrincipalComponent extends AppComponentBase
implements OnInit {

  saving = false;
  principal = new CustomerPrincipalDto();
  public principalForm : FormGroup;
  id: number

  tempprincipal : PrincipalDto[] = [];
  tempaddon : AddOnDto[] = [];

  tempaddonChecked: AddOnChecked[] = [];

  isLoaded = false;

  constructor(
    injector: Injector,
    private _customerPrincipalService: CustomerPrincipalServiceProxy,
    private _principalService: PrincipalServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();


  ngOnInit(): void {
    this.principalForm = this._fb.group({
      name: ['0', Validators.required],
      description: ['', Validators.required],
      sumInsured: ['', Validators.required],
      imagelink: [''],
      premium: ['', Validators.required],
      loading1: ['', Validators.required],
      loading2: ['', Validators.required],
      excess: ['', Validators.required],
      ncda: ['', Validators.required],
      ncdp: ['', Validators.required],
      grossPremium: [{value: '', disabled: true}, Validators.required],
      addOns: this._fb.array([])
    });

    this._principalService
    .getAll('', 0, 12345)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe((result: PrincipalDtoPagedResultDto) => {
      //this.tempprincipal = result.items;
      this._customerPrincipalService.getSelectedCustomerPrincipal(this.id).subscribe((result1: CustomerPrincipalDto[]) => {
        result.items.forEach((elem: PrincipalDto) => {
          if(!this.containsObject(elem, result1)){
            this.tempprincipal.push(elem);
          }
        });
        this.isLoaded = true;
      });


    });

  }

  containsObject(obj: PrincipalDto, list: CustomerPrincipalDto[]){
    var x;
    for(x in list){
      if(list.hasOwnProperty(x) && list[x].name === obj.name){
        return true;
      }
    }
    return false;
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

  initEditAddOn(addon: any){
    return this._fb.group({
      addonname: [addon.addonname],
      desc: [addon.desc],
      price: [addon.price],
      checked: [addon.checked]
    });
  }

  toggleAddOn(event: any, index: number){
    let toggle = event.target.checked;
    this.tempaddonChecked[index].checked = toggle;
    ((this.principalForm.get('addOns') as FormArray).at(index) as FormGroup).get('checked').patchValue(toggle);
  }

  selectedPrincipal(event: any){
    this.tempaddonChecked = [];

    const control = <FormArray>this.principalForm.controls['addOns'];
    control.clear();
    this._principalService
    .getPrincipal(event.target.value)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe((result: Principal) => {
      this.principalForm.controls.description.setValue(result.description);
      this.principalForm.controls.imagelink.setValue(result.imageLink);
      if(result.addOns != null){
        result.addOns.forEach((obj) => {
          this.tempaddonChecked.push(new AddOnChecked(obj));
        });
        this.tempaddonChecked.forEach(elements => {
          control.push(this.initEditAddOn(elements));
        });
      }
    });


  }

  save(): void{
    try {
      this.saving = true;

      const control = <FormArray>this.principalForm.controls['addOns'];


      let indexes = control.length - 1;

      for(let i = indexes; i >= 0; i--){
        if(control.at(i).value.checked == false){
          control.removeAt(i);
        }
      }

      for(let j = 0; j < control.length; j++){
        ((this.principalForm.get('addOns') as FormArray).at(j) as FormGroup).removeControl('checked');
      }

      this.calculate();
      this.principalForm.controls.grossPremium.enable();
      this.principal.grossPremium = this.principalForm.controls.grossPremium.value;
      this.principal = this.principalForm.value;

      this.principalForm.controls.grossPremium.disable();

      this.tempprincipal.forEach((prin: PrincipalDto) => {
        if(prin.id.toString() == this.principal.name){
          this.principal.name = prin.name;
        }
      });

      this.principal.packageId = this.id;

      this._customerPrincipalService
        .create(this.principal)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        })
    } catch (error) {
      this.saving = false;
      console.log(error.message);
    }
  }

}



