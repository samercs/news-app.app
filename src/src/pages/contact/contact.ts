// Angular references
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Pages
import { BasePage } from '../../core/pages/base';
import { StartPage } from '../../pages/start/start';

// Models
import { ContactModel } from '../../providers/contact-services';

// Animations
import { FadeInUp, FadeIn } from '../../utils/animations';

import { ValidationHelper } from '../../utils/validation/validation.helper';

@Component({
	selector: 'page-contact',
	templateUrl: 'contact.html',
	animations: [
        FadeIn('emailFieldFadeIn', '300ms linear'),
        FadeIn('passwordFieldFadeIn', '300ms 300ms linear'),
        FadeInUp('forgotPasswordLinkFadeIn', '300ms 600ms linear'),
        FadeInUp('loginButtonFadeInUp', '300ms 900ms linear')
    ]
})
export class ContactPage extends BasePage {

	public signInForm: FormGroup;
	public model: ContactModel;
	public emailFieldState: string = 'inactive';

	constructor(public injector: Injector, public formBuilder: FormBuilder) {
		super(injector);
		this.initializeForm();
	} 

	ionViewDidLoad() {
		this.applyPageAnimations();
	}

	private initializeForm(): void {
        this.model = new ContactModel();
        this.model.name = '';
        this.signInForm = this.formBuilder.group({
            name: ['', [Validators.required]],
			title: ['', [Validators.required]],
			message: ['', [Validators.required]],
			email: ['', [Validators.required, ValidationHelper.emailValidator]]
        });        
    }

	private applyPageAnimations(): void {
        this.emailFieldState = 'active';        
    }

	public submit(){
		if (this.signInForm.valid) {
			this.helpers.showLoadingMessage().then(() => {
				this.model.name = this.signInForm.get('name').value;
				this.model.title = this.signInForm.get('title').value;
				this.model.message = this.signInForm.get('message').value;
				this.model.email = this.signInForm.get('email').value;
				this.domain.contactService.submit(this.model).subscribe(data => {
					this.helpers.hideLoadingMessage().then(() => {
						this.helpers.showAlertMessageWithCallbacks('', 'تم ارسال الرسالة بنجاح. سوف يقوم فريق الموقع بالتواصل معك قريبا', [{buttonText: 'موافق', callback: () => {
							this.helpers.redirectTo(StartPage, true);
						} }]);
					});
				});
			});
		}
	}
}
