import { Injectable } from '@angular/core';
import { HttpClientService } from '../providers/http-client-service';
import { Observable } from 'rxjs/Observable';

export class ContactModel {
    name: string;
    title: string;
    message: string;
    email: string;
}

@Injectable()
export class ContactService {


    constructor(private http: HttpClientService) {
        
    }

    public submit(model: ContactModel): Observable<any> {
        var data = {name: model.name, email: model.email, title: model.title, message: model.message};
        return this.http.post("contact", data).map(res => res.json()).map(data => {
            return data;
        });       
    } 
}