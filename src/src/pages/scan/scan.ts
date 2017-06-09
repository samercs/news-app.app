// Angular references
import { Component, Injector, ViewChild } from '@angular/core';

// Ionic Native references
import { Device, NativeAudio, Keyboard } from 'ionic-native';

// Pages
import { BasePage } from '../../core/pages/base';
import { StartPage } from '../../pages/start/start';
import { SelectMealPage } from '../../pages/select-meal/select-meal';
import { PopoverPage } from './edit-popover/edit-popover';

// Models
import { ProjectModel } from '../../providers/project.services';
import { MealModel } from '../../providers/meal.services';
import { TicketCountModel } from '../../providers/ticket.services';

enum StatusEnum {
	Empty,
	Valid,
	Invalid
}

@Component({
	selector: 'page-scan',
	templateUrl: 'scan.html'
})
export class ScanPage extends BasePage {
	@ViewChild('barcodeInput') barcodeInput;

	public project: ProjectModel;
	public meal: MealModel;
	public barcode: string;

	public status: StatusEnum;

	public emptyStatus: StatusEnum = StatusEnum.Empty;
	public validStatus: StatusEnum = StatusEnum.Valid;
	public invalidStatus: StatusEnum = StatusEnum.Invalid;

	public statusColor: string = 'secondary';
	public countInfo: TicketCountModel = new TicketCountModel();
	public maxCountInfo: number;

	constructor(public injector: Injector, ) {
		super(injector);
	}

	ionViewDidLoad() {
		this.domain.projectService.getCurrentProject().subscribe(project => {
			if (!project) {
				this.helpers.redirectTo(StartPage);
			} else {
				this.domain.mealService.getCurrentMeal().subscribe(meal => {
					if (!meal) {
						this.helpers.redirectTo(SelectMealPage);
					} else {
						this.project = project;
						this.meal = meal;
						this.status = StatusEnum.Empty;
						this.domain.ticketService.getScanCounts().subscribe(data => {
							this.countInfo = data;
							this.maxCountInfo = Math.max(this.countInfo.b, this.countInfo.d, this.countInfo.l, this.countInfo.s);
						});
					}
				});
			}
		});
	}

	ionViewDidEnter() {
		// Set the focus on the input when entering to the page
		setTimeout(() => { this.barcodeInput.setFocus(); }, 150);
		setTimeout(() => { Keyboard.close(); }, 250);
	}

	public barcodeChange() {

		if (this.barcode.length === 10) {
			let date = this.barcode.substring(0, 2),
				meal = this.barcode.substring(2, 4),
				type = this.barcode.substring(4, 6),
				extra = this.barcode.substring(6, 10),
				today = new Date();

			console.log(`${date}-${meal}-${type}-${extra}`);

			if (parseInt(date) != today.getDate()) {
				this.setInvalidStatus();
				return;
			}

			if (parseInt(meal) != this.meal.id) {
				this.setInvalidStatus();
				console.log(meal);
				console.log(this.meal.id);
				return;
			}

			this.setValidStatus();
			this.domain.ticketService.saveTicket(this.project.id, date, meal, type, extra, Device.uuid).subscribe(saveTicket => {
				console.log('Call getScanCounts()');
				this.domain.ticketService.getScanCounts().subscribe(info => {
					this.countInfo = info;
					this.maxCountInfo = Math.max(this.countInfo.b, this.countInfo.d, this.countInfo.l, this.countInfo.s);
				});
			});
		} else {

			// Reset the barcode if the scan returns a -1 value
			if (this.barcode === '-1') { this.barcode = ''; };

			this.status = StatusEnum.Empty;
		}
	}

	private resetStatus(): void {
		setTimeout(() => {
			this.status = StatusEnum.Empty;
			this.barcode = '';
		}, 2000);
	}

	private setInvalidStatus(): void {
		this.status = StatusEnum.Invalid;
		NativeAudio.play('error');
		this.resetStatus();
	}

	private setValidStatus(): void {
		this.status = StatusEnum.Valid;
		NativeAudio.play('success');
		this.resetStatus();
	}

	public showOptions(event): void {
		let popover = this.ionic.popoverCtrl.create(PopoverPage);
		popover.present({ ev: event });
	}
}
