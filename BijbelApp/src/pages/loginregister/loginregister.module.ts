import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Loginregister } from './loginregister';

@NgModule({
  declarations: [
    Loginregister,
  ],
  imports: [
    IonicPageModule.forChild(Loginregister),
  ],
  exports: [
    Loginregister
  ]
})
export class LoginregisterModule {}
