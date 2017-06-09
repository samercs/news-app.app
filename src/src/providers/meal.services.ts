import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

export class MealModel {
    id: number;
    value: string;
}

@Injectable()
export class MealService {
    
    private storageDbName: string = 'Tickting:selectedMealStorage';    

    constructor(private storage: Storage) { }

    public getMeals(): Array<MealModel> {
        let list: Array<MealModel> = [];
        let meal = new MealModel();
        meal.id = 1;
        meal.value = 'Breakfast';
        list.push(meal);
        meal = new MealModel();
        meal.id = 2;
        meal.value = 'Lunch';
        list.push(meal);
        meal = new MealModel();
        meal.id = 3;
        meal.value = 'Dinner';
        list.push(meal);
        meal = new MealModel();
        meal.id = 4;
        meal.value = 'Snack';
        list.push(meal);
        return list;
    }

    public setMeal(meal: MealModel) {
        this.storage.set(this.storageDbName, JSON.stringify(meal));
    }

    public getCurrentMeal(): Observable<MealModel> {
        return Observable.create(observable => {
            this.storage.get(this.storageDbName).then(data => {
                if (data) {
                    let meal = JSON.parse(data);
                    if (!meal || !meal.id) {
                        observable.next();
                        observable.complete();
                    }else{
                        observable.next(meal);
                        observable.complete();
                    }
                } else {
                    observable.next();
                    observable.complete(null);
                }
            });
        });
    }   
}