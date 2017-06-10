// Angular references
import { Component, Injector } from '@angular/core';
// Pages
import { BasePage } from '../../core/pages/base';



@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage extends BasePage {

	public size: any;

	constructor(public injector: Injector) {
		super(injector);
	}

	ionViewDidLoad() {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.fontService.getFontSize().subscribe(font => {
				switch (font) {
					case "font-small":
						this.size = 1;
						break;
					case "font-normal":
						this.size = 2;
						break;
					case "font-large":
						this.size = 3;
						break;
					default:
						this.size = 2;
				}
				this.helpers.hideLoadingMessage();
			});
		});
	}

	public fontChange(event) {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.fontService.setFontSize(this.getSize(this.size)).then(() => {
				this.helpers.hideLoadingMessage();
			});
		});
		
	}

	public getSize(size: number) {
		switch (size) {
			case 1:
				return "font-small";
			case 2:
				return "font-normal";
			case 3:
				return "font-large";
			default:
				return "font-normal";
		}
	}
}
