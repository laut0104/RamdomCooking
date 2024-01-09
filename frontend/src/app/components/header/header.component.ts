import { Component, OnInit } from '@angular/core';
import { LiffService } from '../../services/liff.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public icon: string = '../assets/images/icon_sample.png';

  constructor(private liffSvc: LiffService) {}

  ngOnInit() {
    this.getIcon();
  }

  async getIcon() {
    const profile = await this.liffSvc.liff.getProfile();
    if (profile.pictureUrl) this.icon = profile.pictureUrl;
  }
}
