import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { AddOnDto, AddOnServiceProxy, LogoLinkDto, LogoLinkServiceProxy, PrincipalDto, PrincipalServiceProxy } from '@shared/service-proxies/service-proxies';
import { AnyARecord } from 'dns';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './edit-principal-dialog.component.html',
  styleUrls: ['./edit-principal-dialog.component.css']
})
export class EditPrincipalDialogComponent extends AppComponentBase
implements OnInit {
  saving = false;
  principal: PrincipalDto = new PrincipalDto();
  id: number;
  addoncount = 0;
  editPrincipalVisible = false;
  logoLinks: LogoLinkDto[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _principalService: PrincipalServiceProxy,
    private _addonService: AddOnServiceProxy,
    private _logolinkService: LogoLinkServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  public principalForm : FormGroup;

  ngOnInit(): void {
    this._principalService.getPrincipal(this.id).subscribe((result: PrincipalDto) => {
      this.principal = result;

      this._logolinkService.getAllLogoLink().subscribe((result1: LogoLinkDto[]) => {
        this.logoLinks = result1;

        this.principalForm = this._fb.group({
          vehicletype: [this.principal.name.split(' - ')[1], Validators.required],
          name: [this.principal.name.split(' - ')[0] , Validators.required],
          desc: [this.principal.description , Validators.required],
          imagelink: [this.principal.imageLink],
          addOns: this._fb.array([])
        });

        if (this.principal.addOns != null){
          this.principal.addOns.forEach(elements =>{
            const control = <FormArray>this.principalForm.controls['addOns'];
            control.push(this.initEditAddOn(elements));
          })

          this.addoncount = this.principal.addOns.length - 1;
          this.editPrincipalVisible = true;
        }else{
          this.addoncount = 0;
          this.editPrincipalVisible = true;
        }
      });
    });

  }


  initEditAddOn(addon: any){
    return this._fb.group({
      addonname: [addon.addonname],
      desc: [addon.desc],
      price: [addon.price],
      id: [addon.id]
    });
  }

  initAddOn() {
    return this._fb.group({
      addonname: ['', Validators.required],
      desc: [''],
      price: [0.0]
    });
  }

  addAddOn() {
    const control = <FormArray>this.principalForm.controls['addOns'];
    control.push(this.initAddOn());
    this.addoncount += 1;
  }

  removeAddOn(i: number) {
    try{
      const control = <FormArray>this.principalForm.controls['addOns'];
      console.log(control.at(i));

      this._addonService
      .delete(control.at(i).value.id)
      .pipe(
        finalize(() => {
          abp.notify.success(this.l('SuccessfullyDeleted'));
        })
      )
      .subscribe(() => {});


      control.removeAt(i);
      this.addoncount -= 1;
    }catch{

    }

  }


  selectedLogo(links: LogoLinkDto){
    this.principalForm.controls.imagelink.setValue(links.link);
  }

  save(): void {
    try{
      this.saving = true;

      this.principal.name = this.principalForm.controls.name.value + ' - ' + this.principalForm.controls.vehicletype.value;
      this.principal.description = this.principalForm.controls.desc.value;
      this.principal.imageLink = this.principalForm.controls.imagelink.value;

      this.principal.addOns = [];
      this.principalForm.controls.addOns.value.forEach(element => {
        let addon = new AddOnDto();
        addon.addonname = element.addonname;
        addon.desc = element.desc;
        addon.price = element.price;
        addon.principalId = this.principal.id;
        addon.id = element.id;

        this.principal.addOns.push(addon);
      });


      console.log(JSON.stringify(this.principal));

      this._principalService
        .update(this.principal)
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
