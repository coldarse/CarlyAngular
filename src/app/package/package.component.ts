import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { AddOnDto, CustomerPrincipalDto, CustomerPrincipalServiceProxy, Package, PackageDto, PackageDtoPagedResultDto, PackageServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { AddPackagePrincipalComponent } from './add-package-principal/add-package-principal.component';
import { CreatePackageDialogComponent } from './create-package-dialog/create-package-dialog.component';
import { EditPackageDialogComponent } from './edit-package-dialog/edit-package-dialog.component';
import { EditPackagePrincipalComponent } from './edit-package-principal/edit-package-principal.component';
import { GenerateEmailDialogComponent } from './generate-email-dialog/generate-email-dialog.component';
import { GenerateLinkDialogComponent } from './generate-link-dialog/generate-link-dialog.component';


class PagedPackageRequestDto extends PagedRequestDto{
  keyword: string;
}

@Component({
  templateUrl: './package.component.html',
  animations: [appModuleAnimation()]
})
export class PackageComponent extends PagedListingComponentBase<PackageDto> {

  packages: PackageDto[] = [];
  backupPackages: PackageDto[] = [];
  keyword = '';
  packagePrincipals = '';

  constructor(
    injector: Injector,
    private _packagesService: PackageServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }


  list(
    request: PagedPackageRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._packagesService
      .getAllPackage()
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: Package[]) => {
        this.packages = result;
        this.backupPackages = this.packages;
        //this.showPaging(result, pageNumber);
      });
  }

  isFourteenDays(date: string) : boolean {
    var diff = Math.abs(new Date().getTime() - new Date(date).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if(diffDays >= 14){
      return true;
    }else{
      return false;
    }
  }

  search(){
    if(this.keyword != ""){
      this.packages = [];

      this.backupPackages.forEach((element: PackageDto) => {
        if(element.vehicleRegNo.toLowerCase().includes(this.keyword.toLowerCase())){
          console.log(element);
          this.packages.push(element);
        }
      });

      if(this.packages.length == 0){
        this.packages = this.backupPackages;
      }
    }
    else{
      this.packages = this.backupPackages;
    }

  }


  delete(Package: PackageDto): void {
    abp.message.confirm(
      this.l('PackageDeleteWarningMessage', Package.ownerName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._packagesService
            .deletePackage(Package.id)
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

  createPackage(): void {
    this.showCreateOrEditPackageDialog();
  }

  editPackage(Package: PackageDto): void {
    this.showCreateOrEditPackageDialog(Package.id);
  }

  addPrincipal(Package: PackageDto): void {
    this.showCreateOrEditPrincipalDialog(Package.id, true);
  }

  editPrincipal(Package: PackageDto): void {
    this.showCreateOrEditPrincipalDialog(Package.id, false);
  }

  genLink(Package: PackageDto): void {
    this.showGenLinkOrGenEmailDialog(Package.id, true, false);
  }

  email(Package: PackageDto): void {
    this.showGenLinkOrGenEmailDialog(Package.id, false, false);
  }

  emailReminder(Package: PackageDto): void {
    this.showGenLinkOrGenEmailDialog(Package.id, false, true);
  }

  showCreateOrEditPackageDialog(id?: number): void {
    let createOrEditPackageDialog: BsModalRef;
    if (!id) {
      createOrEditPackageDialog = this._modalService.show(
        CreatePackageDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    }
    else {
      createOrEditPackageDialog = this._modalService.show(
        EditPackageDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditPackageDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  showCreateOrEditPrincipalDialog(id: number, add: boolean): void {
    let createOrEditPrincipalDialog: BsModalRef;
    if (add) {
      createOrEditPrincipalDialog = this._modalService.show(
        AddPackagePrincipalComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          }
        }
      );
    }
    else {
      createOrEditPrincipalDialog = this._modalService.show(
        EditPackagePrincipalComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditPrincipalDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  showGenLinkOrGenEmailDialog(id: number, add: boolean, reminder: boolean): void {
    let genLinkOrgenEmailDialog: BsModalRef;
    if (add) {
      genLinkOrgenEmailDialog = this._modalService.show(
        GenerateLinkDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          }
        }
      );
    }
    else {
      genLinkOrgenEmailDialog = this._modalService.show(
        GenerateEmailDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
            reminder: reminder
          },
        }
      );
    }

    genLinkOrgenEmailDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }



}
