import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiErrorInterceptor } from './interceptors/api-error.interceptor';
import { MenuDetailComponent } from './pages/menu-detail/menu-detail.component';
import { MenuAddComponent } from './pages/menu-add/menu-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuEditComponent } from './pages/menu-edit/menu-edit.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { LiffInitComponent } from './pages/liff-init/liff-init.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HttpRequestInterceptor } from './interceptors/http.interceptor';
import { UnauthroizedComponent } from './pages/error/unauthroized/unauthroized.component';
import { ServerErrorComponent } from './pages/error/server-error/server-error.component';
import { NotfoundComponent } from './pages/error/notfound/notfound.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuListComponent,
    HeaderComponent,
    MenuDetailComponent,
    MenuAddComponent,
    MenuEditComponent,
    DeleteDialogComponent,
    LiffInitComponent,
    ConfirmDialogComponent,
    UnauthroizedComponent,
    ServerErrorComponent,
    NotfoundComponent,
    LoadingSpinnerComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
