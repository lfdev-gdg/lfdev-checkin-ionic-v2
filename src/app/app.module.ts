import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';

import {AngularFireModule} from 'angularfire2';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyAkNVKSCtC8ecBTU8pn5hoMdfGrUzWng2s",
    authDomain: "evento-lfdev.firebaseapp.com",
    databaseURL: "https://evento-lfdev.firebaseio.com",
    storageBucket: "evento-lfdev.appspot.com",
    messagingSenderId: "681302044890"
};

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
