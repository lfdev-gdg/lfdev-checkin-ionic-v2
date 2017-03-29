import {Component} from '@angular/core';
import {AngularFire} from 'angularfire2';

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

    constructor(
        private fire: AngularFire,
        private barcodeScanner: BarcodeScanner,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController) {
        this.loadInscritos();
    }

    private loadInscritos(): void {
        let loader = this.loadingCtrl.create({
            content: "Carregando..."
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
                this.inscritosFull.forEach( i => {
                    if (i.$key == barcodeData.text)
                        this.checkIn(i);
                });
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
