import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from '../../../models/models';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss'],
})
export class MenuEditComponent implements OnInit {
  public menuForm = this.fb.group({
    menuname: ['', Validators.required],
    recipes: this.fb.array([
      this.fb.control('', [Validators.required, Validators.pattern('[^/]+')]),
    ]),
  });
  public menu: Menu = {
    id: 0,
    userid: 0,
    menuname: '',
    recipes: [],
  };
  public menuId!: number;
  public userId!: number;
  private subscriptions: Subscription[] = [];

  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private fb: FormBuilder,
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService,
    public router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().ID;
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.menuId = Number(params['id']);
      })
    );
    const query = {};
    this.menuRepoSvc
      .getMenu(this.userId, this.menuId, query)
      .subscribe((menu) => {
        this.menu = menu;
        /* レシピのフォーム作成 */
        for (let index = 0; index < this.menu.recipes.length - 1; index++) {
          this.addRecipes();
        }
        this.menuForm.controls.menuname.patchValue(menu.menuname);
        this.menuForm.controls.recipes.patchValue(this.menu.recipes);
      });
  }

  get recipes() {
    return this.menuForm.get('recipes') as FormArray;
  }

  addRecipes() {
    this.recipes.push(
      this.fb.control('', [Validators.required, Validators.pattern('[^/]+')])
    );
  }
  removeRecipes() {
    if (this.recipes.length - 1 > 0)
      this.recipes.removeAt(this.recipes.length - 1);
  }

  editMenu() {
    const body = {
      menuname: this.menuForm.value.menuname,
      recipes: this.menuForm.value.recipes,
    };
    this.menuRepoSvc
      .updateMenu(this.userId, this.menu.id, body)
      .subscribe(() => {
        const changedMessage = 'メニューを変更しました';
        this._snackBar.open(changedMessage, 'OK', {
          verticalPosition: this.verticalPosition,
          duration: 3000,
        });
        this.router.navigate([`/menu`, this.menu.id]);
      });
  }

  goToListPage() {
    let isBlank: boolean = true;
    if (
      this.menuForm.value.menuname === this.menu.menuname &&
      this.menuForm.value.recipes!.length === this.menu.recipes.length
    ) {
      for (
        let index = 0;
        index < this.menuForm.value.recipes!.length;
        index++
      ) {
        if (this.menuForm.value.recipes![index] !== this.menu.recipes[index]) {
          this.openDialog();
          isBlank = false;
          break;
        }
      }
      if (isBlank) this.router.navigate(['menu-list']);
    } else {
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmsentence: '編集が反映されていないですが本当に移動しますか？',
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.event === 'ok') {
        this.router.navigate(['/menu-list']);
      }
    });
  }
}
