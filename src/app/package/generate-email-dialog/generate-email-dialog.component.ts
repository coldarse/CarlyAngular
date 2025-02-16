import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { EmailContentDto, PackageServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-generate-email-dialog',
  templateUrl: './generate-email-dialog.component.html',
  styleUrls: ['./generate-email-dialog.component.css']
})
export class GenerateEmailDialogComponent extends AppComponentBase
implements OnInit {

  constructor(
    injector: Injector,
    private _packageService: PackageServiceProxy,
    private _userService: UserServiceProxy,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
  ) {
    super(injector);
  }

  public emailForm : FormGroup;
  id: number;
  reminder: boolean;
  showDetails = false;

  tempEmailContent: EmailContentDto;

  @Output() onSave = new EventEmitter<any>();

  ngOnInit(): void {
    this._packageService.getEmailItems(this.id)
      .subscribe((result: EmailContentDto) => {
        this.tempEmailContent = result;
        let subject = result.subject;
        if(this.reminder){
          subject = "Carly Insurance Quotation Reminder (" + result.vehicleRegistrationNumber.toUpperCase() + ")";
        }
        this.emailForm = this._fb.group({
          emailto: [result.emailTo],
          subject: [subject],
          ownername: [result.vehicleOwnerName],
          regno: [result.vehicleRegistrationNumber],
          coverageperiod: [result.coveragePeriod],
        });
        this.tempEmailContent.subject = subject;
        this.showDetails = true;
      });
  }

  email(){
    if(!this.reminder){
      this._userService.sendEmail(this.tempEmailContent)
      .subscribe(() => {
        this.notify.info(this.l('EmailedSuccesfully'));
        this.bsModalRef.hide();
      });
    }else{
      this._userService.sendEmailReminder(this.tempEmailContent)
      .subscribe(() => {
        this.notify.info(this.l('EmailedSuccesfully'));
        this.bsModalRef.hide();
      });
    }
  }

}
