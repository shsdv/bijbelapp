import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu-page/menu-page';
import { ContentPage } from '../pages/content-page/content-page';

import { SettingsPage } from '../pages/settings-page/settings-page';
import { SafePipe } from '../pipes/safe-pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ContentPage,
    SettingsPage,
    SafePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ContentPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SafePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
