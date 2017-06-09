// Angular references
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';

// Ionic Native references
import { Keyboard } from 'ionic-native';

// Ionic references
import { Platform, ViewController, NavParams, InfiniteScroll } from 'ionic-angular';

@Component({
    selector: 'custom-dropdown',
    templateUrl: 'custom-dropdown.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDropdown {
    @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

    public title: string;
    public placeholder: string;
    public itemsName: string;
    public showIcons: boolean;

    public useVirtualScroll: boolean;

    private pageSize: number = 20;

    public options: Array<any>;
    public visibleOptions: Array<any>;

    public selectedOption: any;

    constructor(private platform: Platform,
                private viewCtrl: ViewController,
                private paramsCtrl: NavParams) {
        this.title = this.paramsCtrl.get('title');
        this.placeholder = this.paramsCtrl.get('placeholder');
        this.showIcons = this.paramsCtrl.get('showIcons');
        this.itemsName = this.paramsCtrl.get('itemsName');

        // Only use the virtual scroll on android
        this.useVirtualScroll = this.platform.is('android');

        this.resetOptions();

        if (!this.useVirtualScroll) {
            this.visibleOptions = this.options.splice(0, this.pageSize);
        }
    }

    // Method that closes the modal and returns the selected value
    public exit(): void {
        // Close the keyboard if open.
        Keyboard.close();

        this.viewCtrl.dismiss(this.selectedOption);
    }

    // Method that closes the keyboard if open
    public closeKeyboard(): void {
        Keyboard.close();
    }

    // Method that resets the available options
    private resetOptions(): void {
        this.selectedOption = null;
        this.options = this.paramsCtrl.get('options').slice() || [];
    }

    // Method that returns the selected option
    public selectOption(option: any) {
        this.selectedOption = option;

        // Close the keyboard if open.
        Keyboard.close();

        this.viewCtrl.dismiss(this.selectedOption);
    }

    // Method that filters the available options according to the text entered on the searchbar
    public filterAvailableOptions(event: any) {
        let enteredText = event.target.value;
        this.resetOptions();

        if (enteredText && enteredText.trim() != '') {
            this.options = this.options.filter((option) => {
                return (option.value.toLowerCase().indexOf(enteredText.toLowerCase()) > -1);
            });
        }

        if (!this.useVirtualScroll) {
            this.visibleOptions = this.options.splice(0, this.pageSize);
            this.infiniteScroll.enable(true);
        }

    }

    // Method that allows Angular to identify different options
    public identifyOption(index: number, option: any) {
        return index;
    }

    // Method that loads the next page of options
    public loadMoreOptions(infiniteScroll: InfiniteScroll): void {
        if (this.options.length) {
            let nextPageOptions = this.options.splice(0, this.pageSize);
            Array.prototype.push.apply(this.visibleOptions, nextPageOptions);
            infiniteScroll.complete();
        } else {
            // All options have been shown, infinite scroll is not needed anymore
            infiniteScroll.enable(false);
        }
    }
}