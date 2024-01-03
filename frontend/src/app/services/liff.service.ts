import { Injectable } from '@angular/core';
import liff from '@line/liff';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LiffService {
  constructor(private userSvc: UserService) {}

  get liff() {
    return liff;
  }

  public liffInit(liffId: string, path?: string) {
    return new Observable((observer) => {
      liff
        .init({ liffId })
        .then((res) => {
          if (!liff.isInClient() && !liff.isLoggedIn()) {
            // 外部ブラウザで開いている、かつLINEログインしていない場合
            // LIFFブラウザで開いた場合、init()内でログイン処理が行われる
            console.log(path);
            if (path) {
              // liff.login()でログインした場合、デフォルトのリダイレクト先はエンドポイントURLとなる
              // 2次リダイレクトが無効となってしまうため、pathが存在する場合はリダイレクト先を指定する
              const redirectUri = `${location.origin}/${path}`;
              console.log(redirectUri);
              liff.login();
            } else {
              liff.login();
            }
          } else {
            // ログイン成功
            console.log('test1');
            observer.next(true);
          }
        })
        .catch((err) => {
          console.log(err);
          observer.next(false);
        });
    });
  }
}
