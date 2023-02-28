import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {}

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

  saveMenu() {
    console.log(this.menuForm)
  }

}
