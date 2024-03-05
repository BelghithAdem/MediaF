import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'; 
import { CreatepostComponent } from './pages/createpost/createpost.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';

import { AccueilComponent } from './pages/accueil/accueil.component';
import { TestComponent } from './test/test.component';
import { AuthComponent } from './components/auth/auth.component';
import { ChatComponent } from './components/chat/chat.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'createpost', component: CreatepostComponent },
  { path: 'feed', component: PostFeedComponent },
  { path: 'accueil', component:  AccueilComponent},
  { path: 'test', component:  TestComponent},
  { path: 'login', component: AuthComponent },
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
