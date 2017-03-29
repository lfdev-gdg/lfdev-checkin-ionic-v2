import {Component} from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {AlertController, LoadingController} from "ionic-angular";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    msg: string = ' ';
    inscritos: Array<any>;
    busca: string = '';
    private inscritosFull: Array<any>;
    private check: FirebaseObjectObservable<any>;
    private checkObj: any;

    constructor(
        private fire: AngularFire,
        private barcodeScanner: BarcodeScanner,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController) {
        this.loadInscritos();
    }

    private loadInscritos(): void {
        let loader = this.loadingCtrl.create({
            content: "Carregando...",
            //duration: 3000
        });
        loader.present();

        this.fire.database.list('/inscricoes').subscribe(
            res => {
                loader.dismissAll();
                this.inscritos = res;
                this.inscritosFull = res;
                this.filtrar();
            }
        );
    }

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

    private alert(titulo, msg): void {
        let alert = this.alertCtrl.create({
            title: titulo,
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present();
    }

    private updateCheck(): void {
        if (!this.checkObj.checkin) {
            this.msg = 'registrano...';
            this.check.update({checkin: new Date().getTime()})
                .catch(err => console.error(err));
        } else {
            this.alert('Check-in', this.checkObj.name + ' - check-in OK!');
        }
    }

    checkIn(insc: any): void {
        let confirm = this.alertCtrl.create({
            title: 'Confirmar '+(insc.checkin ? 'ausência':'presença')+'?',
            message: 'Confirmar '+(insc.checkin ? 'ausência':'presença')+' de '+insc.name+'?',
            buttons: [
                {
                    text: 'cancelar',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'confirmar',
                    handler: () => {
                        this.fire.database.list('/inscricoes').update(insc.$key, {checkin: insc.checkin ? null : new Date().getTime()}).then(
                            () => this.loadInscritos()
                        ).catch( err => console.error(err));
                        /*if (!insc.checkin)
                            this.fire.database.list('/inscricoes').update(insc.$key, {checkin: new Date().getTime()}).then(
                                () => this.loadInscritos()
                            ).catch( err => console.error(err));
                        else
                            this.alert('Chack-in', insc.name.split(' ')+ ' já fez check-in');*/
                    }
                }
            ]
        });
        confirm.present();
    }

    delete(insc: any): void {
        let confirm = this.alertCtrl.create({
            title: 'Excluir inscrição?',
            message: 'Tem certeza que quer excluir a inscrição de '+insc.name+'?',
            buttons: [
                {
                    text: 'cancelar',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'excluir',
                    handler: () => {
                        this.fire.database.list('/inscricoes').remove(insc).then(
                            () => this.loadInscritos()
                        ).catch( err => console.error(err));
                    }
                }
            ]
        });
        confirm.present();
    }

    filtrar(): void {
        this.inscritos = this.inscritosFull.filter( i => i.name.toLowerCase().indexOf(this.busca.toLowerCase()) > -1);
    }
}
