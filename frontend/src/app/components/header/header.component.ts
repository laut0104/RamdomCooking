import { Component, Input, OnInit } from '@angular/core';
import { LiffService } from '../../services/liff.service';
import { UserService } from '../../services/user.service';
import { RecommendMenuRepoService } from '../../repositories/recommend-menu-repo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public icon: string = '../assets/images/icon_sample.png';

  constructor(
    private liffSvc: LiffService,
    private userSvc: UserService,
    private recommendMenuRepoSvc: RecommendMenuRepoService
  ) {}

  @Input() isLogin: boolean = true;
  ngOnInit() {
    this.getIcon();
  }

  async getIcon() {
    const profile = await this.liffSvc.liff.getProfile();
    if (profile.pictureUrl) this.icon = profile.pictureUrl;
  }

  recommendMenu() {
    const userID = this.userSvc.user$.getValue().ID;
    this.recommendMenuRepoSvc.recommendMenu(userID, {}).subscribe();
  }
}
