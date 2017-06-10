import { Injectable } from '@angular/core';
import { HttpClientService } from '../providers/http-client-service';
import { Observable } from 'rxjs/Observable';

export class IssueModel {
    title: string;
    description: string;
}

@Injectable()
export class IssueService {


    constructor(private http: HttpClientService) {
        
    }

    public submit(model: IssueModel): Observable<any> {
        var data = {title: model.title, description: model.description};
        return this.http.post("issue", data).map(res => res.json()).map(data => {
            return data;
        });       
    } 
}