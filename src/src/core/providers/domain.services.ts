// Angular references
import { Injector } from '@angular/core';

// Services
import { EventService } from "../../providers/event-service";
import { NetworkService } from '../../providers/network-service';
import { ProjectService } from '../../providers/project.services';
import { MealService } from '../../providers/meal.services';
import { TicketService } from '../../providers/ticket.services';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../../app/app.config';

export class DomainServices {

    private _eventService: EventService;
    private _networkService: NetworkService;
    private _projectService: ProjectService;
    private _mealService: MealService;
    private _ticketService: TicketService;
    private _config: AppConfig;

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
}