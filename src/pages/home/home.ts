import {Component} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

import {BarcodeScanner} from "@ionic-native/barcode-scanner";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    msg: string = '';
    private check: FirebaseObjectObservable<any>;
    private checkObj: any;

    constructor(private fire: AngularFire, private barcodeScanner: BarcodeScanner) { }

    fazerCheckIn(): void {
        this.barcodeScanner.scan().then((barcodeData) => {
            if (barcodeData.text.charAt(0) == '-') {
                this.check = this.fire.database.object('/inscricoes/'+barcodeData.text);
                this.check.subscribe(
                    snapshot => {
                        this.checkObj = snapshot;
                        this.updateCheck();
                    }
                );
            }
        }, (err) => {
            console.error(err);
        });
    }

    private updateCheck(): void {
        if (!this.checkObj.checkin) {
            this.msg = 'registrano...';
            this.check.update({checkin: new Date().getTime()})
                .catch(err => console.error(err));
        } else {
            setTimeout( () => this.msg = this.checkObj.name + ' - check-in OK!', 150);
            setTimeout( () => this.msg = '', 1500);
        }
    }
}
