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

  public getMenu(
    uid: number,
    id: number,
    query: any
  ): Observable<any> {
    return this.apiSvc.get(`menu/${uid}/${id}`, query)
  }

  public createMenu(
    uid: number,
    body: any
  ): Observable<any> {
    return this.apiSvc.post(`menu/${uid}`, body)
  }

  public updateMenu(
    uid: number,
    id: number,
    body: any
  ): Observable<any> {
    return this.apiSvc.put(`menu/${uid}/${id}`, body)
  }

}
