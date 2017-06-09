// Angular
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and services
import { RegisterViewModel } from '../../../providers/account-services';
import { ValidationHelper } from '../../../utils/validation/validation.helper';


// Pages
import { BasePage } from '../../../core/pages/base';
import { StartPage } from '../../start/start';

/*import { ThankYouPage } from '../thank-you/thank-you';*/

// Animations
import { FadeInUp, FadeIn } from '../../../utils/animations';



@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
    animations: [
        FadeIn('firstNameFieldFadeIn', '300ms linear'),
        FadeIn('lastNameFieldFadeIn', '300ms 300ms linear'),
        FadeIn('emailFieldFadeIn', '300ms 600ms linear'),
        FadeIn('countryFieldFadeIn', '300ms 900ms linear'),
        FadeIn('phoneCodeFieldFadeIn', '300ms 1200ms linear'),
        FadeIn('phoneNumberFieldFadeIn', '300ms 1500ms linear'),
        FadeIn('passwordFieldFadeIn', '300ms 1800ms linear'),
        FadeIn('confirmPasswordFieldFadeIn', '300ms 2100ms linear'),
        FadeInUp('registerButonFadeInUp', '300ms 2400ms linear')
    ]
})
export class RegisterPage extends BasePage {

    public registerForm: FormGroup;
    public submitAttempt: boolean;
    public model: RegisterViewModel;
    // Animation states
    public firstNameFieldState: string = 'inactive';
    public lastNameFieldState: string = 'inactive';
    public emailFieldState: string = 'inactive';
    public countryFieldState: string = 'inactive';
    public phoneCodeFieldState: string = 'inactive';
    public phoneNumberFieldState: string = 'inactive';
    public passwordFieldState: string = 'inactive';
    public confirmPasswordFieldState: string = 'inactive';
    public registerButonState: string = 'inactive';

    constructor(public injector: Injector,
        public formBuilder: FormBuilder) {
        super(injector);

        // Creates the form without data
        this.createEmptyForm();

        this.applyPageAnimations();

    }

    // Method that initializes the form
    private createEmptyForm(): void {
        this.model = new RegisterViewModel();
        this.submitAttempt = false;

        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(30)]],
            lastName: ['', [Validators.required, Validators.maxLength(30)]],
            email: ['', [Validators.required, ValidationHelper.emailValidator]],            
            password: ['', [Validators.required, ValidationHelper.passwordValidator]],
            confirmPassword: ['']
        }, {
                // The matching password validation is related to the entire form, 
                // and not with just a single field
                validator: ValidationHelper.matchingPasswordsValidator
            });
    }

    // Method that creates the model with the information of the form
    private getModelFromForm(): RegisterViewModel {
        let model = new RegisterViewModel();

        model.firstName = this.registerForm.get('firstName').value;
        model.lastName = this.registerForm.get('lastName').value;
        model.email = this.registerForm.get('email').value;
        model.password = this.registerForm.get('password').value;
        model.confirmPassword = this.registerForm.get('confirmPassword').value;    

        return model;
    }    
    // Method that sends the user information to the server
    public register(): void {
        this.submitAttempt = true;
        if (this.registerForm.valid) {
            this.helpers.showLoadingMessage().then(() => {
                this.model = this.getModelFromForm();
                this.domain.accountService.register(this.model).subscribe(() => {
                    this.helpers.hideLoadingMessage().then(() => {                        
                        //To Be Change to thank you page
                        this.helpers.redirectTo(StartPage, true);
                    });
                }, (error) => {
                    this.helpers.hideLoadingMessage().then(() => {
                        let errorMessage = this.helpers.getErrorMessage(error);
                        this.helpers.showBasicAlertMessage('ERROR', errorMessage);
                    });
                });
            });
        }
    }

    private applyPageAnimations(): void {
        this.firstNameFieldState = 'active';
        this.lastNameFieldState = 'active';
        this.emailFieldState = 'active';
        this.countryFieldState = 'active';
        this.phoneCodeFieldState = 'active';
        this.phoneNumberFieldState = 'active';
        this.passwordFieldState = 'active';
        this.confirmPasswordFieldState = 'active';
        this.registerButonState = 'active';
    }
}