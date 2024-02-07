import { Component, OnInit } from '@angular/core';
import { LikeRepoService } from '../../repositories/like-repo.service';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-like-list',
  templateUrl: './like-list.component.html',
  styleUrls: ['./like-list.component.scss'],
})
export class LikeListComponent implements OnInit {
  public userId: number = 0;
  public menuList: any[] = [];

  constructor(
    private likeRepoSvc: LikeRepoService,
    private userSvc: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().ID;
    this.likeRepoSvc.getLikes(this.userId, {}).subscribe((res) => {
      console.log(res);
      this.menuList = res;
      this.menuList.map((menu) => {
        menu.ingredientList = menu.ingredients.join();
      });
    });
  }

  deleteLike(likeID: number, menuName: string, index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmsentence: `${menuName}をいいね解除しますがよろしいですか？`,
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.likeRepoSvc.deleteLike(likeID).subscribe(() => {
          this.menuList.splice(index, 1);
        });
      }
    });
  }
}
