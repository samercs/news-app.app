// Angular references
import { Component, ViewChild, Inject } from '@angular/core';

// Ionic references
import { Nav, Platform, ModalController, Events, ToastController } from 'ionic-angular';

// Ionic Native references
import { StatusBar, Splashscreen, NativeAudio } from 'ionic-native';

// Models and services
import { EventService } from '../providers/event-service';
import { NetworkService } from '../providers/network-service';
import { ProjectService } from '../providers/project.services';
import { MealService } from '../providers/meal.services';
import { TicketService } from '../providers/ticket.services';
import { AccountService } from '../providers/account-services';
import { PushNotificationService } from '../providers/push-notification-service';


// Pages
import { StartPage } from '../pages/start/start';
import { LogInPage } from '../pages/account/login/login';
import { RegisterPage } from '../pages/account/register/register';
import { AboutPage } from '../pages/about/about';
import { SearchPage } from '../pages/search/search';
import { ContactPage } from '../pages/contact/contact';
import { IssuePage } from '../pages/issue/issue';
import { FavoritePage } from '../pages/favorite/favorite';
import { SettingsPage } from '../pages/settings/settings';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FontService } from '../providers/font.services';

@Component({
	templateUrl: 'app.html',
	providers: [Push]
})
export class MyApp {
	@ViewChild(Nav) navCtrl: Nav;
	private toastInstance: any;
	public rootPage;
	public pages: Array<{ title: string, component: any }>
	public isUserLogin: boolean = false;
	public isRegisterToPushNotification: boolean;
	public fontSize: string = 'font-large';

	constructor(public platform: Platform,
		private modalCtrl: ModalController,
		private eventCtrl: Events,
		private toastCtrl: ToastController,
		private networkService: NetworkService,
		private eventService: EventService,
		private projectService: ProjectService,
		private mealService: MealService,
		private ticketService: TicketService,
		private accountService: AccountService,
		private pushNotificationService: PushNotificationService,
		private push: Push,
		@Inject(TOKEN_CONFIG) config: AppConfig,
		private fontService: FontService) {
		this.initializeApp();

		this.pages = [
			{ title: 'الاخبار', component: StartPage },
			{ title: 'عن التطبيق', component: AboutPage },
			{ title: 'البحث', component: SearchPage },
			{ title: 'اتصل بنا', component: ContactPage },
			{ title: 'الابلاغ عن مشكلة', component: IssuePage },
			{ title: 'الاعدادات', component: SettingsPage }
		];
	}

	// Method that subscribes to the navigation related events and initializes the app
	private initializeApp(): void {
		this.platform.ready().then(() => {
			StatusBar.styleLightContent();
			Splashscreen.hide();
			this.initializeEvents();
			this.initializeStartPage();
			this.registerPushNotification();
			this.initFontSize();
			// Load both audio files
			NativeAudio.preloadSimple('success', 'assets/audio/success.mp3')
				.catch((error) => { console.log(`[NativeAudio]:${error}`); });
			NativeAudio.preloadSimple('error', 'assets/audio/error.mp3')
				.catch((error) => { console.log(`[NativeAudio]:${error}`); });
		});
	}

	private initFontSize(){
		this.fontService.getFontSize().subscribe(font => {
			this.fontSize = font;
			console.log(this.fontSize);
		});
	}

	private initializeStartPage() {
		this.rootPage = StartPage;
	}

	// Method that subscribes to all the events in the app
	private initializeEvents(): void {

		this.accountService.initializeAccountStatus().then((loggedIn) => { this.isUserLogin = loggedIn });

		// Initialize network events
		this.networkService.initializeNetworkEvents();

		// Handle what to do when the user needs to be redirected to any page of the app
		this.eventCtrl.subscribe(this.eventService.NavigationRedirectTo, (redirectionModel) => {
			this.handlePageRedirect(redirectionModel.page, redirectionModel.openAsRoot, redirectionModel.params);
		});

		// Offline event
		this.eventCtrl.subscribe(this.eventService.NetworkIsOffline, () => {
			this.showToastMessage('Your internet connection appears to be offline. Data integrity is not guaranteed', 'offline');
		});

		// Online event
		this.eventCtrl.subscribe(this.eventService.NetworkIsOnline, () => {
			this.showToastMessage('Your internet connection is online again.', 'online', true);
			this.ticketService.syncWithServer().subscribe(result => {
				this.showToastMessage('Your data sync with server successfully.', 'online', true);
			}, err => {
				this.showToastMessage('Unable to sync your data. Sync with server faild.', 'offline');
			});
		});

		// Handle what to do when the user needs to be redirected to any page of the app
		this.eventCtrl.subscribe(this.eventService.UserLoginStatusChanged, (loginChange) => {
			this.isUserLogin = loginChange;
		});

		this.eventCtrl.subscribe(this.eventService.FontChange, (font) => {
			this.initFontSize();
		});
	}

	// Method that handles what to do when the user wants to open a page
	private handlePageRedirect(targetPage: any, openAsRoot?: boolean, params?: any): Promise<any> {
		return openAsRoot
			? this.navCtrl.setRoot(targetPage, params).catch(() => { })
			: this.navCtrl.push(targetPage, params).catch(() => { });
	}

	// Method that shows a toast alert with a given message
	private showToastMessage(message: string, cssClass?: string, autoDismiss?: boolean): void {
		if (this.toastInstance) {
			this.toastInstance.dismiss();
		}

		let options: any = {
			position: 'bottom',
			message: message,
			showCloseButton: true,
			closeButtonText: 'OK'
		};

		if (autoDismiss) {
			options.duration = 3000;
			options.dismissOnPageChange = true;
		} else {
			options.dismissOnPageChange = false;
		}

		if (cssClass) {
			options.cssClass = cssClass;
		}

		this.toastInstance = this.toastCtrl.create(options);

		this.toastInstance.present();
	}

	public openPage(page) {
		this.navCtrl.setRoot(page.component);
	}

	public openLogin() {
		this.navCtrl.setRoot(LogInPage);
	}

	public logOff() {
		this.accountService.logOut();
		this.navCtrl.setRoot(StartPage);
	}

	public openRegister() {
		this.navCtrl.setRoot(RegisterPage);
	}

	public openFavorite() {
		this.navCtrl.setRoot(FavoritePage);
	}

	public registerPushNotification() {
		const options: PushOptions = {
			android: {
				senderID: '273373967351'
			},
			ios: {
				alert: 'true',
				badge: true,
				sound: 'false'
			},
			windows: {}
		};

		let pushObject: PushObject = this.push.init(options);

		pushObject.on('registration').subscribe((registration: any) => {
			console.log('Device registered', registration);
			this.pushNotificationService.register(registration.registrationId).subscribe(() => { });
		});

		pushObject.on('notification').subscribe((notification: any) => {
			let toast = this.toastCtrl.create({
				message: 'New News was added',
				duration: 3000
			});
			toast.present();
		});


		this.isRegisterToPushNotification = true;
	}

}
