import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from '../../../models/models';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit {
  public menuForm = this.fb.group({
    menuname: ['', Validators.required],
    recipes: this.fb.array([
      this.fb.control('', [
        Validators.required,
        Validators.pattern('[^/]+')
      ])
    ])
  });
  public menu: Menu = {
    id: 0,
    userid: 0,
    menuname: '',
    recipes: ''
  };
  public editRecipe: string = '{'
  public menuId!: number;
  public recipe: string[] = []
  private subscriptions: Subscription[] = [];

  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private fb: FormBuilder,
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService,
    public router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const userId = this.userSvc.user$.getValue().id
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.menuId = Number(params['id']);
      })
    );
    const query = {}
    this.menuRepoSvc.getMenu(userId, this.menuId, query).subscribe((menu) => {
      this.menu = menu
      this.menu.recipes= this.menu.recipes.slice(1,-1)
      this.recipe = this.menu.recipes.split('/,')
      this.recipe.splice(-1,1, this.recipe.slice(-1)[0].slice(0,-1))
      console.log(this.menu)
      /* レシピのフォーム作成 */
      for (let index = 0; index < this.recipe.length-1; index++) {
        this.addRecipes();
      }
      this.menuForm.controls.menuname.patchValue(menu.menuname)
      this.menuForm.controls.recipes.patchValue(this.recipe)
    })
  }

  get recipes() {
    return this.menuForm.get('recipes') as FormArray;
  }

  addRecipes() {
    this.recipes.push(this.fb.control('', [
      Validators.required,
      Validators.pattern('[^/]+')
    ]));
  }
  removeRecipes() {
    if(this.recipes.length-1 >0) this.recipes.removeAt(this.recipes.length-1);
  }

  editMenu(){
    this.menuForm.value.recipes?.map((recipe) => {
      this.editRecipe = this.editRecipe + recipe! + '/,'
    })
    this.editRecipe = this.editRecipe.slice(0,-1) + '}'
    const body = {
      'menuname': this.menuForm.value.menuname,
      'recipes': this.editRecipe,
    }
    this.menuRepoSvc.updateMenu(1, this.menu.id, body).subscribe(() => {
      const changedMessage = 'メニューを変更しました';
      this._snackBar.open(changedMessage, 'OK', {
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
      this.router.navigate([`/menu`, this.menu.id]);
    })
  }

  goToListPage() {
    let isBlank: boolean = true;
    if(this.menuForm.value.menuname === this.menu.menuname && this.menuForm.value.recipes!.length === this.recipe.length){
      for (let index = 0; index < this.menuForm.value.recipes!.length; index++) {
        if(this.menuForm.value.recipes![index] !== this.recipe[index]){
          this.openDialog()
          isBlank = false;
          break
        }
      }
      if(isBlank) this.router.navigate(['menu-list'])
    }
    else{
      this.openDialog()
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmsentence: "編集が反映されていないですが本当に移動しますか？"
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result.event === "ok") {
        this.router.navigate(["/menu-list"])
      }
    });
  }
}
