import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncSettingsPage } from './sync-settings-page';

@NgModule({
  declarations: [
    SyncSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncSettingsPage),
  ],
  exports: [
    SyncSettingsPage
  ]
})
export class SyncSettingsPageModule {}
