import { Component, OnInit } from '@angular/core';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';
import { LikeRepoService } from '../../repositories/like-repo.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-explore-menu',
  templateUrl: './explore-menu.component.html',
  styleUrls: ['./explore-menu.component.scss'],
})
export class ExploreMenuComponent implements OnInit {
  public userId: number = 0;
  public menuList: any[] = [];
  public showMenuList: any[] = [];

  constructor(
    private likeRepoSvc: LikeRepoService,
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().ID;
    this.menuRepoSvc.exploreMenu(this.userId, {}).subscribe((res) => {
      this.menuList = res;
      this.showMenuList = this.menuList.slice(0, 15);
      this.menuList.map((menu) => {
        menu.isLiked = false;
        menu.ingredientList = menu.ingredients.join();
      });
    });
  }

  toggleLike(index: number) {
    this.menuList[index].isLiked = !this.menuList[index].isLiked;
  }

  registerLike(menuID: number) {
    const body = {
      userid: this.userId,
      menuid: menuID,
    };
    this.likeRepoSvc.createLike(body).subscribe((res) => console.log(res));
  }

  deleteLike(menuID: number) {
    this.likeRepoSvc
      .getLikeByUniqueKey(this.userId, menuID)
      .subscribe((res) => {
        console.log(res);
        const likeId = res.id;
        this.likeRepoSvc
          .deleteLike(likeId)
          .subscribe((res) => console.log(res));
      });
  }

  handlePageEvent(e: PageEvent) {
    this.showMenuList = this.menuList.slice(
      15 * e.pageIndex,
      15 * (e.pageIndex + 1)
    );
  }
}
