// Angular references
import { FormControl } from '@angular/forms';

export enum ErrorTypeEnum {
    REQUIRED,
    INVALID_EMAIL_ADDRESS,
    INVALID_PASSWORD,
    INVALID_PHONE_NUMBER,
    INVALID_PHONE_COUNTRY_CODE,
    PASSWORDS_DO_NOT_MATCH,
    MIN_LENGTH,
    MAX_LENGTH,
    USERNAME_TAKEN,
    INVALID_USERNAME,
    ACCEPT_TERMS_AND_CONDITIONS
}

export class ValidationHelper {

    // Method that returns the error message
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {};

        config['required'] = this.getErrorTypeName(ErrorTypeEnum.REQUIRED);

        config['invalidEmailAddress'] = this.getErrorTypeName(ErrorTypeEnum.INVALID_EMAIL_ADDRESS);
        config['invalidPassword'] = this.getErrorTypeName(ErrorTypeEnum.INVALID_PASSWORD);
        config['invalidPhoneCountryCode'] = this.getErrorTypeName(ErrorTypeEnum.INVALID_PHONE_COUNTRY_CODE);
        config['invalidPhoneNumber'] = this.getErrorTypeName(ErrorTypeEnum.INVALID_PHONE_NUMBER);

        config['passwordsDoNotMatch'] = this.getErrorTypeName(ErrorTypeEnum.PASSWORDS_DO_NOT_MATCH);

        config['usernameTaken'] = this.getErrorTypeName(ErrorTypeEnum.USERNAME_TAKEN);
        config['invalidUserName'] = this.getErrorTypeName(ErrorTypeEnum.INVALID_USERNAME);

        config['acceptTermsAndConditions'] = this.getErrorTypeName(ErrorTypeEnum.ACCEPT_TERMS_AND_CONDITIONS);

        if (validatorValue) {
            config['minlength'] = this.getErrorTypeName(ErrorTypeEnum.MIN_LENGTH);
            config['maxlength'] = this.getErrorTypeName(ErrorTypeEnum.MAX_LENGTH);
        }
        return config[validatorName];
    }

    // Method that returns the name of the error type, to be used with ng2 translate
    static getErrorTypeName(errorType: ErrorTypeEnum): string {
        switch (errorType) {
            case ErrorTypeEnum.REQUIRED:
                return 'VALIDATIONS.REQUIRED';
            case ErrorTypeEnum.INVALID_EMAIL_ADDRESS:
                return 'VALIDATIONS.INVALID_EMAIL_ADDRESS';
            case ErrorTypeEnum.INVALID_PASSWORD:
                return 'VALIDATIONS.INVALID_PASSWORD';
            case ErrorTypeEnum.INVALID_PHONE_NUMBER:
                return 'VALIDATIONS.INVALID_PHONE_NUMBER';
            case ErrorTypeEnum.INVALID_PHONE_COUNTRY_CODE:
                return 'VALIDATIONS.INVALID_PHONE_COUNTRY_CODE';
            case ErrorTypeEnum.PASSWORDS_DO_NOT_MATCH:
                return 'VALIDATIONS.PASSWORDS_DO_NOT_MATCH';
            case ErrorTypeEnum.MIN_LENGTH:
                return 'VALIDATIONS.MIN_LENGTH';
            case ErrorTypeEnum.MAX_LENGTH:
                return 'VALIDATIONS.MAX_LENGTH';
            case ErrorTypeEnum.USERNAME_TAKEN:
                return 'VALIDATIONS.USERNAME_TAKEN';
            case ErrorTypeEnum.INVALID_USERNAME:
                return 'VALIDATIONS.INVALID_USERNAME';
            case ErrorTypeEnum.ACCEPT_TERMS_AND_CONDITIONS:
                return 'VALIDATIONS.ACCEPT_TERMS_AND_CONDITIONS';
            default:
                return 'VALIDATIONS.INVALID_FIELD';
        }
    }

    // Method that returns the error type name (if any) from the control sent as parameter
    static getErrorMessageFromFormControl(control: FormControl): string {
        let errorCode: string;
        for (let errorName in control.errors) {
            errorCode = this.getValidatorErrorMessage(errorName, control.errors[errorName]);
        }
        return errorCode;
    }

    // Method that returns a parameter (if any) that should be added in the error from the control sent as parameter
    static getErrorParameterFromFormControl(control: FormControl, fieldName: string): any {
        let errorCode: string, param: any = { value: '' };
        for (let errorName in control.errors) {
            errorCode = this.getValidatorErrorMessage(errorName, control.errors[errorName]);

            if (errorCode === this.getErrorTypeName(ErrorTypeEnum.REQUIRED)) {
                // If the error is because a required field, we add the name of the field as parameter 
                // to show it in the error message
                param.value = fieldName;
            } else if (errorCode === this.getErrorTypeName(ErrorTypeEnum.MAX_LENGTH) || errorCode === this.getErrorTypeName(ErrorTypeEnum.MAX_LENGTH)) {
                    param.value = control.errors[errorName].requiredLength;
            } else if (control.errors[errorName]) {
                // If the control has information about the error (like the min or max length of the field)
                // we add that information to the error message
                param.value = control.errors[errorName];
            }
        }
        return param;
    }

    // Validation for email fields
    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value === '' || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    // Validation for password fields
    static passwordValidator(control) {
        // {6,100}: Assert password is between 6 and 100 characters
        if (control.value.match(/^[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    // Validation for matching passwords
    // NOTE: As of now, this validation requires both controls to be named 'password' and 'confirmPassword'
    static matchingPasswordsValidator(controlGroup) {
        let passwordControl = controlGroup.get('password');
        let confirmPasswordControl = controlGroup.get('confirmPassword');

        // If the password field is not valid, we don't show this error message
        if (passwordControl.valid && passwordControl.value !== confirmPasswordControl.value) {
            return { 'passwordsDoNotMatch': true };
        } else {
            return null;
        }
    }

    // Validation for terms and conditions
    static termsAndConditionValidator(control) {
        if (control.value === true) {
            return null;
        } else {
            return { 'acceptTermsAndConditions': true };
        }
    }

    // Validation for phone country code fields
    static phoneCountryCodeValidator(control) {
        if (control.value === '' || control.value.match(/^\+?([0-9]{1,3})$/)) {
            return null;
        } else {
            return { 'invalidPhoneCountryCode': true };
        }
    }

    // Validation for phone number fields
    static phoneNumberValidator(control) {
        if (control.value === '' || control.value.match(/^[0-9\s-\(\)\.]{7,15}$/)) {
            return null;
        } else {
            return { 'invalidPhoneNumber': true };
        }
    }

    // Validation for user name fields
    static userNameValidator(control) {
        if (control.value === '' || control.value.match(/^[a-zA-Z0-9-\._]+$/)) {
            return null;
        } else {
            return { 'invalidUserName': true };
        }
    }
}