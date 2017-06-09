// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
import { NewsDetailPage } from '../../pages/news-detail/news-detail';
import { NewsModel } from '../../providers/news.services';


@Component({
	selector: 'page-search',
	templateUrl: 'search.html'
})
export class SearchPage extends BasePage {

	public search: string = '';
	public news: Array<NewsModel> = [];
	public searchTxtPlaceHolder: string = 'ادخل النص للبحث';

	constructor(public injector: Injector) {
		super(injector);
	}

	ionViewDidLoad() {
		/*this.helpers.showLoadingMessage().then(() => {
			this.domain.pageService.getAbout().subscribe((data) => {
				this.aboutPageModel = data;
				this.helpers.hideLoadingMessage();
			});
		});*/
	}

	 public submitSearch() {

        if(this.search.length == 0){
            this.news = null;
            return;
        }

		this.helpers.showLoadingMessage().then(() => {
			this.domain.tnewsService.search(this.search).subscribe(data => {
				this.news = data;
				this.helpers.hideLoadingMessage();
			});
		});        
    }

	public goToNews(news: NewsModel){
		this.helpers.redirectTo(NewsDetailPage, false, {news: news});
	}
}
