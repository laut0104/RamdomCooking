import { Component, OnInit } from '@angular/core';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-explore-menu',
  templateUrl: './explore-menu.component.html',
  styleUrls: ['./explore-menu.component.scss'],
})
export class ExploreMenuComponent implements OnInit {
  public userId: number = 0;
  public menuList: any[] = [];

  constructor(
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().ID;
    this.menuRepoSvc.exploreMenu(this.userId, {}).subscribe((res) => {
      this.menuList = res;
      this.menuList.map((menu) => {
        menu.isLiked = false;
        menu.ingredientList = menu.ingredients.join();
      });
    });
  }

  toggleLike(index: number) {
    this.menuList[index].isLiked = !this.menuList[index].isLiked;
  }
}
