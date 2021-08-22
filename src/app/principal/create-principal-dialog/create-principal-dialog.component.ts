import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddOnDto, LogoLinkDto, LogoLinkServiceProxy, PrincipalDto, PrincipalServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  templateUrl: './create-principal-dialog.component.html',
  styleUrls: ['./create-principal-dialog.component.css']
})
export class CreatePrincipalDialogComponent extends AppComponentBase
  implements OnInit{
  saving = false;
  principal = new PrincipalDto();
  addoncount = 0;

  @Output() onSave = new EventEmitter<any>();

  public principalForm : FormGroup;

  logoLinks: LogoLinkDto[] = [];
  isLoaded = false;

  constructor(
    injector: Injector,
    private _principalService: PrincipalServiceProxy,
    private _logolinkService: LogoLinkServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void{

    this._logolinkService.getAllLogoLink().subscribe((result: LogoLinkDto[]) => {
      this.logoLinks = result;

      this.principalForm = this._fb.group({
        vehicletype: ['', Validators.required],
        name: ['', Validators.required],
        desc: ['', Validators.required],
        imagelink: [''],
        addOns: this._fb.array([
            this.initAddOn(),
        ])
      });

      this.principal.addOns = [];
      this.isLoaded = true;
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
    const control = <FormArray>this.principalForm.controls['addOns'];
    control.removeAt(i);
    this.addoncount -= 1;
  }

  selectedLogo(links: LogoLinkDto){
    this.principalForm.controls.imagelink.setValue(links.link);
  }

  save(): void{
    try {
      this.saving = true;

      this.principal.name = this.principalForm.controls.name.value + ' - ' + this.principalForm.controls.vehicletype.value;
      this.principal.description = this.principalForm.controls.desc.value;
      this.principal.imageLink = this.principalForm.controls.imagelink.value;

      this.principalForm.controls.addOns.value.forEach(element => {
        let addon = new AddOnDto();
        addon.addonname = element.addonname;
        addon.desc = element.desc;
        addon.price = element.price;

        this.principal.addOns.push(addon);
      });

      console.log(JSON.stringify(this.principal));

      this._principalService
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
