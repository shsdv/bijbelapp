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
import { SyncSettingsPage } from '../pages/sync-settings-page/sync-settings-page';
import { Synchronizer } from '../providers/synchronizer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ContentPage,
    SettingsPage,
    SyncSettingsPage,
    SafePipe,
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
    SyncSettingsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SafePipe,
    Synchronizer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
