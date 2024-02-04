import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../drivers/api.service';

@Injectable({
  providedIn: 'root',
})
export class LikeRepoService {
  constructor(public apiSvc: ApiService) {}

  public getLikeByUniqueKey(userId: number, menuId: number): Observable<any> {
    return this.apiSvc.get(`api/like/${userId}/${menuId}`);
  }

  public createLike(body: any): Observable<any> {
    return this.apiSvc.post(`api/like`, body);
  }
  public deleteLike(id: number): Observable<any> {
    return this.apiSvc.delete(`api/like/${id}`);
  }
}
