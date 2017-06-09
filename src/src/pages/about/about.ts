// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
// Models
import { PageModel } from '../../providers/page-services';


@Component({
	selector: 'page-about',
	templateUrl: 'about.html'
})
export class AboutPage extends BasePage {

	public aboutPageModel: PageModel = new PageModel();
	
	constructor(public injector: Injector) {
		super(injector);
	} 

	ionViewDidLoad() {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.pageService.getAbout().subscribe((data) => {
				this.aboutPageModel = data;
				this.helpers.hideLoadingMessage();
			});
		});		
	}
}
