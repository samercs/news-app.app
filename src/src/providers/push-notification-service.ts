import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client-service';


export class PushNotificationInfo {
    public registerId: string;
    public key: string;
    public platform: string;
    public userId: string;
}

@Injectable()
export class PushNotificationService {

    private pushNotificationInfo: PushNotificationInfo;

    constructor(private httpClient: HttpClientService, private platform: Platform, private storage: Storage) {
    }

    public register(registerId: string): Observable<any> {

        return Observable.create(observable => {
            this.pushNotificationInfo = new PushNotificationInfo();
                this.pushNotificationInfo.registerId = registerId;
                this.pushNotificationInfo.platform = this.platform.is('android') ? 'android' : 'ios';
                this.pushNotificationInfo.userId = null;
                this.postRegisteration();
                observable.next();
                observable.complete();
        });
    }

    /*public getPushNotificationInfo(): Observable<PushNotificationInfo> {
        return Observable.create(observable => {
            this.storage.get('push-notification').then(pushNotification => {
                observable.next(pushNotification);
                observable.complete();
            });
        });
    }    */

    private postRegisteration() {
        console.log("post registeration");
        this.httpClient.post('push-notification/register', this.pushNotificationInfo, '')
            .subscribe(data => {
                this.pushNotificationInfo.key = data;
                this.savePushNotificationInfo();
            });
    }

    private savePushNotificationInfo() {
        this.storage.set('push-notification', this.pushNotificationInfo);
    }
}