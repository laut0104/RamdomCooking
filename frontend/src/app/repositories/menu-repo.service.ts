import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../drivers/api.service';

@Injectable({
  providedIn: 'root'
})
export class MenuRepoService {

  constructor(
    public apiSvc: ApiService,
  ) { }

  public getMenus(
    uid: number,
    query: any
  ): Observable<any> {
    return this.apiSvc.get(`menus/${uid}`, query)
  }

}
