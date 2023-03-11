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
  styleUrls: ['./menu-add.component.scss']
})
export class MenuAddComponent implements OnInit {

  public menuForm = this.fb.group({
    menuname: ['', Validators.required],
    recipes: this.fb.array([
      this.fb.control('', [
        Validators.required,
        Validators.pattern('[^/]+')
      ])
    ])
  });
  public recipe: string = '{'
  public userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private menuRepoSvc: MenuRepoService,
    private userSvc: UserService,
    public router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userId = this.userSvc.user$.getValue().id
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

  createMenu() {
    this.menuForm.value.recipes?.map((recipe) => {
      this.recipe = this.recipe + recipe + '/,'
    })
    this.recipe = this.recipe.slice(0,-1) + '}'
    const body = {
      'menuname': this.menuForm.value.menuname,
      'recipes': this.recipe,
    }
    this.menuRepoSvc.createMenu(this.userId, body).subscribe(() => {
      this.router.navigate([`/menu-list`]);
    })
  }

  goToListPage() {
    let isBlank: boolean = true;
    if(this.menuForm.value.menuname === ""){
      for (let recipe of this.menuForm.value.recipes!) {
        if(recipe !== "") {
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
