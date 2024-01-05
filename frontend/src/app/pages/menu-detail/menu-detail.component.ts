import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from '../../../models/models';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.scss'],
})
export class MenuDetailComponent implements OnInit {
  public menu: Menu = {
    id: 0,
    userid: 0,
    menuname: '',
    recipes: [],
  };
  private subscriptions: Subscription[] = [];
  public menuId!: number;

  constructor(
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.menuId = Number(params['id']);
      })
    );
    const query = {};
    const userId = this.userSvc.user$.getValue().ID;
    this.menuRepoSvc.getMenu(userId, this.menuId, query).subscribe((menu) => {
      this.menu = menu;
    });
  }
}
