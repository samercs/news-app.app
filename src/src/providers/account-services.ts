// Angular references
import { Injectable, Inject } from '@angular/core';

// RxJS references
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/Rx';

// Ionic references
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Models and services
import { EventService } from '../providers/event-service';
import { HttpClientService } from '../providers/http-client-service';

// Config object
import { TOKEN_CONFIG, AppConfig } from '../app/app.config';

export class UserAccountViewModel {
    public userId: number;
    public firstName: string;
    public lastName: string;
    public access_token: string;
    public expires_in: number;    
}

export class LogInViewModel {
    public email: string;
    public password: string;
}

export class PhoneNumberViewModel {
    public phoneCountryCode: string;
    public phoneLocalNumber: string;
}

export class RegisterViewModel {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public confirmPassword: string;
}

export class PasswordResetViewModel {
    public email: string;
}

@Injectable()
export class AccountService {

    private userDetails: UserAccountViewModel;
    private storageDbName: string;

    constructor(private http: HttpClientService,
                private eventService: EventService,
                private storage: Storage,
                private eventCtrl: Events,
                @Inject(TOKEN_CONFIG) config: AppConfig) {
        this.storageDbName = `${config.appName}:account`;
    }

    // Method that gets the information from the storage and initializes an object
    // in memory to avoid dealing with promises everywhere in the code
    public initializeAccountStatus(): Promise<boolean> {
        console.log('Getting account status from storage...');
        return this.storage.get(this.storageDbName).then(data => {
            this.userDetails = data ? JSON.parse(data) : null;
            return this.userDetails !== null;
        });
    }

    // Method that returns true if the user is logged in
    public isLoggedIn(): boolean {
        return this.userDetails !== null;
    }

    // Method that handles user login
    public logIn(model: LogInViewModel): Observable<UserAccountViewModel> {
        let data = `grant_type=password&username=${model.email}&password=${model.password}`;
        return this.http.postToTokenUrl(data)
            .map(res => res.json())
            .map(userDetails => {
                this.userDetails = userDetails;
                console.log(this.userDetails);
                this.saveUserInformationInStorage(userDetails);
                this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, true);
                return this.userDetails;
            });
    }

    // Method that handles user logout
    public logOut(): void {
        this.storage.set(this.storageDbName, null).then(() => {
            this.userDetails = null;
            this.eventCtrl.publish(this.eventService.UserLoginStatusChanged, false);
        });
    }

    // Method that handles user registration and then obtains a valid token for the new user
    public register(model: RegisterViewModel): Observable<UserAccountViewModel> {
        return this.http.post('account', model)
            .map(res => res.json())
            .flatMap((userDetails: UserAccountViewModel) => {
                let logInViewModel = new LogInViewModel();
                logInViewModel.email = model.email;
                logInViewModel.password = model.password;
                return this.logIn(logInViewModel);
            });
    }

    // Method that requests a new password for the user
    public resetPassword(model: PasswordResetViewModel): Observable<string> {
        return this.http.put('account/reset-password', model).map(res => res.json());
    }    

    // Method that saves the user information in the local storage
    private saveUserInformationInStorage(userDetails: UserAccountViewModel) {
        this.userDetails = userDetails
        return this.storage.set(this.storageDbName, JSON.stringify(userDetails));
    }

    // Method that returns the user information
    public getCurrentUserDetails(): UserAccountViewModel {
        return this.userDetails;
    }

    // Method that returns the access token of the user
    public getCurrentToken(): string {
        return this.userDetails.access_token;
    }
}