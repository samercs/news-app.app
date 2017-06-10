import { Injectable } from '@angular/core';
import { HttpClientService } from '../providers/http-client-service';
import { Observable } from 'rxjs/Observable';

export class PageModel {
    pageId: number;
    title: string;
    description: string;
    
}

@Injectable()
export class PageService {


    constructor(private http: HttpClientService) {
        
    }

    public getAbout(): Observable<PageModel> {
        return this.http.get("about").map(res => res.json()).map(data => {
            return data;
        });       
    } 
}