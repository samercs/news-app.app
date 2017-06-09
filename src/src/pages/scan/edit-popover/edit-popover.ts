// Angular references
import { Component } from '@angular/core';

// Ionic
import { ViewController, App } from 'ionic-angular';

// Pages
import { StartPage } from '../../../pages/start/start';
import { SelectMealPage } from '../../../pages/select-meal/select-meal';

@Component({
	template: `
    <ion-list no-lines no-margin>
		<ion-list-header no-margin>Edit</ion-list-header>
      	<button ion-item (click)="changeProject()">Change Project</button>
      	<button ion-item (click)="changeMeal()">Change Meal</button>
    </ion-list>
  `
})
export class PopoverPage {
	constructor(private app: App, private viewCtrl: ViewController) { }

	// Method that redirects the user to the StartPage
	public changeProject(): void {
		this.close().then(() => { this.app.getRootNav().push(StartPage); });
	}

	// Method that redirects the user to the SelectMealPage
	public changeMeal(): void { 
		this.close().then(() => { this.app.getRootNav().push(SelectMealPage); });
	}

	// Method that closes the popover
	private close(): Promise<any> { return this.viewCtrl.dismiss(); }
}