// Angular references
import { Component, Injector } from '@angular/core';

// Pages
import { BasePage } from '../../core/pages/base';
import { ScanPage } from '../../pages/scan/scan';

// Models
import { MealModel } from '../../providers/meal.services';

@Component({
	selector: 'page-select-meal',
	templateUrl: 'select-meal.html'
})
export class SelectMealPage extends BasePage {

	public meals: Array<MealModel> = [];
	public selectedMeal: number;

	constructor(public injector: Injector) {
		super(injector);		
	}	

	ionViewDidLoad(){
		this.meals = this.domain.mealService.getMeals();
		this.domain.mealService.getCurrentMeal().subscribe(meal => {
			this.selectedMeal = meal ? meal.id : null;
		});	
	}

	public saveMeal() {
		let meal = this.meals.find(pro => pro.id == this.selectedMeal);
		if (!meal) {
			this.helpers.showBasicAlertMessage("Error", "Select meal first.");
			return;
		}
		this.domain.mealService.setMeal(meal);
		this.helpers.redirectTo(ScanPage, true);
	}

	// Fix for ios radio button: click event not being fired unless the icon is clicked
	public selectMeal(mealId: number): void {
		this.selectedMeal = mealId;
	}
}
