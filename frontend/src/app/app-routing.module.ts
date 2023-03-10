import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LiffInitComponent } from './pages/liff-init/liff-init.component';
import { MenuAddComponent } from './pages/menu-add/menu-add.component';
import { MenuDetailComponent } from './pages/menu-detail/menu-detail.component';
import { MenuEditComponent } from './pages/menu-edit/menu-edit.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';

const routes: Routes = [
  {
    path: 'menu-list',
    canActivate: [AuthGuard],
    component: MenuListComponent,
  },
  {
    path: 'menu/:id',
    canActivate: [AuthGuard],
    component: MenuDetailComponent,
  },
  {
    path: 'menu-add',
    canActivate: [AuthGuard],
    component: MenuAddComponent,
  },
  {
    path: 'menu-edit/:id',
    canActivate: [AuthGuard],
    component: MenuEditComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LiffInitComponent,
  },
  // {
  //   path: '',
  //   component: LiffInitComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
