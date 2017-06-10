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
import { NewsDetailPage } from '../pages/news-detail/news-detail';
import { LogInPage } from '../pages/account/login/login';
import { RegisterPage } from '../pages/account/register/register';
import { AboutPage } from '../pages/about/about';
import { SearchPage } from '../pages/search/search';
import { ContactPage } from '../pages/contact/contact';
import { IssuePage } from '../pages/issue/issue';
import { FavoritePage } from '../pages/favorite/favorite';
import { SettingsPage } from '../pages/settings/settings';


// Services
import { HttpClientService } from '../providers/http-client-service';
import { EventService } from '../providers/event-service';
import { NetworkService } from '../providers/network-service';
import { ProjectService } from '../providers/project.services';
import { MealService } from '../providers/meal.services';
import { TicketService } from '../providers/ticket.services';
import { NewsService } from '../providers/news.services';
import { AccountService } from '../providers/account-services';
import { PageService } from '../providers/page-services';
import { ContactService } from '../providers/contact-services';
import { IssueService } from '../providers/issue-services';
import { PushNotificationService } from '../providers/push-notification-service';
import { FontService } from '../providers/font.services';

// Config object
import { TOKEN_CONFIG, APP_CONFIG } from '../app/app.config';

import { CustomDropdown } from '../utils/custom-dropdown/custom-dropdown.component';

@NgModule({
	declarations: [
		MyApp,
		BasePage,
		StartPage,
		NewsDetailPage,		
		LogInPage,
		RegisterPage,
		AboutPage,
		SearchPage,
		ContactPage,
		IssuePage,
		FavoritePage,
		SettingsPage,
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
		NewsDetailPage,		
		LogInPage,
		RegisterPage,
		AboutPage,
		SearchPage,
		ContactPage,
		IssuePage,
		FavoritePage,
		SettingsPage,
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
		NewsService,
		AccountService,
		PageService,
		ContactService,
		IssueService,
		PushNotificationService,
		FontService,
		{ provide: TOKEN_CONFIG, useValue: APP_CONFIG },
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
