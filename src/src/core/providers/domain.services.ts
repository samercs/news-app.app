// Angular references
import { Injector } from '@angular/core';

// Services
import { EventService } from "../../providers/event-service";
import { NetworkService } from '../../providers/network-service';
import { ProjectService } from '../../providers/project.services';
import { MealService } from '../../providers/meal.services';
import { TicketService } from '../../providers/ticket.services';
import { NewsService } from '../../providers/news.services';
import { AccountService } from '../../providers/account-services';
import { PageService } from '../../providers/page-services';
import { ContactService } from '../../providers/contact-services';
import { IssueService } from '../../providers/issue-services';
import { FontService } from '../../providers/font.services';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../../app/app.config';

export class DomainServices {

    private _eventService: EventService;
    private _networkService: NetworkService;
    private _projectService: ProjectService;
    private _mealService: MealService;
    private _ticketService: TicketService;
    private _newsService: NewsService;
    private _accountService: AccountService;
    private _config: AppConfig;
    private _pageService: PageService;
    private _contactService: ContactService;
    private _issueService: IssueService;
    private _fontService: FontService;

    constructor(private _injector: Injector) {}

    // Config object
    public get config(): AppConfig {
        if (!this._config) {
            this._config = this._injector.get(TOKEN_CONFIG);
        }
        return this._config;
    }

    // EventService
    public get eventService(): EventService {
        if (!this._eventService) {
            this._eventService = this._injector.get(EventService);
        }
        return this._eventService;
    }    

    // NetworkService
    public get networkService(): NetworkService {
        if (!this._networkService) {
            this._networkService = this._injector.get(NetworkService);
        }
        return this._networkService;
    }

    // ProjectService
    public get projectService(): ProjectService {
        if (!this._projectService) {
            this._projectService = this._injector.get(ProjectService);
        }
        return this._projectService;
    }

    // MealService
    public get mealService(): MealService {
        if (!this._mealService) {
            this._mealService = this._injector.get(MealService);
        }
        return this._mealService;
    }

    // TicketService
    public get ticketService(): TicketService {
        if (!this._ticketService) {
            this._ticketService = this._injector.get(TicketService);
        }
        return this._ticketService;
    }

    // NewsService
    public get tnewsService(): NewsService {
        if (!this._newsService) {
            this._newsService = this._injector.get(NewsService);
        }
        return this._newsService;
    }

    // AccountService
    public get accountService(): AccountService {
        if (!this._accountService) {
            this._accountService = this._injector.get(AccountService);
        }
        return this._accountService;
    }

    // PageService
    public get pageService(): PageService {
        if (!this._pageService) {
            this._pageService = this._injector.get(PageService);
        }
        return this._pageService;
    }

    // ContactService
    public get contactService(): ContactService {
        if (!this._contactService) {
            this._contactService = this._injector.get(ContactService);
        }
        return this._contactService;
    }

    // IssueService
    public get issueService(): IssueService {
        if (!this._issueService) {
            this._issueService = this._injector.get(IssueService);
        }
        return this._issueService;
    }

    // FontService
    public get fontService(): FontService {
        if (!this._fontService) {
            this._fontService = this._injector.get(FontService);
        }
        return this._fontService;
    }
}