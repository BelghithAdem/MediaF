import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BackApiService } from './services/back-api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './pages/post/post.component';
import { MatCardModule } from '@angular/material/card';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { SiderbarAccountsComponent } from './pages/siderbar-accounts/siderbar-accounts.component';
import { SidebarRightComponent } from './pages/sidebar-right/sidebar-right.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { TestComponent } from './pages/test/test.component';
import { SidebarleftComponent } from './pages/sidebarleft/sidebarleft.component';
import { ChatComponent } from './pages/chat/chat.component';
import { StompService } from './services/stomp.service';
import { UserService } from './services/user.service';
import { BetterDatePipe } from './better-date.pipe';
import { PostService } from './services/post.service';
import { SettingsComponent } from './pages/settings/settings.component';





@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    PostComponent,
    PostFeedComponent,
    NavbarComponent,
    SiderbarAccountsComponent,
    SidebarRightComponent,
    AccueilComponent,
    TestComponent,
    SidebarleftComponent,
    ChatComponent,
   BetterDatePipe,
   SettingsComponent
  
 
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
   
    
  ],
  providers: [BackApiService,StompService,UserService,PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
