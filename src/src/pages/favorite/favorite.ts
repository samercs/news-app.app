// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
import { NewsDetailPage } from '../../pages/news-detail/news-detail';

// Models
import { NewsModel } from '../../providers/news.services';


@Component({
	selector: 'page-favorite',
	templateUrl: 'favorite.html'
})
export class FavoritePage extends BasePage {

	private news: Array<NewsModel> = [];

	constructor(public injector: Injector) {
		super(injector);
	}

	ionViewDidLoad() {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.tnewsService.getUserFavorite().subscribe((data) => {
				this.news = data;
				this.helpers.hideLoadingMessage();
			});
		});
	}

	public goToNews(news: NewsModel) {
		this.helpers.redirectTo(NewsDetailPage, false, { news: news });
	}

	public removeFromFavorite(newId: number) {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.tnewsService.addToFavorite(newId).subscribe(() => {
				this.domain.tnewsService.getUserFavorite().subscribe((data) => {
					this.news = data;
					this.helpers.hideLoadingMessage();
				});
			});
		});

	}
}
