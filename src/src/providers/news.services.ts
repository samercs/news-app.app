import { Injectable } from '@angular/core';
import { HttpClientService } from '../providers/http-client-service';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AccountService } from '../providers/account-services';

export enum NewsType {
    Sport = 1,
    General = 2
}

export class NewsModel {
    id: number;
    title: string;
    img: string;
    prev: string;
    type: NewsType;
    isFavorite: boolean;
}

class NewsListModel {
    news: Array<NewsModel>;
    timestamp: number;

    isValid() {
        if (!this.news) {
            return false;
        }

        let age = Date.now() - this.timestamp;
        if (age > 300000) {
            console.log(`ProjectsList collection is expired at ${age}ms.`)
            return false;
        }

        return true;
    }
}


@Injectable()
export class NewsService {

    private newsList: NewsListModel;

    constructor(private http: HttpClientService,
        private storage: Storage,
        private accountService: AccountService) {
        this.newsList = new NewsListModel();
    }

    public getNews(): Observable<any> {

        if (this.newsList.isValid()) {
            console.log('Getting projects from memory...');
            return Observable.of(this.newsList.news);
        }

        console.log('Getting projects from server...');
        let token = '';
        if (this.accountService.isLoggedIn()) {
            token = this.accountService.getCurrentToken();
        }
        return this.http.get("news", token).map(res => res.json()).map(data => {
            this.newsList.news = data;
            this.newsList.timestamp = Date.now();
            return this.newsList.news;
        });
    }

    public getById(newsId: number): Observable<any> {
        return Observable.create(observable => {
            this.getNews().subscribe((news) => {
                observable.next(news.find(data => data.id == newsId));
                observable.complete();
            });
        });
    }

    public addToFavorite(newsId: number): Observable<any> {
        var data = {};
        let token = this.accountService.getCurrentToken();
        return this.http.post(`news/favorite/${newsId}`, data, token).map(res => res.json()).map(data => {

        });
    }

    public search(query: string): Observable<any> {

        
        if (this.accountService.isLoggedIn()) {
            let token = this.accountService.getCurrentToken();
            return this.http.get(`news/search/${query}`, token).map(res => res.json()).map(data => {
                return data;
            });
        }else{
            return this.http.get(`news/search/${query}`).map(res => res.json()).map(data => {
                return data;
            });
        }

    }

    public getUserFavorite(): Observable<any> {
        let token = this.accountService.getCurrentToken();
        return this.http.get(`news/favorite`, token).map(res => res.json()).map(data => {
            return data;
        });
    }


}