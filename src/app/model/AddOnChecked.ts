import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class AddOnChecked {
    addonname: string | undefined;
    desc: string | undefined;
    price: number;
    principalId: number;
    id: number;
    checked: boolean | undefined;
  
    constructor(addonobj: any){
      this.addonname = addonobj.addonname;
      this.desc = addonobj.desc;
      this.price = addonobj.price;
      this.principalId = addonobj.addonprincipalIdname;
      this.id = addonobj.id;
      this.checked = false;
    }
  }