import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../drivers/api.service';

@Injectable({
  providedIn: 'root',
})
export class RecommendMenuRepoService {
  constructor(private apiSvc: ApiService) {}

  public recommendMenu(uid: number, body: any): Observable<any> {
    return this.apiSvc.post(`api/recommend/menu/${uid}`, body);
  }
}
