import { Injectable } from '@angular/core';
import liff from '@line/liff';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiffService {

  constructor() { }

  get liff() {
    return liff;
  }

  public liffInit(liffId: string, path?: string) {
    return new Observable((observer) => {
      liff.init({
        liffId: liffId, // Use own liffId
    }).then((res) => {
      console.log(res)
      if (!liff.isInClient() && !liff.isLoggedIn()) {
        // 外部ブラウザで開いている、かつLINEログインしていない場合
        // LIFFブラウザで開いた場合、init()内でログイン処理が行われる
        if (path) {
          // liff.login()でログインした場合、デフォルトのリダイレクト先はエンドポイントURLとなる
          // 2次リダイレクトが無効となってしまうため、pathが存在する場合はリダイレクト先を指定する
          const redirectUri = `${location.origin}/${path}`;
          liff.login({ redirectUri });
        }
        else {
          liff.login();
        }
        // liff.login();
      } else {
        // ログイン成功
        observer.next(true);
      }
    }).catch((err) => {
      console.log(err);
      observer.next(false);
    });
    })
  }
}
