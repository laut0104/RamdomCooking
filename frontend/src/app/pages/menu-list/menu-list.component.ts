import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { ApiService } from '../../drivers/api.service';
import { Menu } from '../../../models/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  public menus: Menu[] = [];
  displayedColumns: string[] = ['menu-name', 'button'];
  public userId!: number;
  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild(MatTable) menusTable: MatTable<any> | undefined;

  constructor(
    public menuRepoSvc: MenuRepoService,
    public userSvc: UserService,
    public apiSvc: ApiService,
    public router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().ID;
    this.getMenus();
  }

  public goToEditPage(menuId: number): void {
    this.router.navigate([`/menu-edit`, menuId]);
  }

  public getMenus() {
    const query = {};
    this.menuRepoSvc.getMenus(this.userId, query).subscribe((menus: any) => {
      this.menus = menus;
    });
  }

  public openDeleteDialog(menuId: number, menuname: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        menuname: menuname,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'delete') {
        this.menuRepoSvc.deleteMenu(this.userId, menuId).subscribe(() => {
          this.getMenus();
          this.menusTable?.renderRows();
          const changedMessage = menuname + 'を削除しました';
          this._snackBar.open(changedMessage, 'OK', {
            verticalPosition: this.verticalPosition,
            duration: 3000,
          });
        });
      }
    });
  }
}
