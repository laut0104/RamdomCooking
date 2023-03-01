import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuAddComponent } from './pages/menu-add/menu-add.component';
import { MenuDetailComponent } from './pages/menu-detail/menu-detail.component';
import { MenuEditComponent } from './pages/menu-edit/menu-edit.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';

const routes: Routes = [
  {
    path: 'menu-list',
    component: MenuListComponent,
  },
  {
    path: 'menu/:id',
    component: MenuDetailComponent,
  },
  {
    path: 'menu-add',
    component: MenuAddComponent,
  },
  {
    path: 'menu-edit/:id',
    component: MenuEditComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
