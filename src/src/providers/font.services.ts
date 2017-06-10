import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';
import { Inject } from '@angular/core';
import { Events } from 'ionic-angular';
import { EventService } from '../providers/event-service';

@Injectable()
export class FontService {


    private fontSize: string = '';
    private defaultFonSize = 'font-normal';
    private storageDbName: string;
    constructor(private storage: Storage, 
                @Inject(TOKEN_CONFIG) config: AppConfig,
                private eventCtrl: Events,
                private eventService: EventService) {
        this.storageDbName = `${config.appName}:font`;
    }

    public getFontSize(): Observable<any> {

        return Observable.create(observable => {
            this.storage.get(this.storageDbName).then(data => {
                this.fontSize = data ? JSON.parse(data) : null;
                if (!this.fontSize || this.fontSize == '') {
                    this.fontSize = this.defaultFonSize;
                }
                observable.next(this.fontSize);
                observable.complete();
            });
        });
    }

    public setFontSize(fontSize: string){
        this.fontSize = fontSize;
        
        return this.storage.set(this.storageDbName, JSON.stringify(this.fontSize)).then(() => {
            this.eventCtrl.publish(this.eventService.FontChange, true);
        });                
    }
}