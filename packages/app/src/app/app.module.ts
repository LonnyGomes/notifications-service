import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationsFeedComponent } from './notifications-feed/notifications-feed.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AppComponent, NotificationsFeedComponent],
  imports: [BrowserModule, AppRoutingModule, MatToolbarModule, MatCardModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
