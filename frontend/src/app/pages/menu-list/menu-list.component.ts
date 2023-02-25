import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { MenusResponse } from '../../../models/response';
import { ApiService } from '../../drivers/api.service';
import { Menu } from '../../../models/models';


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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const query = {}
    const id = 1
    this.menuRepoSvc.getMenus(id, query).subscribe((menus: any) => {
        this.menus = menus.menus
      })
  }

}
