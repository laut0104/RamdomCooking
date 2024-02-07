import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LiffInitComponent } from './pages/liff-init/liff-init.component';
import { MenuAddComponent } from './pages/menu-add/menu-add.component';
import { MenuDetailComponent } from './pages/menu-detail/menu-detail.component';
import { MenuEditComponent } from './pages/menu-edit/menu-edit.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';
import { UnauthroizedComponent } from './pages/error/unauthroized/unauthroized.component';
import { NotfoundComponent } from './pages/error/notfound/notfound.component';
import { ServerErrorComponent } from './pages/error/server-error/server-error.component';
import { ExploreMenuComponent } from './pages/explore-menu/explore-menu.component';
import { LikeListComponent } from './pages/like-list/like-list.component';

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
    path: 'explore-menu',
    canActivate: [AuthGuard],
    component: ExploreMenuComponent,
  },
  {
    path: 'like-list',
    canActivate: [AuthGuard],
    component: LikeListComponent,
  },
  {
    path: '401',
    component: UnauthroizedComponent,
  },
  {
    path: '404',
    component: NotfoundComponent,
  },
  {
    path: '500',
    component: ServerErrorComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LiffInitComponent,
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
