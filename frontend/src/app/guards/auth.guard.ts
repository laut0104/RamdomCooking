import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LiffService } from '../services/liff.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private liffSvc: LiffService,
    private userSvc: UserService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const path = state.url;
    const isLinkingNursery = path === '';

    return this.liffSvc.liffInit(environment.LIFF_ID, path).pipe(
      mergeMap((isLoggedInToLiff) => {
        if (!isLoggedInToLiff) {
          // liff.initでLINEログインに失敗した場合
        }

        // // 保育園連携の場合、必ずStrapiログインを実行させる
        // if (!isLinkingNursery && this.userSvc.isAuthenticated())
        //   return of(true);

        const idToken = this.liffSvc.liff.getIDToken();
        console.log(idToken)
        // strapiloginの中でやっているユーザー取得と保育園取得を分けたい
        this.userSvc.login(idToken).subscribe((res) => console.log(res))
        return this.userSvc.login(idToken);
      }),
      // mergeMap((isLoggedInToStrapi) => {
      //   if (!isLoggedInToStrapi) {
      //     // Strapiログインに失敗した場合
      //   }

      //   // Strapiログイン後にlocal storageにUserデータを保持する
      //   return new Observable((observer) => {
      //     this.userSvc.setUserToLocalStorage().subscribe(() => {
      //       observer.next(true);
      //     });
      //   });
      // }),
      // map((res) => {
      //   console.log(res);
      //   return true;
      // })
    );
  }
}
