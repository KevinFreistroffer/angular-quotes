import { BrowserModule } from "@angular/platform-browser";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { HttpClientModule } from "@angular/common/http";

import { JwtModule } from "@auth0/angular-jwt";

import { ChuckNorrisService } from "./chuck-norris.service";
import { UserService } from "./user.service";
import { LoginComponent } from "./login/login.component";


@NgModule({
  declarations: [AppComponent, DashboardComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
  	ChuckNorrisService, 
  	UserService,
  	{provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
