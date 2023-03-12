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
        // ユーザー情報をローカルストレージに格納したい
        return this.userSvc.login(idToken);
      }),
      mergeMap((isLoggedIn) => {
        if (!isLoggedIn) {
          // ログインに失敗した場合
        }
        // ログイン後にlocal storageにUserデータを保持する
        return new Observable((observer) => {
          const idToken = this.liffSvc.liff.getDecodedIDToken();
          this.userSvc.setUserToLocalStorage(idToken?.sub!).subscribe(() => {
            observer.next(true);
          });
        });
      }),
      map((res) => {
        return true;
      })
    );
  }
}
