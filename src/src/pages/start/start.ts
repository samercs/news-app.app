// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
import { NewsDetailPage } from '../news-detail/news-detail';

// Models
import { NewsModel } from '../../providers/news.services';


@Component({
	selector: 'page-start',
	templateUrl: 'start.html'
})
export class StartPage extends BasePage {

	public news: Array<NewsModel> = [];
	
	constructor(public injector: Injector) {
		super(injector);
	} 

	ionViewDidLoad() {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.tnewsService.getNews().subscribe((data) => {
				this.news = data;
				this.helpers.hideLoadingMessage();
			});
		});		
	}	

	public newsDetail(news: NewsModel){
		this.helpers.redirectTo(NewsDetailPage, false, {news: news});
	}
}
