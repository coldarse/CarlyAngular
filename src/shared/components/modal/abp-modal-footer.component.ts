import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Injector
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'abp-modal-footer',
  templateUrl: './abp-modal-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbpModalFooterComponent extends AppComponentBase {
  @Input() cancelLabel = this.l('Cancel');
  @Input() cancelDisabled: boolean;
  @Input() saveLabel = this.l('Save');
  @Input() saveDisabled: boolean;
  @Input() saveHidden: boolean = false;
  @Input() cancelHidden: boolean = false;
  @Input() email = this.l('email');
  @Input() emailHidden: boolean = true;

  @Output() onCancelClick = new EventEmitter<number>();
  @Output() onEmailClick = new EventEmitter<number>();

  constructor(injector: Injector) {
    super(injector);
  }
}
