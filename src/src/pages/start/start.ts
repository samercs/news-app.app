// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
import { SelectMealPage } from '../../pages/select-meal/select-meal';

// Models
import { ProjectModel } from '../../providers/project.services';

// Utils
import { CustomDropdown } from '../../utils/custom-dropdown/custom-dropdown.component';

@Component({
	selector: 'page-start',
	templateUrl: 'start.html'
})
export class StartPage extends BasePage {

	public projects: Array<ProjectModel> = [];
	public selectedProject: number;
	public projectPin: string;

	constructor(public injector: Injector) {
		super(injector);
	}

	ionViewDidLoad() {
		this.helpers.showLoadingMessage().then(() => {
			this.domain.projectService.getProjects().subscribe((data) => {
				this.projects = data;
				this.helpers.hideLoadingMessage();
			});
		});
		this.domain.projectService.getCurrentProject().subscribe(project => {
			this.selectedProject = project ? project.id : null;
		});
	}

	public showProjectDropdown(): void {
		let options = this.projects.map((project) => { return { key: project.id, value: project.name }; }),
            projectDropsown = this.ionic.modalCtrl.create(CustomDropdown,
                {
                    title: 'Project',
                    placeholder: 'Search project...',
                    showIcons: false,
                    itemsName: 'project',
                    options: options
                });

        projectDropsown.onDidDismiss(selectedOption => {
            if (selectedOption) {
                this.selectedProject = selectedOption.key;
            }
        });

        projectDropsown.present();
	}

	public saveProject() {
		let project = this.projects.find(pro => pro.id == this.selectedProject);
		if (!project) {
			this.helpers.showBasicAlertMessage("Error", "Select project first.");
			return;
		}
		if (project.pinCode == this.projectPin) {
			let project = this.projects.find(i => i.id == this.selectedProject);
			this.domain.projectService.setProject(project);
			this.helpers.redirectTo(SelectMealPage, false);
		} else {
			this.helpers.showBasicAlertMessage("Error", "Error project pin please check project pin and try again");
		}
	}
}
