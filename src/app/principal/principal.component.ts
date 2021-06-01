import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PrincipalDto, PrincipalDtoPagedResultDto, PrincipalServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreatePrincipalDialogComponent } from './create-principal-dialog/create-principal-dialog.component';
import { EditPrincipalDialogComponent } from './edit-principal-dialog/edit-principal-dialog.component';

class PagedPrincipalsRequestDto extends PagedRequestDto{
  keyword: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrincipalComponent extends PagedListingComponentBase<PrincipalDto> {

  principals: PrincipalDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _principalsService: PrincipalServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedPrincipalsRequestDto, 
    pageNumber: number, 
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._principalsService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: PrincipalDtoPagedResultDto) => {
        this.principals = result.items;
        this.showPaging(result, pageNumber)
      });
  }


  delete(principal: PrincipalDto): void {
    abp.message.confirm(
      this.l('PrincipalDeleteWarningMessage', principal.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._principalsService
            .deletePrincipal(principal.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createPrincipal(): void {
    this.showCreateOrEditPrincipalDialog();
  }

  editPrincipal(principal: PrincipalDto): void {
    this.showCreateOrEditPrincipalDialog(principal.id);
  }

  showCreateOrEditPrincipalDialog(id?: number): void {
    let createOrEditPrincipaltDialog: BsModalRef;
    if (!id) {
      createOrEditPrincipaltDialog = this._modalService.show(
        CreatePrincipalDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    }
    else {
      createOrEditPrincipaltDialog = this._modalService.show(
        EditPrincipalDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditPrincipaltDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  

  

}
