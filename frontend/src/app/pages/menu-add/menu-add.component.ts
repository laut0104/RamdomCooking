import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MenuRepoService } from '../../repositories/menu-repo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.scss'],
})
export class MenuAddComponent implements OnInit {
  public menuForm = this.fb.group({
    menuname: ['', Validators.required],
    imageUrl: [''],
    recipes: this.fb.array([
      this.fb.control('', [Validators.required, Validators.pattern('[^/]+')]),
    ]),
  });
  public userId: number = 0;
  public menuID: number = 0;

  public imgSrc: string = '../assets/images/placeholder.jpg';
  public selectedImage: any = null;

  constructor(
    private fb: FormBuilder,
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().ID;
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

  async createMenu() {
    let body = {
      menuname: this.menuForm.value.menuname,
      recipes: this.menuForm.value.recipes,
    };
    this.menuRepoSvc.createMenu(this.userId, body).subscribe(async (res) => {
      this.menuID = res.id;
      if (this.selectedImage) {
        res.imageurl = await this.uploadImage(this.selectedImage);
        this.menuRepoSvc
          .updateMenu(this.userId, this.menuID, res)
          .subscribe(() => {
            this.router.navigate([`/menu`, this.menuID]);
          });
      }
      this.router.navigate([`/menu`, this.menuID]);
    });
  }

  goToListPage() {
    let isBlank: boolean = true;
    if (this.menuForm.value.menuname === '') {
      for (let recipe of this.menuForm.value.recipes!) {
        if (recipe !== '') {
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
        confirmsentence: '入力途中のデータは消えますが移動しますか？',
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
        this.router.navigate(['/menu-list']);
      }
    });
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

  async uploadImage(img: any) {
    const body = new FormData();
    body.append('file', img, `${this.menuID}.png`);
    return new Promise((resolve) => {
      this.menuRepoSvc.uploadImage(this.userId, body).subscribe((res) => {
        resolve(res);
      });
    });
  }

  onCancel() {
    this.imgSrc = '../assets/images/placeholder.jpg';
    this.selectedImage = null;
    this.menuForm.controls.imageUrl.patchValue(
      this.menuForm.controls.imageUrl.defaultValue
    );
  }
}
