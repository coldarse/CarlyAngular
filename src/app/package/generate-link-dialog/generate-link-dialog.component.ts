import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { PackageServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-generate-link-dialog',
  templateUrl: './generate-link-dialog.component.html',
  styleUrls: ['./generate-link-dialog.component.css']
})
export class GenerateLinkDialogComponent extends AppComponentBase
implements OnInit {

  constructor(
    injector: Injector,
    private _packageService: PackageServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private clipboard: ClipboardService
  ) {
    super(injector);
  }

  public linkForm : FormGroup;
  id: number;
  showLink = false;

  @Output() onSave = new EventEmitter<any>();

  ngOnInit(): void {
    this._packageService.generateLink(this.id)
      .subscribe((result: string) => {
        this.linkForm = this._fb.group({
          link: [result],
        });

        this.showLink = true;
      });
  }

  copyToClip(){
    this.clipboard.copy(this.linkForm.controls.link.value);
    this.notify.info(this.l('CopiedSuccessfully'));
  }



}
