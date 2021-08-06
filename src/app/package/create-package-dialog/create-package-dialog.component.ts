import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { PackageDto, PackageServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-package-dialog',
  templateUrl: './create-package-dialog.component.html',
  styleUrls: ['./create-package-dialog.component.css']
})
export class CreatePackageDialogComponent extends AppComponentBase 
implements OnInit {
  saving = false;
  package = new PackageDto();

  

  public packageForm : FormGroup;

  constructor(
    injector: Injector,
    private _packageService: PackageServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();

  ngOnInit(): void {
    
    this.packageForm = this._fb.group({
      ownerName: ['', Validators.required],
      ownerNRIC: ['', Validators.required],
      ownerEmail: ['', Validators.required],
      ownerPhoneNo: ['', Validators.required],
      vehicleRegNo: ['', Validators.required],
      coverType: ['', Validators.required],
      coveragePeriod: ['', Validators.required]
    });


  }

  save(): void{
    try {
      this.saving = true;

      this.packageForm.controls.vehicleRegNo.setValue(this.packageForm.controls.vehicleRegNo.value.toUpperCase());
      this.package = this.packageForm.value;
      this.package.principals = null;

      this._packageService
        .create(this.package)
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
