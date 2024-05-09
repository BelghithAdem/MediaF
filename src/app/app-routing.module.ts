import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'; 
import { PostFeedComponent } from './pages/post-feed/post-feed.component';

import { AccueilComponent } from './pages/accueil/accueil.component';
import { TestComponent } from './pages/test/test.component';
import { ChatComponent } from './pages/chat/chat.component';
import { SettingsComponent } from './pages/settings/settings.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: SettingsComponent },


  { path: 'feed', component: PostFeedComponent },
  { path: 'accueil', component:  AccueilComponent},
  { path: 'profile/:userId', component:  TestComponent},
{
    // Route for the chat page, protected by the AuthGuard
    path: 'chat',
   
    component: ChatComponent,
  },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
