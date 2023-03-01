import { Component, OnInit } from '@angular/core';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { ApiService } from '../../drivers/api.service';
import { Menu } from '../../../models/models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  public menus: Menu[] = [];
  displayedColumns: string[] = ['menu-name', 'button'];
  public recipes: any[] = [];

  constructor(
    public menuRepoSvc: MenuRepoService,
    public apiSvc: ApiService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    const query = {}
    const id = 1
    this.menuRepoSvc.getMenus(id, query).subscribe((menus: any) => {
        this.menus = menus.menus
      })
  }

  public goToEditPage(menuId: number): void {
    this.router.navigate([`/menu-edit`, menuId]);
  }

}
