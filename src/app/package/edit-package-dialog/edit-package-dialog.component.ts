import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { PackageDto, PackageServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './edit-package-dialog.component.html',
})
export class EditPackageDialogComponent extends AppComponentBase
implements OnInit {
  saving = false;
  package: PackageDto = new PackageDto();
  id: number;
  packageForm: FormGroup;
  showEdit = false;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _packageService: PackageServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }
  

  ngOnInit(): void {

    this._packageService
      .get(this.id)
      .subscribe((result: PackageDto) => {
        this.package = result;

        this.packageForm = this._fb.group({
          ownerName: [result.ownerName, Validators.required],
          ownerNRIC: [result.ownerNRIC, Validators.required],
          ownerEmail: [result.ownerEmail, Validators.required],
          ownerPhoneNo: [result.ownerPhoneNo, Validators.required],
          vehicleModel: [result.vehicleModel, Validators.required],
          vehicleRegNo: [result.vehicleRegNo, Validators.required],
          vehicleYear: [result.vehicleYear, Validators.required],
          coverType: [result.coverType, Validators.required],
          coveragePeriod: [result.coveragePeriod, Validators.required]
        });

        this.showEdit = true;
      });
  }

  save(): void {
    try{
      this.saving = true;

      this.package = this.packageForm.value;
      this.package.id = this.id;
  
      this._packageService
        .update(this.package)
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
