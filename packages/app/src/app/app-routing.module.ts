import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationsFeedComponent } from './notifications-feed/notifications-feed.component';

const routes: Routes = [
  { path: 'feed', component: NotificationsFeedComponent },
  { path: '**', redirectTo: '/feed', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
