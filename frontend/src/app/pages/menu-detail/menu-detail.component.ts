import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from '../../../models/models';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';
import { MatTable } from '@angular/material/table';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';

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
    imageurl: '',
    ingredients: [],
    quantities: [],
    recipes: [],
  };
  private subscriptions: Subscription[] = [];
  public menuId!: number;
  displayedColumns: string[] = ['ingredient', 'quantity'];
  materials: any[] = [];

  @ViewChild(MatTable) materialsTable: MatTable<any> | undefined;

  constructor(
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true, // ダイアログ外のクリックやEscキーで閉じないようにする
    });
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.menuId = Number(params['id']);
      })
    );
    const query = {};
    const userId = this.userSvc.user$.getValue().ID;

    this.menuRepoSvc.getMenu(userId, this.menuId, query).subscribe((menu) => {
      this.menu = menu;
      for (let i = 0; i < this.menu.ingredients.length; i++) {
        const material = {
          ingredient: this.menu.ingredients[i],
          quantity: this.menu.quantities[i],
        };
        this.materials.push(material);
      }
      this.materialsTable?.renderRows();
    });
    dialogRef.close();
  }
}
