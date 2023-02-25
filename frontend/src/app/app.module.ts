import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MenuListComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
