import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MenuRepoService } from '../../repositories/menu-repo.service';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.scss']
})
export class MenuDetailComponent implements OnInit {
  public menu = {
    menuname: 'たこ焼き',
    recipes: '{たこやきああああああああああああああああああああああああああああああああああああああああ/,メニューです/}'
  }
  public recipes: string[] = []
  displayedColumns: string[] = ['menu-name', 'button'];

  constructor(
    private menuRepoSvc: MenuRepoService
  ) { }

  ngOnInit(): void {
    this.menu.recipes= this.menu.recipes.slice(1,-1)
    this.recipes = this.menu.recipes.split('/,')
    console.log(this.recipes.slice(-1)[0].slice(0,-1))
    this.recipes.splice(-1,1, this.recipes.slice(-1)[0].slice(0,-1))
    console.log(this.recipes)

    // const recipes = this.menu.recipes.split()
    // const query = {}
    // const id = 1
    // const url = `${environment.apiUrl}/menus/${id}`;
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   }),
    // };
    // const menus = this.menuRepoSvc.getMenus(id, query).subscribe((menus: any) => {
    //     this.menus = menus.menus
    //   })
  }

}
