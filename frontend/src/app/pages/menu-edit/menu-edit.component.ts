import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss'],
})
export class MenuEditComponent implements OnInit {
  public menuForm = this.fb.group({
    menuname: ['', Validators.required],
    imageUrl: [''],
    materials: this.fb.array([
      this.fb.group({
        ingredient: ['', Validators.required],
        quantity: ['', Validators.required],
      }),
    ]),
    recipes: this.fb.array([this.fb.control('', [Validators.required])]),
  });
  public menu: Menu = {
    id: 0,
    userid: 0,
    menuname: '',
    imageurl: '',
    ingredients: [],
    quantities: [],
    recipes: [],
  };
  public menuId!: number;
  public userId!: number;
  public imgSrc: string = '../assets/images/placeholder.jpg';
  public selectedImage: any;

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
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true, // ダイアログ外のクリックやEscキーで閉じないようにする
    });
    this.userId = this.userSvc.user$.getValue().ID;
    this.route.params.subscribe((params) => {
      this.menuId = Number(params['id']);
    });
    const query = {};
    this.menuRepoSvc.getMenu(this.menuId, query).subscribe((menu) => {
      // TODO: アクセス制限もう少し考える
      if (Number(this.userId) !== menu.userid)
        this.router.navigate([`/menu-list`]);
      console.log(menu);
      if (menu.imageurl !== '') this.imgSrc = menu.imageurl;
      /* レシピのフォーム作成 */
      for (let index = 0; index < menu.recipes.length - 1; index++) {
        this.addRecipes();
      }

      // 材料のフォーム作成
      this.menuForm.controls.materials.controls[0].controls.ingredient.patchValue(
        menu.ingredients[0]
      );
      this.menuForm.controls.materials.controls[0].controls.quantity.patchValue(
        menu.quantities[0]
      );

      for (let index = 0; index < menu.ingredients.length - 1; index++) {
        this.addMaterials();
        this.menuForm.controls.materials.controls[
          this.materials.length - 1
        ].controls.ingredient.patchValue(menu.ingredients[index + 1]);
        this.menuForm.controls.materials.controls[
          this.materials.length - 1
        ].controls.quantity.patchValue(menu.quantities[index + 1]);
      }

      this.menuForm.controls.menuname.patchValue(menu.menuname);
      this.menuForm.controls.recipes.patchValue(menu.recipes);
    });
    dialogRef.close();
  }

  // 特定の材料のフォームグループを取得
  getMaterialFormGroup(index: number) {
    return this.materials.at(index) as FormGroup;
  }

  // 特定の材料のingredientフォームを取得
  getIngredientControl(index: number) {
    const materialFormGroup = this.getMaterialFormGroup(index);
    return materialFormGroup.get('ingredient') as FormControl;
  }

  // 特定の材料のquantityフォームを取得
  getQuantityControl(index: number) {
    const materialFormGroup = this.getMaterialFormGroup(index);
    return materialFormGroup.get('quantity') as FormControl;
  }

  get materials() {
    return this.menuForm.get('materials') as FormArray;
  }

  addMaterials() {
    this.materials.push(
      this.fb.group({
        ingredient: ['', Validators.required],
        quantity: ['', Validators.required],
      })
    );
  }
  removeMaterials() {
    if (this.materials.length - 1 > 0)
      this.materials.removeAt(this.materials.length - 1);
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

  async editMenu() {
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true, // ダイアログ外のクリックやEscキーで閉じないようにする
    });
    let imgUrl: string = '';
    if (this.selectedImage) {
      imgUrl = await this.uploadImage(this.selectedImage);
    }
    const ingredients: string[] = [];
    const quantities: string[] = [];
    this.menuForm.value.materials?.map((material) => {
      ingredients.push(material.ingredient!);
      quantities.push(material.quantity!);
    });
    const body = {
      menuname: this.menuForm.value.menuname,
      imageurl: imgUrl,
      ingredients: ingredients,
      quantities: quantities,
      recipes: this.menuForm.value.recipes,
    };
    this.menuRepoSvc
      .updateMenu(this.userId, this.menuId, body)
      .subscribe(() => {
        const changedMessage = 'メニューを変更しました';
        this._snackBar.open(changedMessage, 'OK', {
          verticalPosition: this.verticalPosition,
          duration: 3000,
        });
        this.router.navigate([`/menu`, this.menuId]);
      });
    dialogRef.close();
  }

  showPreview(event: any) {
    const file = event.target.files[0];
    if (event.target.files && file) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(file);
      this.selectedImage = file;
    } else {
      this.imgSrc = '../assets/images/placeholder.jpg';
      this.selectedImage = null;
    }
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
      if (result.event === 'ok') {
        this.router.navigate(['/menu-list']);
      }
    });
  }

  async uploadImage(img: any) {
    const body = new FormData();
    body.append('file', img, `${this.menu.id}.png`);
    return new Promise<string>((resolve) => {
      this.menuRepoSvc.uploadImage(this.userId, body).subscribe((res) => {
        resolve(res);
      });
    });
  }

  onCancel() {
    this.imgSrc = '../assets/images/placeholder.jpg';
    this.selectedImage = null;
    this.menuForm.controls.imageUrl.defaultValue;
  }
}
