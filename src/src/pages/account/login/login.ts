// Angular
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Pages
import { BasePage } from '../../../core/pages/base';
import { PasswordResetPage } from '../password-reset/password-reset';
import { StartPage } from '../../start/start';

// Models and services
import { LogInViewModel } from '../../../providers/account-services';
import { ValidationHelper } from '../../../utils/validation/validation.helper';

// Animations
import { FadeInUp, FadeIn } from '../../../utils/animations';



@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    animations: [
        FadeIn('emailFieldFadeIn', '300ms linear'),
        FadeIn('passwordFieldFadeIn', '300ms 300ms linear'),
        FadeInUp('forgotPasswordLinkFadeIn', '300ms 600ms linear'),
        FadeInUp('loginButtonFadeInUp', '300ms 900ms linear')
    ]
})
export class LogInPage extends BasePage {

    public model: LogInViewModel;
    public signInForm: FormGroup;

    public submitError: string;
    public submitAttempt: boolean;

    // Animation states
    public emailFieldState: string = 'inactive';
    public passwordFieldState: string = 'inactive';
    public forgotPasswordLinkState: string = 'inactive';
    public loginButtonState: string = 'inactive';

    constructor(public injector: Injector,
                public formBuilder: FormBuilder) {
        super(injector);
        this.initializeForm();
    }

    ionViewDidEnter() {        
        this.applyPageAnimations();
    }

    // Method that initializes the form
    private initializeForm(): void {
        this.model = new LogInViewModel();
        this.submitAttempt = false;
        this.submitError = null;

        this.signInForm = this.formBuilder.group({
            email: ['', [Validators.required, ValidationHelper.emailValidator]],
            password: ['', [Validators.required]]
        });

        // Reset the submit error when changing the email
        this.signInForm.get('email').valueChanges.subscribe(() => {
            this.submitError = null;
        });

        // Reset the submit error when changing the password
        this.signInForm.get('password').valueChanges.subscribe(() => {
            this.submitError = null;
        });
    }

    // Method that sends the user information to the server
    public signIn(): void {
        this.submitAttempt = true;
        this.submitError = null;

        if (this.signInForm.valid) {
            this.helpers.showLoadingMessage().then(() => {

                // Initialize the model
                this.model.email = this.signInForm.get('email').value;
                this.model.password = this.signInForm.get('password').value;

                this.domain.accountService.logIn(this.model).subscribe((result) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        
                        this.helpers.redirectTo(StartPage, true);
                    });
                }, (error) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        this.submitError = 'VALIDATIONS.INVALID_EMAIL_OR_PASSWORD';
                    });
                });
            })
        }
    }

    // Method that redirects the user to the NeedPasswordPage
    public resetPassword(): void {
        this.helpers.redirectTo(PasswordResetPage);
    }

    private applyPageAnimations(): void {
        this.emailFieldState = 'active';
        this.passwordFieldState = 'active';
        this.forgotPasswordLinkState = 'active';
        this.loginButtonState = 'active';
    }
}