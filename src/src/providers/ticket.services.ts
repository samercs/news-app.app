// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';

// Ionic
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Ionic Native
import { SQLite } from 'ionic-native';

// Services
import { HttpClientService } from '../providers/http-client-service';

export class TicketModel {
    ticketId: number;
    projectId: number;
    meal: number;
    type: number;
    scanDateUtc: string;
    deviceId: string;
    guid: string;
    isSync: number;
}

export class TicketCountModel {
    b: number; // breakfat
    l: number; // lunch
    d: number; // dinner
    s: number; // snack
}

const databaseConfig = { name: 'Tickit.db', location: 'default' };

@Injectable()
export class TicketService {

    private storage: SQLite;

    constructor(Storage: Storage, 
                private http: HttpClientService, 
                private platform: Platform) {
        this.platform.ready().then(() => {
            this.initializeDb();
        });
    }

    private initializeDb(): void {
        this.storage = new SQLite();

        this.storage.openDatabase(databaseConfig).then(() => {
            this.storage.executeSql(`CREATE TABLE IF NOT EXISTS Tickets (
                ticketId integer primary key, 
                projectId integer,
                meal integer,
                type integer,
                scanDateUtc text,
                deviceId text,
                isSync integer,
                guid text
            )`, {}).then(() => {

                }, (err) => {
                    console.error('Unable to execute sql: ', err);
                });

            this.storage.executeSql(`CREATE TABLE IF NOT EXISTS TicketsCount (
                dateStr text primary key,
                b integer,
                l integer,
                d integer,
                s integer
            )`, {}).then(() => {
                }, (err) => {
                    console.error('Unable to execute sql: ', err);
                });
        }, (err) => {
            console.error('Unable to open database: ', err);
        });
    }

    public saveTicket(projectId, date, meal, type, extra, divice): Observable<any> {
        return Observable.create(obervable => {
            let today = new Date();
            let ticket = new TicketModel();
            ticket.scanDateUtc = `${(today.getUTCMonth() + 1)}-${today.getUTCDate()}-${today.getUTCFullYear()} ${today.getUTCHours()}:${today.getUTCMinutes()}`;
            ticket.meal = meal;
            ticket.type = type;
            ticket.deviceId = divice;
            ticket.projectId = projectId;
            ticket.isSync = 0;
            ticket.guid = today.getTime() + '';
            this.addTicket(ticket).subscribe(ticketId => {
                console.log(`Ticket added ${ticketId} to local database.`);
                this.sendToServer(ticket).subscribe(serverResult => {
                    obervable.next();
                    obervable.complete();
                }, error => {
                    obervable.next();
                    obervable.complete();
                });
            }, error => {
                this.sendToServer(ticket).subscribe(serverResult => {
                }, error => {
                    obervable.next();
                    obervable.complete();
                });
            });

        });
    }

    private addTicket(ticket: TicketModel): Observable<any> {
        return Observable.create(observable => {
            this.storage.executeSql(`insert into Tickets (projectId, meal, type, scanDateUtc, deviceId, isSync, guid) values (?, ?, ?, ?, ?, ?, ?)`, [ticket.projectId, ticket.meal, ticket.type, ticket.scanDateUtc, ticket.deviceId, ticket.isSync, ticket.guid]).then((result) => {
                ticket.ticketId = result;
                this.saveCountInfo(ticket.meal).subscribe(() => {
                    console.log(`Call saveCountInfo(${ticket.meal})`);
                });
                observable.next(ticket);
                observable.complete();
            }, (err) => {
                console.error('Unable to execute sql: ', err);
                observable.error(err);
                observable.complete();
            });
        });
    }

    private updateTicket(ticketGuid: string, syncStatus: number): Observable<any> {
        return Observable.create(observable => {
            this.storage.executeSql(`update Tickets set isSync=${syncStatus} where guid=?`, [ticketGuid]).then(() => {
                observable.next();
                observable.complete();
            }, (err) => {
                console.error('Unable to execute sql: ', err);
                observable.error(err);
                observable.complete();
            });

        });
    }

    private sendToServer(ticket: TicketModel): Observable<any> {
        return Observable.create(observable => {
            this.http.post('ticket', {
                projectId: ticket.projectId,
                scanTime: ticket.scanDateUtc,
                meal: ticket.meal,
                type: ticket.type,
                deviceId: ticket.deviceId,
                guid: ticket.guid
            }).subscribe(result => {
                this.updateTicket(result.guid, 1).subscribe(deleteResult => {
                    console.log('Sync with server and delete ticket from local db ....');
                    observable.next(result);
                    observable.complete();
                }, error => {
                    console.log('Sync with server. Unable to delete ticket from local db ....');
                    observable.next();
                    observable.complete();
                });

            }, error => {
                console.log('Unable to sync with server ...');
                observable.next();
                observable.complete();
            });
        });
    }

    public syncWithServer(): Observable<any> {
        return Observable.create(observable => {

            this.storage.executeSql(`select * from Tickets where isSync=0`, {}).then((rs) => {
                if (rs.rows.length > 0) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        let ticket = new TicketModel();
                        ticket.projectId = rs.rows.item(i).projectId;
                        ticket.meal = rs.rows.item(i).meal;
                        ticket.deviceId = rs.rows.item(i).deviceId;
                        ticket.scanDateUtc = rs.rows.item(i).scanDateUtc;
                        ticket.ticketId = rs.rows.item(i).ticketId;
                        ticket.guid = rs.rows.item(i).guid;
                        this.sendToServer(ticket).subscribe(done => {
                            this.updateTicket(done.guid, 1).subscribe(() => { });
                        }, error => { });
                    }
                    observable.next(true);
                    observable.complete();
                }

            }, (err) => {
                console.error('Unable to execute sql: ', err);
                observable.next(false);
                observable.complete();
            });
        });
    }

    public getScanCounts(): Observable<TicketCountModel> {
        console.log('Start getScanCounts()');
        let data = new TicketCountModel();
        data.b = 0;
        data.l = 0;
        data.d = 0;
        data.s = 0;

        return Observable.create(observable => {
            this.storage.executeSql(`select * from TicketsCount where dateStr=?`, [this.getTodayStr()]).then((rs) => {
                if (rs.rows.length > 0) {
                    console.log('Start getScanCounts() More than 1 row');
                    data.b = rs.rows.item(0).b;
                    data.l = rs.rows.item(0).l;
                    data.d = rs.rows.item(0).d;
                    data.s = rs.rows.item(0).s;
                    observable.next(data);
                    observable.complete();
                } else {
                    console.log('Start getScanCounts() No Data');
                    observable.next(data);
                    observable.complete();
                }

            }, (err) => {
                console.log('Start getScanCounts() Cant Execute Sql');
                observable.next(data);
                observable.complete();
            });
        });
    }

    private getTodayStr() {
        let today = new Date();
        return `${today.getUTCDate()}-${today.getUTCMonth() + 1}-${today.getUTCFullYear()}`;
    }

    public saveCountInfo(meal): Observable<any> {
        console.log('Start saveCountInfo()');
        let b: number = 0, l: number = 0, d: number = 0, s: number = 0;

        switch (parseInt(meal)) {
            case 1:
                b = 1;
                break;
            case 2:
                l = 1;
                break;
            case 3:
                d = 1;
                break;
            case 4:
                s = 1;
                break;
        }

        return Observable.create(observable => {
            this.storage.executeSql(`insert into TicketsCount (dateStr, b, l, d, s) values (?, ?, ?, ?, ?)`, [this.getTodayStr(), b, l, d, s]).then((result) => {
                console.log('saveCountInfo() Insert New Rocord');
                observable.next();
                observable.complete();
            }, (err) => {
                this.storage.executeSql(`update TicketsCount set b=b+?, l=l+?, d=d+?, s=s+? where dateStr=?`, [b, l, d, s, this.getTodayStr()]).then((result) => {
                    console.log('saveCountInfo() Update Exsisting Rocord');
                    observable.next();
                    observable.complete();
                });
            });
        });
    }
}