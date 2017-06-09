// Angular references
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Pages
import { BasePage } from '../../core/pages/base';
import { StartPage } from '../../pages/start/start';

// Models
import { IssueModel } from '../../providers/issue-services';

// Animations
import { FadeInUp, FadeIn } from '../../utils/animations';

import { ValidationHelper } from '../../utils/validation/validation.helper';

@Component({
	selector: 'page-issue',
	templateUrl: 'issue.html',
	animations: [
        FadeIn('emailFieldFadeIn', '300ms linear'),
        FadeIn('passwordFieldFadeIn', '300ms 300ms linear'),
        FadeInUp('forgotPasswordLinkFadeIn', '300ms 600ms linear'),
        FadeInUp('loginButtonFadeInUp', '300ms 900ms linear')
    ]
})
export class IssuePage extends BasePage {

	public signInForm: FormGroup;
	public model: IssueModel;
	public emailFieldState: string = 'inactive';

	constructor(public injector: Injector, public formBuilder: FormBuilder) {
		super(injector);
		this.initializeForm();
	} 

	ionViewDidLoad() {
		this.applyPageAnimations();
	}

	private initializeForm(): void {
        this.model = new IssueModel();
        this.model.title = '';
		this.model.description = '';
        this.signInForm = this.formBuilder.group({            
			title: ['', [Validators.required]],
			description: ['', [Validators.required]]
        });        
    }

	private applyPageAnimations(): void {
        this.emailFieldState = 'active';        
    }

	public submit(){
		if (this.signInForm.valid) {
			this.helpers.showLoadingMessage().then(() => {
				this.model.title = this.signInForm.get('title').value;
				this.model.description = this.signInForm.get('description').value;
				this.domain.issueService.submit(this.model).subscribe(data => {
					this.helpers.hideLoadingMessage().then(() => {
						this.helpers.showAlertMessageWithCallbacks('', 'تم ارسال الابلاغ بنجاح. سوف يقوم فريق الموقع في البحث و اصلاح الخلل', [{buttonText: 'موافق', callback: () => {
							this.helpers.redirectTo(StartPage, true);
						} }]);
					});
				});
			});
		}
	}
}
