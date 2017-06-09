// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';


// Models
import { NewsModel } from '../../providers/news.services';

import { SocialSharing } from 'ionic-native';

@Component({
	selector: 'page-news-detail',
	templateUrl: 'news-detail.html'
})
export class NewsDetailPage extends BasePage {

	public news: NewsModel;
	public isLogin: boolean = false;

	constructor(public injector: Injector) {
		super(injector);
		this.news = this.ionic.paramCtrl.get('news');
		this.isLogin = this.domain.accountService.isLoggedIn();
	}

	ionViewDidLoad() {

	}

	public share() {
		let message = `${this.news.title} \n\n ${this.news.prev}`;
		this.helpers.showLoadingMessage().then(() => {
			var options = {
				message: message, // not supported on some apps (Facebook, Instagram)
				files: [this.news.img], // an array of filenames either locally or remotely                 
			}
			SocialSharing.shareWithOptions(options).then(() => {
				this.helpers.hideLoadingMessage();
			}, () => {
				this.helpers.hideLoadingMessage();
			});
			setTimeout(() => {
				this.helpers.hideLoadingMessage();
			}, 2000);
		});
	}

	public addToFavarites(){
		this.helpers.showLoadingMessage().then(() => {
			this.domain.tnewsService.addToFavorite(this.news.id).subscribe(data => {
				this.news.isFavorite = !this.news.isFavorite;
				this.helpers.hideLoadingMessage();
				
			}, error => {
				this.helpers.hideLoadingMessage();
			});
		});
	}
}
