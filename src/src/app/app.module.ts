// Angular references
import { NgModule, ErrorHandler } from '@angular/core';

// Ionic references
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// App
import { MyApp } from './app.component';

// Core dependencies
import { BasePage } from '../core/pages/base';

// Pages
import { StartPage } from '../pages/start/start';
import { ScanPage } from '../pages/scan/scan';
import { PopoverPage } from '../pages/scan/edit-popover/edit-popover';
import { SelectMealPage } from '../pages/select-meal/select-meal';

// Services
import { HttpClientService } from '../providers/http-client-service';
import { EventService } from '../providers/event-service';
import { NetworkService } from '../providers/network-service';
import { ProjectService } from '../providers/project.services';
import { MealService } from '../providers/meal.services';
import { TicketService } from '../providers/ticket.services';

// Config object
import { TOKEN_CONFIG, APP_CONFIG } from '../app/app.config';

import { CustomDropdown } from '../utils/custom-dropdown/custom-dropdown.component';

@NgModule({
	declarations: [
		MyApp,
		BasePage,
		StartPage,
		ScanPage,
		SelectMealPage,
		PopoverPage,

		// Utils
		CustomDropdown
	],
	imports: [
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,

		// Pages
		BasePage,
		StartPage,
		ScanPage,
		SelectMealPage,
		PopoverPage,

		// Utils
		CustomDropdown
	],
	providers: [
		Storage,		
		HttpClientService,		
		EventService,		
		NetworkService,
		ProjectService,
		MealService,
		TicketService,
		{ provide: TOKEN_CONFIG, useValue: APP_CONFIG },
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
